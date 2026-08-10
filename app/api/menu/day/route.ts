import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { poolForSlot } from '@/lib/menuLogic';
import type { Recipe, UserSettings, MealSlot } from '@/lib/types';

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

// PATCH /api/menu/day — approve a meal slot, or swap it for a random alternative
// body: { date, slot: 'breakfast'|'lunch'|'dinner', action: 'approve'|'swap' }
export async function PATCH(req: NextRequest) {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { date, slot, action } = (await req.json()) as { date: string; slot: MealSlot; action: 'approve' | 'swap' };

  if (action === 'approve') {
    const { error } = await supabase
      .from('menu_days')
      .update({ [`${slot}_approved`]: true })
      .eq('user_id', user.id)
      .eq('date', date);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === 'swap') {
    const { data: day, error: dayError } = await supabase
      .from('menu_days')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', date)
      .single();
    if (dayError) return NextResponse.json({ error: dayError.message }, { status: 500 });

    const dow = new Date(date).getDay();
    const isOfficeDay = false; // office-day slots are non-swappable; enforced below via settings check

    const { data: settings } = await supabase.from('user_settings').select('*').eq('user_id', user.id).single();
    const officeDays = (settings as UserSettings)?.office_days || [];
    if (officeDays.includes(dow) && (slot === 'breakfast' || slot === 'lunch')) {
      return NextResponse.json({ error: 'Office-day slots are fixed and cannot be swapped' }, { status: 400 });
    }

    const { data: recipes, error: recipesError } = await supabase
      .from('recipes')
      .select('*, ingredients:recipe_ingredients(*)');
    if (recipesError) return NextResponse.json({ error: recipesError.message }, { status: 500 });

    const pool = poolForSlot(recipes as Recipe[], slot, day.season, dow, settings as UserSettings).filter(
      (r) => r.only_day === null && !r.only_days
    );
    if (!pool.length) return NextResponse.json({ error: 'No alternatives available' }, { status: 400 });

    const currentId = day[`${slot}_recipe_id`];
    let alt = pool[Math.floor(Math.random() * pool.length)];
    let attempts = 0;
    while (alt.id === currentId && attempts < 5) {
      alt = pool[Math.floor(Math.random() * pool.length)];
      attempts++;
    }

    const { error: updateError } = await supabase
      .from('menu_days')
      .update({ [`${slot}_recipe_id`]: alt.id, [`${slot}_approved`]: false })
      .eq('user_id', user.id)
      .eq('date', date);
    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

    return NextResponse.json({ success: true, newRecipe: alt });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
