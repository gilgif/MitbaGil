import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { generateMonth } from '@/lib/menuLogic';
import type { Meal, UserSettings } from '@/lib/types';

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

// GET /api/menu?year=2026&month=6 — fetch the stored menu for a given month (0-indexed month)
export async function GET(req: NextRequest) {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const year = parseInt(req.nextUrl.searchParams.get('year') || '');
  const month = parseInt(req.nextUrl.searchParams.get('month') || '');
  if (isNaN(year) || isNaN(month)) {
    return NextResponse.json({ error: 'year and month are required' }, { status: 400 });
  }

  const firstDay = new Date(year, month, 1).toISOString().slice(0, 10);
  const lastDay = new Date(year, month + 1, 0).toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from('menu_days')
    .select(
      '*, breakfast:meals!menu_days_breakfast_meal_id_fkey(*, components:meal_components(*, recipe:recipes(*, ingredients:recipe_ingredients(*)), simple_ingredients:simple_component_ingredients(*))), lunch:meals!menu_days_lunch_meal_id_fkey(*, components:meal_components(*, recipe:recipes(*, ingredients:recipe_ingredients(*)), simple_ingredients:simple_component_ingredients(*))), dinner:meals!menu_days_dinner_meal_id_fkey(*, components:meal_components(*, recipe:recipes(*, ingredients:recipe_ingredients(*)), simple_ingredients:simple_component_ingredients(*))), snack:meals!menu_days_snack_meal_id_fkey(*, components:meal_components(*, recipe:recipes(*, ingredients:recipe_ingredients(*)), simple_ingredients:simple_component_ingredients(*)))'
    )
    .eq('user_id', user.id)
    .gte('date', firstDay)
    .lte('date', lastDay)
    .order('date');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/menu — generate (or regenerate) a full month's menu and store it
// body: { year, month } (0-indexed month)
export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { year, month } = await req.json();
  if (typeof year !== 'number' || typeof month !== 'number') {
    return NextResponse.json({ error: 'year and month (0-indexed) are required' }, { status: 400 });
  }

  // Planning happens over MEALS (which may combine several components) rather than
  // raw recipes. Components are pulled in so nutrition totals and shopping lists work.
  const { data: meals, error: mealError } = await supabase
    .from('meals')
    .select(
      '*, components:meal_components(*, recipe:recipes(*, ingredients:recipe_ingredients(*)), simple_ingredients:simple_component_ingredients(*))'
    );
  if (mealError) return NextResponse.json({ error: mealError.message }, { status: 500 });

  const { data: settings, error: settingsError } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single();
  if (settingsError) return NextResponse.json({ error: settingsError.message }, { status: 500 });

  const generated = generateMonth(meals as Meal[], year, month, {
    office_days: (settings as UserSettings).office_days,
    diet_mode: (settings as UserSettings).diet_mode,
    health_mode: (settings as UserSettings).health_mode,
    daily_protein_target: (settings as UserSettings).daily_protein_target,
    daily_cal_target: (settings as UserSettings).daily_cal_target,
    strength_days: (settings as UserSettings).strength_days,
  });

  const firstDay = new Date(year, month, 1).toISOString().slice(0, 10);
  const lastDay = new Date(year, month + 1, 0).toISOString().slice(0, 10);

  // Regenerating clears any existing days for this month first (confirmed via a confirm() dialog client-side)
  await supabase.from('menu_days').delete().eq('user_id', user.id).gte('date', firstDay).lte('date', lastDay);

  const rows = generated.map((day) => ({
    user_id: user.id,
    date: day.date,
    season: day.season,
    breakfast_meal_id: day.breakfast.id,
    lunch_meal_id: day.lunch.id,
    dinner_meal_id: day.dinner.id,
    snack_meal_id: day.snack ? day.snack.id : null,
    // Every meal is approved by default now — a generated month is presumed good until
    // swapped, rather than requiring a manual per-meal confirmation ritual. Shopping and
    // the cooking schedule read this flag directly, so this single change is what makes
    // "just swap what you don't want" actually work end-to-end.
    breakfast_approved: true,
    lunch_approved: true,
    dinner_approved: true,
    snack_approved: !!day.snack,
  }));

  const { error: insertError } = await supabase.from('menu_days').insert(rows);
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  return NextResponse.json({ success: true, days: generated.length });
}
