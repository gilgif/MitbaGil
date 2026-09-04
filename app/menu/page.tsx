'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import AppHeader from '@/components/AppHeader';
import MenuDayCard from '@/components/MenuDayCard';
import MealCard from '@/components/MealCard';
import type { Meal, UserSettings, ShoppingTrip } from '@/lib/types';

const HE_MONTHS = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
];

function seasonForDate(date: Date): 'summer' | 'winter' {
  const winterMonths = [9, 10, 11, 0, 1, 2];
  return winterMonths.includes(date.getMonth()) ? 'winter' : 'summer';
}

export default function MenuPage() {
  const today = new Date();
  const [monthOffset, setMonthOffset] = useState<0 | 1>(0); // 0 = current, 1 = next
  const [days, setDays] = useState<any[] | null>(null);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Meal[]>([]);
  const [recipeFilter, setRecipeFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [showDisliked, setShowDisliked] = useState(false);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [shoppingPlan, setShoppingPlan] = useState<{ trips: ShoppingTrip[]; totalMeals: number } | null>(null);
  const [generating, setGenerating] = useState(false);
  // Purely a UX signal, not a functional gate — shopping and the schedule already reflect
  // whatever's currently in the plan live, with or without this. It exists only to give a
  // clear "I'm done reviewing" moment, since swapping-until-satisfied with no formal end
  // point can otherwise feel like it's never really finished.
  const [monthReviewed, setMonthReviewed] = useState(false);
  const [loading, setLoading] = useState(true);

  const targetDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();
  const season = seasonForDate(targetDate);

  const loadMenu = useCallback(async () => {
    const res = await fetch(`/api/menu?year=${year}&month=${month}`);
    if (res.ok) {
      const data = await res.json();
      setDays(data.length ? data : null);
    }
  }, [year, month]);

  const loadRecipes = useCallback(async () => {
    const res = await fetch('/api/recipes');
    if (res.ok) setRecipes(await res.json());
  }, []);

  const loadSettings = useCallback(async () => {
    const res = await fetch('/api/settings');
    if (res.ok) setSettings(await res.json());
  }, []);

  const loadShoppingPlan = useCallback(async () => {
    const res = await fetch(`/api/shopping?year=${year}&month=${month}`);
    if (res.ok) setShoppingPlan(await res.json());
  }, [year, month]);

  useEffect(() => {
    setLoading(true);
    Promise.all([loadMenu(), loadRecipes(), loadSettings()]).then(() => setLoading(false));
  }, [loadMenu, loadRecipes, loadSettings]);

  useEffect(() => {
    if (days && days.length) loadShoppingPlan();
  }, [days, loadShoppingPlan]);

  async function handleGenerate() {
    setGenerating(true);
    await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year, month }),
    });
    await loadMenu();
    setGenerating(false);
  }

  async function handleRegenerate() {
    const ok = window.confirm('בטוחה? זה יחליף את כל הארוחות המוצעות החודש בהצעות חדשות. אישורים קיימים יימחקו.');
    if (!ok) return;
    setMonthReviewed(false);
    handleGenerate();
  }

  async function handleSwap(
    date: string,
    slot: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    preference?: 'hot' | 'cold'
  ) {
    const res = await fetch('/api/menu/day', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, slot, action: 'swap', preference }),
    });
    // A blocked or failed swap must tell the person why, rather than silently doing
    // nothing — a click with zero feedback reads as "the button is broken", not "this
    // meal can't be swapped for a good reason".
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      alert(body.error || 'לא ניתן להחליף את הארוחה הזו כרגע');
      return;
    }
    loadMenu();
  }

  async function handleDislike(date: string, slot: 'breakfast' | 'lunch' | 'dinner' | 'snack') {
    const res = await fetch('/api/menu/day', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, slot, action: 'dislike' }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      alert(body.error || 'לא ניתן להחליף את הארוחה הזו כרגע');
      return;
    }
    loadMenu();
    loadRecipes(); // the disliked recipe should now show as disliked in the recipe pool too
  }

  async function handleRecipeApprove(id: string) {
    await fetch(`/api/recipes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved', liked: true }),
    });
    loadRecipes();
  }

  async function handleRecipeReject(id: string) {
    await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
    loadRecipes();
  }

  async function handleRecipeLike(recipe: Meal) {
    await fetch(`/api/recipes/${recipe.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ liked: !recipe.liked, disliked: false }),
    });
    loadRecipes();
  }

  async function handleRecipeDislike(recipe: Meal) {
    await fetch(`/api/recipes/${recipe.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disliked: !recipe.disliked, liked: false }),
    });
    loadRecipes();
  }

  let filteredRecipes = recipes;
  // "שלי" used to check status==='approved', which almost everything already is — so it
  // barely filtered anything. It now checks the actual 'גיל' tag, so it genuinely shows
  // only your own recipes as intended.
  if (recipeFilter === 'approved') filteredRecipes = recipes.filter((r) => r.tags?.includes('גיל'));
  if (recipeFilter === 'pending') filteredRecipes = recipes.filter((r) => r.status === 'pending');
  const dislikedRecipes = filteredRecipes.filter((r) => r.disliked);
  const mainRecipes = filteredRecipes.filter((r) => !r.disliked);

  return (
    <div className="app-shell">
      <AppHeader />

      <div className="page-content" style={{ padding: '16px' }}>
        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>תפריט חודשי</div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>
          אישור לפי יום · לוחצות על יום כדי לראות ולאשר את 3 הארוחות שלו
        </div>

        <div className="toggle-group" style={{ marginBottom: 12 }}>
          <button
            className={`toggle-opt ${monthOffset === 0 ? 'active' : ''}`}
            onClick={() => { setMonthOffset(0); setMonthReviewed(false); }}
          >
            חודש נוכחי
          </button>
          <button
            className={`toggle-opt ${monthOffset === 1 ? 'active' : ''}`}
            onClick={() => { setMonthOffset(1); setMonthReviewed(false); }}
          >
            חודש הבא
          </button>
        </div>

        <div
          style={{
            display: 'inline-flex',
            padding: '6px 14px',
            borderRadius: 50,
            fontSize: 12.5,
            fontWeight: 700,
            marginBottom: 16,
            background: season === 'winter' ? 'var(--c-shop-bg)' : 'var(--c-recv-bg)',
            color: season === 'winter' ? '#3a5a8a' : '#8a6000',
          }}
        >
          {season === 'winter' ? '❄️ תפריט חורפי — מרקים ומנות חמות' : '☀️ תפריט קיצי — טרי, קר וקליל'}
        </div>

        {loading && <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>טוענת...</div>}

        {!loading && (!days || days.length === 0) && (
          <button
            className="btn btn-primary"
            style={{ width: '100%', padding: 16, fontSize: 15 }}
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? '⌛ יוצרת תפריט...' : '✨ צרי תפריט'}
          </button>
        )}

        {!loading && days && days.length > 0 && (
          <>
            <button className="btn btn-ghost btn-sm" onClick={handleRegenerate} style={{ marginBottom: 12 }}>
              🔄 הציעי תפריט מחדש
            </button>

            {days.map((day) => (
              <MenuDayCard
                key={day.date}
                day={day}
                expanded={expandedDay === day.date}
                onToggle={() => setExpandedDay(expandedDay === day.date ? null : day.date)}
                onSwap={(slot, preference) => handleSwap(day.date, slot, preference)}
                onDislike={(slot) => handleDislike(day.date, slot)}
                dailyProteinTarget={settings?.daily_protein_target || 95}
                dailyCalTarget={settings?.daily_cal_target || 1500}
              />
            ))}

            {/* A clear "I'm done reviewing" moment. Shopping and the schedule already
                reflect the plan live — this doesn't gate or freeze anything — it just
                gives a satisfying end point after swapping through the month, and a
                direct way to jump to what's next. */}
            {!monthReviewed ? (
              <button
                className="btn btn-primary"
                onClick={() => setMonthReviewed(true)}
                style={{ width: '100%', marginTop: 8 }}
              >
                ✓ סיימתי — בנה קניות ולו״ז
              </button>
            ) : (
              <div
                className="card"
                style={{
                  padding: 16,
                  marginTop: 8,
                  textAlign: 'center',
                  background: '#e3f6ea',
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 800, color: '#16341f', marginBottom: 10 }}>
                  🎉 התפריט מוכן! עדיין אפשר להחליף כל ארוחה בכל זמן.
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <Link href="/schedule" className="btn btn-ghost btn-sm">
                    ללו״ז
                  </Link>
                  <button className="btn btn-ghost btn-sm" onClick={() => setMonthReviewed(false)}>
                    להמשיך לעבור על התפריט
                  </button>
                </div>
              </div>
            )}

            {shoppingPlan && shoppingPlan.trips.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 17, fontWeight: 900, marginBottom: 4 }}>תכנון קניות מרוכז</div>
                <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 12 }}>
                  <strong>{shoppingPlan.trips.length}</strong> נסיעות קניה מרוכזות ל-
                  <strong>{shoppingPlan.totalMeals}</strong> ארוחות מאושרות
                </div>
                {shoppingPlan.trips.map((trip, i) => (
                  <div key={i} className="card" style={{ padding: '14px 16px', marginBottom: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 800 }}>{trip.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 8 }}>
                      {new Date(trip.date).toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {trip.items.map((item, j) => (
                        <li key={j} style={{ fontSize: 12.5, color: 'var(--text-2)' }}>
                          • {item.name} — {Math.round(item.qty * 10) / 10} {item.unit}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid var(--border)' }} />

        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>בנק ארוחות</div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>
          ארוחות שאת מכירה ואוהבת + הצעות חדשות לאישור — כולל ארוחות מורכבות מכמה מנות
        </div>

        <div className="toggle-group" style={{ marginBottom: 16 }}>
          <button className={`toggle-opt ${recipeFilter === 'all' ? 'active' : ''}`} onClick={() => setRecipeFilter('all')}>
            הכל
          </button>
          <button
            className={`toggle-opt ${recipeFilter === 'approved' ? 'active' : ''}`}
            onClick={() => setRecipeFilter('approved')}
          >
            שלי ⭐
          </button>
          <button
            className={`toggle-opt ${recipeFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setRecipeFilter('pending')}
          >
            הצעות חדשות
          </button>
        </div>

        {mainRecipes.map((r) => (
          <MealCard
            key={r.id}
            meal={r}
            onApprove={() => handleRecipeApprove(r.id)}
            onReject={() => handleRecipeReject(r.id)}
            onLike={() => handleRecipeLike(r)}
            onDislike={() => handleRecipeDislike(r)}
          />
        ))}

        {dislikedRecipes.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <button
              onClick={() => setShowDisliked(!showDisliked)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 16px',
                background: 'var(--bg2)',
                border: 'none',
                borderRadius: 12,
                color: 'var(--text-3)',
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <span>לא אהבתי ({dislikedRecipes.length})</span>
              <span style={{ transform: showDisliked ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>▾</span>
            </button>
            {showDisliked && (
              <div style={{ paddingTop: 8, opacity: 0.7 }}>
                {dislikedRecipes.map((r) => (
                  <MealCard
                    key={r.id}
                    meal={r}
                    onLike={() => handleRecipeLike(r)}
                    onDislike={() => handleRecipeDislike(r)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}


