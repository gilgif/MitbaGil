import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { generateMonth } from '@/lib/menuLogic';
import type { Recipe, UserSettings } from '@/lib/types';

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
      '*, breakfast:recipes!menu_days_breakfast_recipe_id_fkey(*, ingredients:recipe_ingredients(*)), lunch:recipes!menu_days_lunch_recipe_id_fkey(*, ingredients:recipe_ingredients(*)), dinner:recipes!menu_days_dinner_recipe_id_fkey(*, ingredients:recipe_ingredients(*))'
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

  const { data: recipes, error: recipeError } = await supabase
    .from('recipes')
    .select('*, ingredients:recipe_ingredients(*)');
  if (recipeError) return NextResponse.json({ error: recipeError.message }, { status: 500 });

  const { data: settings, error: settingsError } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single();
  if (settingsError) return NextResponse.json({ error: settingsError.message }, { status: 500 });

  const generated = generateMonth(recipes as Recipe[], year, month, {
    office_days: (settings as UserSettings).office_days,
    diet_mode: (settings as UserSettings).diet_mode,
    health_mode: (settings as UserSettings).health_mode,
  });

  const firstDay = new Date(year, month, 1).toISOString().slice(0, 10);
  const lastDay = new Date(year, month + 1, 0).toISOString().slice(0, 10);

  // Regenerating clears any existing days for this month first (confirmed via a confirm() dialog client-side)
  await supabase.from('menu_days').delete().eq('user_id', user.id).gte('date', firstDay).lte('date', lastDay);

  const rows = generated.map((day) => ({
    user_id: user.id,
    date: day.date,
    season: day.season,
    breakfast_recipe_id: day.breakfast.id,
    lunch_recipe_id: day.lunch.id,
    dinner_recipe_id: day.dinner.id,
    breakfast_approved: false,
    lunch_approved: false,
    dinner_approved: false,
  }));

  const { error: insertError } = await supabase.from('menu_days').insert(rows);
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  return NextResponse.json({ success: true, days: generated.length });
}
