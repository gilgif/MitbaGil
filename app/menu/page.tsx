'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import MenuDayCard from '@/components/MenuDayCard';
import RecipeCard from '@/components/RecipeCard';
import type { Recipe, UserSettings, ShoppingTrip } from '@/lib/types';

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
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipeFilter, setRecipeFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [showDisliked, setShowDisliked] = useState(false);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [shoppingPlan, setShoppingPlan] = useState<{ trips: ShoppingTrip[]; totalMeals: number } | null>(null);
  const [generating, setGenerating] = useState(false);
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
    handleGenerate();
  }

  async function handleApprove(date: string, slot: 'breakfast' | 'lunch' | 'dinner') {
    await fetch('/api/menu/day', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, slot, action: 'approve' }),
    });
    loadMenu();
  }

  async function handleSwap(date: string, slot: 'breakfast' | 'lunch' | 'dinner') {
    await fetch('/api/menu/day', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, slot, action: 'swap' }),
    });
    loadMenu();
  }

  async function handleFilterChange(key: 'diet_mode' | 'health_mode', value: string) {
    await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [key]: value }),
    });
    loadSettings();
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

  async function handleRecipeLike(recipe: Recipe) {
    await fetch(`/api/recipes/${recipe.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ liked: !recipe.liked, disliked: false }),
    });
    loadRecipes();
  }

  async function handleRecipeDislike(recipe: Recipe) {
    await fetch(`/api/recipes/${recipe.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disliked: !recipe.disliked, liked: false }),
    });
    loadRecipes();
  }

  let filteredRecipes = recipes;
  if (recipeFilter === 'approved') filteredRecipes = recipes.filter((r) => r.status === 'approved');
  if (recipeFilter === 'pending') filteredRecipes = recipes.filter((r) => r.status === 'pending');
  const dislikedRecipes = filteredRecipes.filter((r) => r.disliked);
  const mainRecipes = filteredRecipes.filter((r) => !r.disliked);

  return (
    <div className="app-shell">
      <div className="top-bar" style={{ position: 'relative' }}>
        <div className="app-logo">
          מטב<span>גיל</span>
        </div>
        <Link href="/settings" style={settingsBtnStyle}>
          ⚙️
        </Link>
      </div>

      <div className="page-content" style={{ padding: '16px' }}>
        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>תפריט חודשי</div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>
          אישור לפי יום · לוחצות על יום כדי לראות ולאשר את 3 הארוחות שלו
        </div>

        <div className="toggle-group" style={{ marginBottom: 12 }}>
          <button
            className={`toggle-opt ${monthOffset === 0 ? 'active' : ''}`}
            onClick={() => setMonthOffset(0)}
          >
            חודש נוכחי
          </button>
          <button
            className={`toggle-opt ${monthOffset === 1 ? 'active' : ''}`}
            onClick={() => setMonthOffset(1)}
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

        {settings && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-2)' }}>רמת דיאטה</span>
              <div className="toggle-group" style={{ maxWidth: 220 }}>
                <button
                  className={`toggle-opt ${settings.diet_mode === 'any' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('diet_mode', 'any')}
                >
                  רגיל
                </button>
                <button
                  className={`toggle-opt ${settings.diet_mode === 'diet' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('diet_mode', 'diet')}
                >
                  דיאטטי בלבד
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-2)' }}>רמת בריאות</span>
              <div className="toggle-group" style={{ maxWidth: 220 }}>
                <button
                  className={`toggle-opt ${settings.health_mode === 'any' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('health_mode', 'any')}
                >
                  רגיל
                </button>
                <button
                  className={`toggle-opt ${settings.health_mode === 'healthy' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('health_mode', 'healthy')}
                >
                  בריא בלבד
                </button>
              </div>
            </div>
          </div>
        )}

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
                onApprove={(slot) => handleApprove(day.date, slot)}
                onSwap={(slot) => handleSwap(day.date, slot)}
              />
            ))}

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

        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>מאגר המתכונים שלי</div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>
          מתכונים שאת מכירה ואוהבת + הצעות חדשות לאישור
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
          <RecipeCard
            key={r.id}
            recipe={r}
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
                  <RecipeCard
                    key={r.id}
                    recipe={r}
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

const settingsBtnStyle: React.CSSProperties = {
  position: 'absolute',
  left: 16,
  width: 36,
  height: 36,
  borderRadius: '50%',
  background: 'var(--bg2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none',
  fontSize: 16,
};
