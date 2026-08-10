import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { buildShoppingPlan } from '@/lib/shoppingLogic';
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

// GET /api/shopping?year=2026&month=6 — compute the consolidated shopping plan for approved meals
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
      '*, breakfast:recipes!menu_days_breakfast_recipe_id_fkey(*, ingredients:recipe_ingredients(*)), lunch:recipes!menu_days_lunch_recipe_id_fkey(*, ingredients:recipe_ingredients(*)), dinner:recipes!menu_days_dinner_recipe_id_fkey(*, ingredients:recipe_ingredients(*))'
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
  }));

  const approvals = (menuDays || []).map((d: any) => ({
    date: d.date,
    breakfast: d.breakfast_approved,
    lunch: d.lunch_approved,
    dinner: d.dinner_approved,
  }));

  const plan = buildShoppingPlan(days, approvals, settings as UserSettings, new Date(year, month, 1));
  return NextResponse.json(plan);
}
