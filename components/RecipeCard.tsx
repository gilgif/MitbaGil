'use client';

import { useState } from 'react';
import type { Recipe } from '@/lib/types';

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

export default function RecipeCard({
  recipe,
  onApprove,
  onReject,
  onLike,
  onDislike,
}: {
  recipe: Recipe;
  onApprove?: () => void;
  onReject?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isPending = recipe.status === 'pending';

  return (
    <div className="card" style={{ marginBottom: 10, overflow: 'hidden' }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px 10px', cursor: 'pointer' }}
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
            fontSize: 19,
            flexShrink: 0,
          }}
        >
          {recipe.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 800 }}>{recipe.name}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--text-3)',
                background: 'var(--bg2)',
                padding: '2px 8px',
                borderRadius: 50,
              }}
            >
              {recipe.category}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--text-3)',
                background: 'var(--bg2)',
                padding: '2px 8px',
                borderRadius: 50,
              }}
            >
              ⏱ {recipe.prep_min + recipe.cook_min} דק׳
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--text-3)',
                background: 'var(--bg2)',
                padding: '2px 8px',
                borderRadius: 50,
              }}
            >
              🥩 {recipe.protein_g}g
            </span>
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
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', margin: '10px 0 6px' }}>
            מרכיבים
          </div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {(recipe.ingredients || []).map((ing) => (
              <li key={ing.id} style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5, position: 'relative', paddingRight: 14 }}>
                <span style={{ position: 'absolute', right: 0 }}>•</span>
                {formatIngredientLine(ing)}
              </li>
            ))}
          </ul>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', margin: '10px 0 6px' }}>
            הכנה
          </div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {recipe.steps.map((s, i) => (
              <li key={i} style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5, position: 'relative', paddingRight: 14 }}>
                <span style={{ position: 'absolute', right: 0 }}>•</span>
                {s}
              </li>
            ))}
          </ul>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', margin: '10px 0 6px' }}>
            מקור
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{recipe.source}</div>

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
                  border: `1.5px solid ${recipe.liked ? '#6ee7a0' : 'var(--border)'}`,
                  background: recipe.liked ? '#e3f6ea' : 'var(--bg)',
                  color: recipe.liked ? '#16341f' : 'var(--text-2)',
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
                  border: `1.5px solid ${recipe.disliked ? '#f0a5a5' : 'var(--border)'}`,
                  background: recipe.disliked ? '#fde9e9' : 'var(--bg)',
                  color: recipe.disliked ? '#7a1f1f' : 'var(--text-2)',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                👎 לא עובד לי
              </button>
            </div>
          )}
          {recipe.disliked && (
            <div style={{ fontSize: 11.5, color: '#7a1f1f', marginTop: 6 }}>
              🚫 מתכון זה לא יוצע יותר בתפריטים עתידיים
            </div>
          )}
        </div>
      )}
    </div>
  );
}
