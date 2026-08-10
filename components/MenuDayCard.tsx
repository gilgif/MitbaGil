'use client';

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

export default function MenuDayCard({
  day,
  expanded,
  onToggle,
  onApprove,
  onSwap,
}: {
  day: DayRow;
  expanded: boolean;
  onToggle: () => void;
  onApprove: (slot: 'breakfast' | 'lunch' | 'dinner') => void;
  onSwap: (slot: 'breakfast' | 'lunch' | 'dinner') => void;
}) {
  const d = new Date(day.date);
  const approvedCount = (['breakfast', 'lunch', 'dinner'] as const).filter((s) => {
    if (s === 'breakfast') return day.breakfast_approved;
    if (s === 'lunch') return day.lunch_approved;
    return day.dinner_approved;
  }).length;
  const proteinTotal = (['breakfast', 'lunch', 'dinner'] as const).reduce(
    (sum, s) => sum + (day[s]?.protein_g || 0),
    0
  );

  return (
    <div className="card" style={{ marginBottom: 8, overflow: 'hidden' }}>
      <div
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '13px 16px',
          cursor: 'pointer',
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 800, flex: 1 }}>
          {HE_DAYS[d.getDay()]}, {d.getDate()} ב{HE_MONTHS[d.getMonth()]}
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 50,
            background: 'var(--bg2)',
            color: 'var(--text-3)',
            whiteSpace: 'nowrap',
          }}
        >
          🥩 {proteinTotal}g
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 50,
            background: approvedCount === 3 ? '#6ee7a0' : approvedCount > 0 ? 'var(--c-recv-bg)' : 'var(--bg2)',
            color: approvedCount === 3 ? '#16341f' : approvedCount > 0 ? '#8a6000' : 'var(--text-3)',
            whiteSpace: 'nowrap',
          }}
        >
          {approvedCount === 3 ? '✓ 3/3 מאושר' : approvedCount > 0 ? `${approvedCount}/3 מאושר` : 'טרם אושר'}
        </span>
      </div>

      {expanded && (
        <div style={{ padding: '4px 12px 12px', borderTop: '1px solid var(--border-soft)' }}>
          {(['breakfast', 'lunch', 'dinner'] as const).map((slot) => {
            const recipe = day[slot];
            const approved =
              slot === 'breakfast' ? day.breakfast_approved : slot === 'lunch' ? day.lunch_approved : day.dinner_approved;
            if (!recipe) return null;
            return (
              <div
                key={slot}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 4px',
                  borderBottom: '1px solid var(--border-soft)',
                }}
              >
                <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-3)', width: 34, textAlign: 'center' }}>
                  {SLOT_LABEL[slot]}
                </div>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'var(--c-eat-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  {recipe.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{recipe.name}</div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                    {recipe.tags?.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: 9.5,
                          fontWeight: 700,
                          color: 'var(--text-3)',
                          background: 'var(--bg2)',
                          padding: '2px 7px',
                          borderRadius: 50,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                    <span
                      style={{
                        fontSize: 9.5,
                        fontWeight: 700,
                        color: 'var(--text-3)',
                        background: 'var(--bg2)',
                        padding: '2px 7px',
                        borderRadius: 50,
                      }}
                    >
                      ⏱ {recipe.prep_min + recipe.cook_min} דק׳
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                  {approved ? (
                    <span
                      style={{
                        padding: '4px 10px',
                        fontSize: 11,
                        background: '#6ee7a0',
                        color: '#16341f',
                        borderRadius: 50,
                        fontWeight: 800,
                      }}
                    >
                      ✓
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => onApprove(slot)}
                        title="מאשרת"
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          border: 'none',
                          background: 'var(--cta-black)',
                          color: '#fff',
                          cursor: 'pointer',
                          fontSize: 13,
                        }}
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => onSwap(slot)}
                        title="שנה"
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          border: 'none',
                          background: 'var(--bg2)',
                          cursor: 'pointer',
                          fontSize: 12,
                        }}
                      >
                        🔄
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
