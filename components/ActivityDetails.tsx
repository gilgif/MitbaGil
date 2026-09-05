'use client';

import type { ScheduleEvent } from '@/lib/scheduleLogic';
import { mealIngredients, componentsWithInstructions } from '@/lib/mealLogic';
import { CaloriesIcon, ProteinIcon, PrepTimeIcon, EffortScale } from '@/components/Illustrations';

// The body of an activity's details — ingredients, per-component instructions, macros.
// Extracted so the schedule popup and the "now" page's inline expansion show exactly the
// same thing without maintaining two copies that could drift apart.

export function formatIngredientLine(ing: { name: string; qty: number; unit: string }): string {
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

export function SectionLabel({ children }: { children: React.ReactNode }) {
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

export default function ActivityDetails({ event }: { event: ScheduleEvent }) {
  const meal = event.meal;

  return (
    <>
      {event.detail && (
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 6 }}>{event.detail}</div>
      )}

      {event.burnCal !== undefined && (
        <div
          style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}
        >
          <CaloriesIcon size={14} /> שריפה משוערת: {event.burnCal} קק״ל
        </div>
      )}

      {/* Shopping list items */}
      {event.items && event.items.length > 0 && (
        <>
          <SectionLabel>רשימה</SectionLabel>
          <ul style={listStyle}>
            {event.items.map((item, i) => (
              <li key={i} style={itemStyle}>
                <span style={{ position: 'absolute', right: 0 }}>•</span>
                {item.name} — {Math.round(item.qty * 10) / 10} {item.unit}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* A meal may combine several components — some backed by a recipe (with
          instructions), some simple items that need none. Ingredients are merged across
          all of them; instructions are shown per component so it's clear what they belong to. */}
      {meal &&
        (() => {
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
                <span style={{ ...chipStyle, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <CaloriesIcon size={13} /> {meal.cal} קק״ל
                </span>
                <span style={{ ...chipStyle, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <ProteinIcon size={13} /> {meal.protein_g}g חלבון
                </span>
                <span style={{ ...chipStyle, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <PrepTimeIcon size={13} /> {meal.total_prep_min + meal.total_cook_min} דק׳
                </span>
                <span style={{ ...chipStyle, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <EffortScale level={meal.effort} width={28} /> {meal.effort}
                </span>
              </div>
            </>
          );
        })()}
    </>
  );
}
