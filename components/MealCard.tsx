'use client';

import { useState } from 'react';
import type { Meal } from '@/lib/types';
import { mealIngredients, componentsWithInstructions, componentSummary } from '@/lib/mealLogic';
import { IllustrationStage, illustrationForMeal } from '@/components/Illustrations';

function formatIngredientLine(ing: { name: string; qty: number; unit: string }): string {
  const countableUnits = ["יח'", 'יח׳', 'שיני', 'שן', 'כפות', 'כפית', 'כף', 'פרוסות', 'חופן', 'גביע', 'ראש', 'כוס', 'מנה'];
  if (countableUnits.includes(ing.unit)) {
    let qtyDisplay: string | number = ing.qty;
    if (ing.qty === 0.25) qtyDisplay = 'רבע';
    else if (ing.qty === 0.5) qtyDisplay = 'חצי';
    else if (ing.qty === 0.75) qtyDisplay = 'שלושת רבעי';
    return `${ing.name} — ${qtyDisplay} ${ing.unit}`;
  }
  return `${ing.name} — ${ing.qty} ${ing.unit}`;
}

const EFFORT_COLORS: Record<string, { bg: string; fg: string }> = {
  קל: { bg: '#e3f6ea', fg: '#16341f' },
  בינוני: { bg: 'var(--c-recv-bg)', fg: '#8a6000' },
  מורכב: { bg: '#fde9e9', fg: '#7a1f1f' },
};

export default function MealCard({
  meal,
  onApprove,
  onReject,
  onLike,
  onDislike,
}: {
  meal: Meal;
  onApprove?: () => void;
  onReject?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isPending = meal.status === 'pending';
  const isGil = meal.tags?.includes('גיל');
  const components = [...(meal.components || [])].sort((a, b) => a.sort_order - b.sort_order);
  const ingredients = mealIngredients(components);
  const cookable = componentsWithInstructions(components);
  const effortColor = EFFORT_COLORS[meal.effort] || EFFORT_COLORS['קל'];

  return (
    <div className="card" style={{ marginBottom: 10, overflow: 'hidden' }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px 10px', cursor: 'pointer' }}
      >
        <IllustrationStage
          kind={illustrationForMeal({ tags: meal.tags, mealSlot: meal.meal_slot, name: meal.name })}
          size={42}
          bg="var(--c-eat-bg)"
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 800 }}>{meal.name}</div>
          {/* For composed meals, show what's actually in it right under the name —
              e.g. "רצועות עוף בפפריקה + אפונה מאודה + סלט קטן" — so it's clear at a
              glance that this is a real composed meal, not a single dish. */}
          {components.length > 1 && (
            <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 2 }}>{componentSummary(components)}</div>
          )}
          <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
            {isGil && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: '#8a6000',
                  background: 'var(--c-recv-bg)',
                  padding: '2px 8px',
                  borderRadius: 50,
                }}
              >
                ⭐ של גיל
              </span>
            )}
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: effortColor.fg,
                background: effortColor.bg,
                padding: '2px 8px',
                borderRadius: 50,
              }}
            >
              {meal.effort === 'קל' ? '🟢' : meal.effort === 'בינוני' ? '🟡' : '🔴'} {meal.effort}
            </span>
            <span style={chipStyle}>⏱ {meal.total_prep_min + meal.total_cook_min} דק׳</span>
            <span style={chipStyle}>🥩 {meal.protein_g}g</span>
            {meal.batch_friendly && (meal.repeat_days || 1) > 1 && (
              <span style={chipStyle} title="מתאימה לבישול מרוכז">
                🍱 מחזיקה {meal.repeat_days} ימים
              </span>
            )}
            {isPending && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  background: 'var(--c-recv-bg)',
                  color: '#8a6000',
                  padding: '2px 8px',
                  borderRadius: 50,
                }}
              >
                הצעה חדשה
              </span>
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border-soft)', marginTop: 4, paddingTop: 12 }}>
          {components.length > 1 && (
            <>
              <SectionLabel>מה בארוחה</SectionLabel>
              <ul style={listStyle}>
                {components.map((comp) => (
                  <li key={comp.id} style={itemStyle}>
                    <span style={{ position: 'absolute', right: 0 }}>•</span>
                    {comp.recipe?.name || comp.simple_name}
                    {!comp.recipe && <span style={{ color: 'var(--text-3)', fontSize: 12 }}> — ללא הכנה מיוחדת</span>}
                  </li>
                ))}
              </ul>
            </>
          )}

          {ingredients.length > 0 && (
            <>
              <SectionLabel>מרכיבים</SectionLabel>
              <ul style={listStyle}>
                {ingredients.map((ing, i) => (
                  <li key={i} style={itemStyle}>
                    <span style={{ position: 'absolute', right: 0 }}>•</span>
                    {formatIngredientLine(ing)}
                  </li>
                ))}
              </ul>
            </>
          )}

          {cookable.map((comp) => (
            <div key={comp.id}>
              <SectionLabel>{components.length > 1 ? `הכנה — ${comp.recipe!.name}` : 'הכנה'}</SectionLabel>
              <ul style={listStyle}>
                {comp.recipe!.steps.map((s, i) => (
                  <li key={i} style={itemStyle}>
                    <span style={{ position: 'absolute', right: 0 }}>•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {isPending ? (
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button
                className="btn btn-primary btn-sm"
                style={{ flex: 1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove?.();
                }}
              >
                ✓ הוסיפי למאגר שלי
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onReject?.();
                }}
              >
                לא בשבילי
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLike?.();
                }}
                style={{
                  flex: 1,
                  padding: '9px 10px',
                  borderRadius: 12,
                  border: `1.5px solid ${meal.liked ? '#6ee7a0' : 'var(--border)'}`,
                  background: meal.liked ? '#e3f6ea' : 'var(--bg)',
                  color: meal.liked ? '#16341f' : 'var(--text-2)',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                👍 אוהבת
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDislike?.();
                }}
                style={{
                  flex: 1,
                  padding: '9px 10px',
                  borderRadius: 12,
                  border: `1.5px solid ${meal.disliked ? '#f0a5a5' : 'var(--border)'}`,
                  background: meal.disliked ? '#fde9e9' : 'var(--bg)',
                  color: meal.disliked ? '#7a1f1f' : 'var(--text-2)',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                👎 לא עובד לי
              </button>
            </div>
          )}
          {meal.disliked && (
            <div style={{ fontSize: 11.5, color: '#7a1f1f', marginTop: 6 }}>
              🚫 ארוחה זו לא תוצע יותר בתפריטים עתידיים
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', margin: '10px 0 6px' }}>
      {children}
    </div>
  );
}

const listStyle: React.CSSProperties = { listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 5 };
const itemStyle: React.CSSProperties = { fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5, position: 'relative', paddingRight: 14 };
const chipStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  color: 'var(--text-3)',
  background: 'var(--bg2)',
  padding: '2px 8px',
  borderRadius: 50,
};
