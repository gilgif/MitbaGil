'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import type { Recipe } from '@/lib/types';

interface DayRow {
  date: string;
  season: 'summer' | 'winter';
  breakfast: Recipe;
  breakfast_approved: boolean;
  lunch: Recipe;
  lunch_approved: boolean;
  dinner: Recipe;
  dinner_approved: boolean;
}

const SLOT_LABEL: Record<string, string> = { breakfast: 'בוקר', lunch: 'צהריים', dinner: 'ערב' };
const HE_DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
const HE_MONTHS = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
];

export default function SchedulePage() {
  const [days, setDays] = useState<DayRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const today = new Date();

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/menu?year=${today.getFullYear()}&month=${today.getMonth()}`);
      if (res.ok) setDays(await res.json());
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 16 }}>
          לו״ז — {HE_MONTHS[today.getMonth()]} {today.getFullYear()}
        </div>

        {loading && <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>טוענת...</div>}

        {!loading && (!days || days.length === 0) && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>
            אין עדיין תפריט לחודש הזה — עברי לטאב תפריט כדי ליצור אחד
          </div>
        )}

        {!loading &&
          days &&
          days.map((day) => {
            const d = new Date(day.date);
            const isToday = day.date === today.toISOString().slice(0, 10);
            return (
              <div key={day.date} style={{ marginBottom: 18 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: isToday ? 'var(--ink)' : 'var(--text-3)',
                    marginBottom: 8,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  {HE_DAYS[d.getDay()]}, {d.getDate()} ב{HE_MONTHS[d.getMonth()]}
                  {isToday && ' · היום'}
                </div>
                {(['breakfast', 'lunch', 'dinner'] as const).map((slot) => {
                  const recipe = day[slot];
                  const approved =
                    slot === 'breakfast' ? day.breakfast_approved : slot === 'lunch' ? day.lunch_approved : day.dinner_approved;
                  if (!recipe) return null;
                  return (
                    <div
                      key={slot}
                      className="card"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '12px 14px',
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: '50%',
                          background: 'var(--c-eat-bg)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 18,
                          flexShrink: 0,
                        }}
                      >
                        {recipe.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)' }}>{SLOT_LABEL[slot]}</div>
                        <div style={{ fontSize: 14, fontWeight: 800 }}>{recipe.name}</div>
                      </div>
                      {approved && (
                        <span style={{ fontSize: 16, color: '#16341f' }}>✓</span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
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
