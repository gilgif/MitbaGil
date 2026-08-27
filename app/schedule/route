import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { buildSchedule } from '@/lib/scheduleLogic';
import type { UserSettings } from '@/lib/types';
import type { GeneratedDay } from '@/lib/menuLogic';

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

// GET /api/schedule?year=2026&month=7 — the full chronological schedule for the month:
// meals, cooking, prep, thawing, shopping, deliveries and training, merged and sorted.
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

  const { data: menuDays, error: menuError } = await supabase
    .from('menu_days')
    .select(
      '*, breakfast:meals!menu_days_breakfast_meal_id_fkey(*, components:meal_components(*, recipe:recipes(*, ingredients:recipe_ingredients(*)), simple_ingredients:simple_component_ingredients(*))), lunch:meals!menu_days_lunch_meal_id_fkey(*, components:meal_components(*, recipe:recipes(*, ingredients:recipe_ingredients(*)), simple_ingredients:simple_component_ingredients(*))), dinner:meals!menu_days_dinner_meal_id_fkey(*, components:meal_components(*, recipe:recipes(*, ingredients:recipe_ingredients(*)), simple_ingredients:simple_component_ingredients(*))), snack:meals!menu_days_snack_meal_id_fkey(*, components:meal_components(*, recipe:recipes(*, ingredients:recipe_ingredients(*)), simple_ingredients:simple_component_ingredients(*)))'
    )
    .eq('user_id', user.id)
    .gte('date', firstDay)
    .lte('date', lastDay)
    .order('date');
  if (menuError) return NextResponse.json({ error: menuError.message }, { status: 500 });

  const { data: settings, error: settingsError } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single();
  if (settingsError) return NextResponse.json({ error: settingsError.message }, { status: 500 });

  const days: GeneratedDay[] = (menuDays || []).map((d: any) => ({
    date: d.date,
    season: d.season,
    breakfast: d.breakfast,
    lunch: d.lunch,
    dinner: d.dinner,
    snack: d.snack,
  }));

  const approvals = (menuDays || []).map((d: any) => ({
    date: d.date,
    breakfast: d.breakfast_approved,
    lunch: d.lunch_approved,
    dinner: d.dinner_approved,
    snack: d.snack_approved,
  }));

  const events = buildSchedule({
    days,
    approvals,
    settings: settings as UserSettings,
    monthAnchor: new Date(year, month, 1),
  });

  return NextResponse.json(events);
}
