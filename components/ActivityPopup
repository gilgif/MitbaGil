'use client';

import type { ScheduleEvent } from '@/lib/scheduleLogic';
import { TYPE_LABEL } from '@/lib/scheduleLogic';
import { mealIngredients, componentsWithInstructions } from '@/lib/mealLogic';

const TYPE_BG: Record<string, string> = {
  eat: 'var(--c-eat-bg)',
  cook: 'var(--c-cook-bg)',
  prep: 'var(--c-prep-bg)',
  shop: 'var(--c-shop-bg)',
  sport: 'var(--c-sport-bg)',
  recv: 'var(--c-recv-bg)',
  baby: 'var(--c-baby-bg)',
};

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

export default function ActivityPopup({
  event,
  onClose,
}: {
  event: ScheduleEvent | null;
  onClose: () => void;
}) {
  if (!event) return null;

  const meal = event.meal;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,.45)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          width: '100%',
          maxWidth: 480,
          borderRadius: '24px 24px 0 0',
          maxHeight: '85dvh',
          overflowY: 'auto',
          padding: '20px 20px calc(24px + env(safe-area-inset-bottom))',
        }}
      >
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 4,
            background: 'var(--border)',
            margin: '0 auto 16px',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: TYPE_BG[event.type] || 'var(--bg2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            {event.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)' }}>
              {event.time} · {TYPE_LABEL[event.type]}
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, lineHeight: 1.3 }}>{event.title}</div>
          </div>
        </div>

        {event.detail && (
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 14 }}>{event.detail}</div>
        )}

        {event.burnCal !== undefined && (
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 14 }}>
            🔥 שריפה משוערת: {event.burnCal} קק״ל
          </div>
        )}

        {/* Shopping list items */}
        {event.items && event.items.length > 0 && (
          <>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: 'var(--text-3)',
                textTransform: 'uppercase',
                margin: '14px 0 8px',
              }}
            >
              רשימה
            </div>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {event.items.map((item, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: 13.5,
                    color: 'var(--text-2)',
                    lineHeight: 1.5,
                    position: 'relative',
                    paddingRight: 16,
                  }}
                >
                  <span style={{ position: 'absolute', right: 0 }}>•</span>
                  {item.name} — {Math.round(item.qty * 10) / 10} {item.unit}
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Full meal detail. A meal may combine several components — some backed by a
            recipe (with instructions), some simple items that need none. Ingredients are
            merged across all of them; instructions are shown per component so it's clear
            which part they belong to. */}
        {meal && (
          <>
            {(() => {
              const components = [...(meal.components || [])].sort((a, b) => a.sort_order - b.sort_order);
              const ingredients = mealIngredients(components);
              const cookable = componentsWithInstructions(components);

              return (
                <>
                  {components.length > 1 && (
                    <>
                      <SectionLabel>מה בארוחה</SectionLabel>
                      <ul style={listStyle}>
                        {components.map((comp) => (
                          <li key={comp.id} style={itemStyle}>
                            <span style={{ position: 'absolute', right: 0 }}>•</span>
                            {comp.recipe?.name || comp.simple_name}
                            {!comp.recipe && (
                              <span style={{ color: 'var(--text-3)', fontSize: 12 }}> — ללא הכנה מיוחדת</span>
                            )}
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
                      <SectionLabel>
                        {components.length > 1 ? `הכנה — ${comp.recipe!.name}` : 'הכנה'}
                      </SectionLabel>
                      <ol style={{ paddingRight: 18, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {comp.recipe!.steps.map((s, i) => (
                          <li key={i} style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.6 }}>
                            {s}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}

                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                      flexWrap: 'wrap',
                      marginTop: 16,
                      paddingTop: 14,
                      borderTop: '1px solid var(--border-soft)',
                    }}
                  >
                    <span style={chipStyle}>🔥 {meal.cal} קק״ל</span>
                    <span style={chipStyle}>🥩 {meal.protein_g}g חלבון</span>
                    <span style={chipStyle}>⏱ {meal.total_prep_min + meal.total_cook_min} דק׳</span>
                    <span style={chipStyle}>💪 {meal.effort}</span>
                  </div>
                </>
              );
            })()}
          </>
        )}

        <button
          onClick={onClose}
          className="btn btn-ghost"
          style={{ width: '100%', marginTop: 20 }}
        >
          סגירה
        </button>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 800,
        color: 'var(--text-3)',
        textTransform: 'uppercase',
        margin: '16px 0 8px',
      }}
    >
      {children}
    </div>
  );
}

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const itemStyle: React.CSSProperties = {
  fontSize: 13.5,
  color: 'var(--text-2)',
  lineHeight: 1.5,
  position: 'relative',
  paddingRight: 16,
};

const chipStyle: React.CSSProperties = {
  fontSize: 11.5,
  fontWeight: 700,
  color: 'var(--text-3)',
  background: 'var(--bg2)',
  padding: '4px 10px',
  borderRadius: 50,
};
