import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { poolForSlot, dayTotals, scoreDay, effortBudgetForDay, mealCategory, HARD_NO_REPEAT } from '@/lib/menuLogic';
import type { Meal, UserSettings, MealSlot } from '@/lib/types';

function getSupabase() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

// PATCH /api/menu/day — approve a meal slot, swap it for a random alternative, or mark the
// current recipe as disliked (removes it from future generations AND swaps it out of today)
// body: { date, slot: 'breakfast'|'lunch'|'dinner', action: 'approve'|'swap'|'dislike' }
export async function PATCH(req: NextRequest) {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { date, slot, action } = (await req.json()) as {
    date: string;
    slot: MealSlot;
    action: 'approve' | 'swap' | 'dislike';
  };

  if (action === 'approve') {
    const { error } = await supabase
      .from('menu_days')
      .update({ [`${slot}_approved`]: true })
      .eq('user_id', user.id)
      .eq('date', date);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === 'swap' || action === 'dislike') {
    const { data: day, error: dayError } = await supabase
      .from('menu_days')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', date)
      .single();
    if (dayError) return NextResponse.json({ error: dayError.message }, { status: 500 });

    const dow = new Date(date).getDay();

    const { data: settings } = await supabase.from('user_settings').select('*').eq('user_id', user.id).single();
    const officeDays = (settings as UserSettings)?.office_days || [];
    if (officeDays.includes(dow) && (slot === 'breakfast' || slot === 'lunch')) {
      return NextResponse.json({ error: 'Office-day slots are fixed and cannot be swapped' }, { status: 400 });
    }

    const currentId = day[`${slot}_meal_id`];

    // For 'dislike': mark the current recipe as disliked so it stops appearing in any
    // future month generation, in addition to swapping it out of today.
    if (action === 'dislike' && currentId) {
      const { error: dislikeError } = await supabase
        .from('meals')
        .update({ disliked: true, liked: false })
        .eq('id', currentId);
      if (dislikeError) return NextResponse.json({ error: dislikeError.message }, { status: 500 });
    }

    const { data: meals, error: recipesError } = await supabase
      .from('meals')
      .select(
        '*, components:meal_components(*, recipe:recipes(*, ingredients:recipe_ingredients(*)), simple_ingredients:simple_component_ingredients(*))'
      );
    if (recipesError) return NextResponse.json({ error: recipesError.message }, { status: 500 });

    const pool = poolForSlot(meals as Meal[], slot, day.season, dow, settings as UserSettings).filter(
      (r) =>
        r.only_day === null &&
        !r.only_days &&
        // For the snack slot, only the planned afternoon snacks are valid alternatives.
        // The 'חירום-21:00' emergency snacks must never be reachable via the swap button —
        // they're a manual, browse-only list, not part of the planned rotation.
        (slot !== 'snack' || r.tags?.includes('אחה״צ'))
    );
    if (!pool.length) return NextResponse.json({ error: 'No alternatives available' }, { status: 400 });

    // Day-aware swap: the replacement is chosen by how good it makes the WHOLE DAY, not
    // just by being a different recipe. Swapping out a salad shouldn't quietly drop the
    // day under its protein target — the scorer weighs protein, calories and the
    // fresh/cooked balance together, exactly as month generation does.
    //
    // The snack slot is excluded from this: it isn't part of the day's nutrition planning,
    // so for snacks we just rotate to a different option.
    const allMeals = meals as Meal[];
    const otherSlots =
      slot === 'breakfast'
        ? (['lunch', 'dinner'] as const)
        : slot === 'lunch'
          ? (['breakfast', 'dinner'] as const)
          : (['breakfast', 'lunch'] as const);

    let alt: Meal;

    if (slot === 'snack') {
      const options = pool.filter((r) => r.id !== currentId);
      alt = (options.length ? options : pool)[Math.floor(Math.random() * (options.length || pool.length))];
    } else {
      const currentOthers = otherSlots.map((s) =>
        allMeals.find((r) => r.id === day[`${s}_meal_id`])
      );
      const [otherA, otherB] = currentOthers;

      const targets = {
        proteinTarget: (settings as UserSettings).daily_protein_target || 95,
        calTarget: (settings as UserSettings).daily_cal_target || 1500,
        season: day.season as 'summer' | 'winter',
        // The swap should respect the same effort budget as generation — swapping into a
        // two-hour stew on an office day would defeat the purpose.
        effortBudget: effortBudgetForDay(
          dow,
          (settings as UserSettings).office_days || [],
          (settings as UserSettings).strength_days || []
        ),
      };

      // If the OTHER meal today is already in a hard-no-repeat category (fish, salad,
      // meat), that category is excluded outright from this slot's alternatives — eating
      // it twice a day isn't a reasonable repeat (unlike eggs, which are fine twice), so
      // it shouldn't even be offered as an option to swap into. Chicken is a softer case
      // and is left to the day-scorer's penalty below rather than excluded outright.
      const otherCategories = [otherA, otherB].map((m) => mealCategory(m));
      const bannedCategories = HARD_NO_REPEAT.filter((cat) => otherCategories.includes(cat));
      const swapPool = bannedCategories.length
        ? pool.filter((r) => !bannedCategories.includes(mealCategory(r)))
        : pool;
      // Fall back to the full pool only if excluding these categories would leave
      // nothing at all — better to offer a repeat than to offer no alternatives.
      const usablePool = swapPool.length ? swapPool : pool;

      const scored = usablePool
        .filter((r) => r.id !== currentId)
        .map((candidate) => {
          // Rebuild the day with this candidate in the swapped slot, then score it whole.
          const trio =
            slot === 'breakfast'
              ? { breakfast: candidate, lunch: otherA!, dinner: otherB! }
              : slot === 'lunch'
                ? { breakfast: otherA!, lunch: candidate, dinner: otherB! }
                : { breakfast: otherA!, lunch: otherB!, dinner: candidate };
          const usable = trio.breakfast && trio.lunch && trio.dinner;
          return {
            candidate,
            score: usable ? scoreDay(dayTotals(trio.breakfast, trio.lunch, trio.dinner), targets) : -Infinity,
          };
        })
        .sort((a, b) => b.score - a.score);

      if (!scored.length) return NextResponse.json({ error: 'No alternatives available' }, { status: 400 });

      // Pick randomly among the top few rather than always the single best, so repeated
      // taps on 🔄 still feel like they're offering real choice rather than one fixed answer.
      // Offer more real choice on swap — was capped at 4, which is why repeated taps
      // could feel like they were cycling through the same handful of options.
      const topN = scored.slice(0, Math.min(8, scored.length));
      alt = topN[Math.floor(Math.random() * topN.length)].candidate;
    }

    const { error: updateError } = await supabase
      .from('menu_days')
      .update({ [`${slot}_meal_id`]: alt.id, [`${slot}_approved`]: false })
      .eq('user_id', user.id)
      .eq('date', date);
    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

    return NextResponse.json({ success: true, newMeal: alt });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
