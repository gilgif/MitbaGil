'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { createClient } from '@/lib/supabase';
import type { Recipe } from '@/lib/types';

interface TodayMeal {
  slot: 'breakfast' | 'lunch' | 'dinner';
  recipe: Recipe;
  approved: boolean;
}

const SLOT_LABEL: Record<string, string> = { breakfast: 'בוקר', lunch: 'צהריים', dinner: 'ערב' };
const SLOT_TIME_HINT: Record<string, string> = { breakfast: '09:00', lunch: '13:00', dinner: '18:00' };

export default function NowPage() {
  const [meals, setMeals] = useState<TodayMeal[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const dateStr = today.toISOString().slice(0, 10);

    (async () => {
      const res = await fetch(`/api/menu?year=${year}&month=${month}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const days = await res.json();
      const todayRow = days.find((d: any) => d.date === dateStr);
      if (!todayRow) {
        setMeals([]);
        setLoading(false);
        return;
      }
      const result: TodayMeal[] = [];
      (['breakfast', 'lunch', 'dinner'] as const).forEach((slot) => {
        if (todayRow[slot]) {
          result.push({ slot, recipe: todayRow[slot], approved: todayRow[`${slot}_approved`] });
        }
      });
      setMeals(result);
      setLoading(false);
    })();
  }, []);

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
        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>
          {new Date().toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>הארוחות שלך היום</div>

        {loading && <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>טוענת...</div>}

        {!loading && meals && meals.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>
            אין עדיין תפריט לחודש הזה — עברי לטאב תפריט כדי ליצור אחד
          </div>
        )}

        {!loading &&
          meals &&
          meals.map((m) => (
            <div
              key={m.slot}
              className="card"
              style={{
                padding: 20,
                marginBottom: 12,
                opacity: m.approved ? 1 : 0.85,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-3)' }}>
                  {SLOT_LABEL[m.slot]} · {SLOT_TIME_HINT[m.slot]}
                </div>
                {m.approved && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      background: '#e3f6ea',
                      color: '#16341f',
                      padding: '4px 10px',
                      borderRadius: 50,
                    }}
                  >
                    ✓ מאושר
                  </span>
                )}
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 6 }}>
                {m.recipe.icon} {m.recipe.name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
                {m.recipe.cal} קק״ל · {m.recipe.protein_g}g חלבון · {m.recipe.prep_min + m.recipe.cook_min} דק׳
              </div>
            </div>
          ))}
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
