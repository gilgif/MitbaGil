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

const TYPE_ICON: Record<string, string> = {
  fish: '🐟',
  produce: '🌿',
  sprouts: '🌱',
  meat: '🥩',
  dairy: '🧀',
  pantry: '🧂',
};

// POST /api/reminders/generate — rebuilds shopping + thaw reminders for a given month
// from the currently-approved menu. Call this after approving/swapping meals.
// body: { year, month }
export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { year, month } = await req.json();
  const firstDay = new Date(year, month, 1).toISOString().slice(0, 10);
  const lastDay = new Date(year, month + 1, 0).toISOString().slice(0, 10);

  const { data: menuDays, error: menuError } = await supabase
    .from('menu_days')
    .select(
      '*, breakfast:recipes!menu_days_breakfast_recipe_id_fkey(*, ingredients:recipe_ingredients(*)), lunch:recipes!menu_days_lunch_recipe_id_fkey(*, ingredients:recipe_ingredients(*)), dinner:recipes!menu_days_dinner_recipe_id_fkey(*, ingredients:recipe_ingredients(*))'
    )
    .eq('user_id', user.id)
    .gte('date', firstDay)
    .lte('date', lastDay);
  if (menuError) return NextResponse.json({ error: menuError.message }, { status: 500 });

  const { data: settings, error: settingsError } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single();
  if (settingsError) return NextResponse.json({ error: settingsError.message }, { status: 500 });
  const userSettings = settings as UserSettings;

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

  const { trips } = buildShoppingPlan(days, approvals, userSettings, new Date(year, month, 1));

  // Clear old, not-yet-sent reminders for this month before regenerating
  await supabase
    .from('reminders')
    .delete()
    .eq('user_id', user.id)
    .eq('sent', false)
    .gte('scheduled_for', `${firstDay}T00:00:00`)
    .lte('scheduled_for', `${lastDay}T23:59:59`);

  const reminderRows: any[] = [];

  // One shopping reminder per trip, in the morning of the trip date
  trips.forEach((trip) => {
    reminderRows.push({
      user_id: user.id,
      type: trip.type === 'meat' ? 'shop' : trip.type === 'pantry' ? 'shop' : 'shop',
      title: `${TYPE_ICON[trip.type] || '🛒'} ${trip.label}`,
      body: trip.items.map((i) => `${i.name} — ${Math.round(i.qty * 10) / 10} ${i.unit}`).join(', '),
      scheduled_for: `${trip.date}T09:00:00`,
    });
  });

  // Thaw reminders: one per approved meal using freezer-meat ingredients, N days before cooking
  const thawLead = userSettings.thaw_lead_days;
  days.forEach((day, idx) => {
    const approval = approvals[idx];
    (['breakfast', 'lunch', 'dinner'] as const).forEach((slot) => {
      if (!approval[slot]) return;
      const recipe = day[slot];
      const hasFreezerMeat = recipe.ingredients?.some((i) => i.freshness === 'freezer-meat');
      if (!hasFreezerMeat) return;
      const cookDate = new Date(day.date);
      const reminderDate = new Date(cookDate);
      reminderDate.setDate(reminderDate.getDate() - thawLead);
      reminderRows.push({
        user_id: user.id,
        type: 'thaw',
        title: `🧊 הוציאי להפשרה: ${recipe.name}`,
        body: `בישול מתוכנן ל-${cookDate.toLocaleDateString('he-IL')}`,
        scheduled_for: `${reminderDate.toISOString().slice(0, 10)}T18:00:00`,
        related_recipe_id: recipe.id,
      });
    });
  });

  if (reminderRows.length) {
    const { error: insertError } = await supabase.from('reminders').insert(reminderRows);
    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, count: reminderRows.length });
}
