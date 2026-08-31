'use client';

import type { Meal } from '@/lib/types';
import { componentSummary } from '@/lib/mealLogic';
import { IllustrationStage, illustrationForMeal, ApproveIcon, SwapIcon, DislikeIcon } from '@/components/Illustrations';

interface DayRow {
  date: string;
  season: 'summer' | 'winter';
  breakfast: Meal;
  breakfast_approved: boolean;
  lunch: Meal;
  lunch_approved: boolean;
  dinner: Meal;
  dinner_approved: boolean;
  snack: Meal | null;
  snack_approved: boolean;
}

const SLOT_LABEL: Record<string, string> = { breakfast: 'בוקר', lunch: 'צהריים', dinner: 'ערב', snack: 'נשנוש' };

// All four slots the day card renders. 'snack' is the planned afternoon snack (14:00-16:00).
const SLOTS = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
type SlotName = (typeof SLOTS)[number];
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
  onDislike,
  dailyProteinTarget,
  dailyCalTarget,
}: {
  day: DayRow;
  expanded: boolean;
  onToggle: () => void;
  onApprove: (slot: SlotName) => void;
  onSwap: (slot: SlotName) => void;
  onDislike: (slot: SlotName) => void;
  dailyProteinTarget: number;
  dailyCalTarget: number;
}) {
  const d = new Date(day.date);

  const isApprovedFor = (s: SlotName): boolean => {
    if (s === 'breakfast') return day.breakfast_approved;
    if (s === 'lunch') return day.lunch_approved;
    if (s === 'dinner') return day.dinner_approved;
    return day.snack_approved;
  };

  // Only count slots that actually have a recipe — on a rare day with no snack available,
  // the day shouldn't look permanently incomplete.
  const presentSlots = SLOTS.filter((s) => !!day[s]);
  const approvedCount = presentSlots.filter(isApprovedFor).length;

  // Daily totals come from the three MAIN meals only. The afternoon snack is an optional
  // extra — it's deliberately excluded so the numbers shown reflect what the day is actually
  // planned to deliver, whether or not the snack is eaten.
  const MAIN_SLOTS = ['breakfast', 'lunch', 'dinner'] as const;
  const proteinTotal = MAIN_SLOTS.reduce((sum, s) => sum + (day[s]?.protein_g || 0), 0);
  const calTotal = MAIN_SLOTS.reduce((sum, s) => sum + (day[s]?.cal || 0), 0);

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
            background: proteinTotal >= dailyProteinTarget ? '#e3f6ea' : '#fde9e9',
            color: proteinTotal >= dailyProteinTarget ? '#16341f' : '#7a1f1f',
            whiteSpace: 'nowrap',
          }}
          title={
            proteinTotal >= dailyProteinTarget
              ? `עומדת ביעד (${dailyProteinTarget}g)`
              : `מתחת ליעד (${dailyProteinTarget}g) — חסרים ${dailyProteinTarget - proteinTotal}g`
          }
        >
          🥩 {proteinTotal}g{proteinTotal < dailyProteinTarget ? ' ⚠️' : ''}
        </span>
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
          title={`יעד יומי: ${dailyCalTarget} קק״ל (לא כולל נשנוש)`}
        >
          🔥 {calTotal}
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 50,
            background:
              approvedCount === presentSlots.length ? '#6ee7a0' : approvedCount > 0 ? 'var(--c-recv-bg)' : 'var(--bg2)',
            color: approvedCount === presentSlots.length ? '#16341f' : approvedCount > 0 ? '#8a6000' : 'var(--text-3)',
            whiteSpace: 'nowrap',
          }}
        >
          {approvedCount === presentSlots.length
            ? `✓ ${approvedCount}/${presentSlots.length} מאושר`
            : approvedCount > 0
              ? `${approvedCount}/${presentSlots.length} מאושר`
              : 'טרם אושר'}
        </span>
      </div>

      {expanded && (
        <div style={{ padding: '4px 12px 12px', borderTop: '1px solid var(--border-soft)' }}>
          {SLOTS.map((slot) => {
            const meal = day[slot];
            if (!meal) return null;
            const approved = isApprovedFor(slot);
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
                <IllustrationStage
                  kind={illustrationForMeal({ tags: meal.tags, mealSlot: meal.meal_slot, name: meal.name })}
                  size={38}
                  bg="var(--c-eat-bg)"
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{meal.name}</div>
                  {/* For meals built from several components, show what's actually in it —
                      e.g. "רצועות עוף בפפריקה + אפונה מאודה + סלט קטן". Single-component
                      meals would just repeat the name, so they're skipped. */}
                  {(meal.components?.length || 0) > 1 && (
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                      {componentSummary(meal.components || [])}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                    {meal.tags?.map((t) => (
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
                      ⏱ {meal.total_prep_min + meal.total_cook_min} דק׳
                    </span>
                    <span
                      style={{
                        fontSize: 9.5,
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: 50,
                        background:
                          meal.effort === 'קל' ? '#e3f6ea' : meal.effort === 'בינוני' ? 'var(--c-recv-bg)' : '#fde9e9',
                        color:
                          meal.effort === 'קל' ? '#16341f' : meal.effort === 'בינוני' ? '#8a6000' : '#7a1f1f',
                      }}
                      title="רמת מאמץ: זמן + מספר שלבים + מספר שיטות בישול"
                    >
                      {meal.effort === 'קל' ? '🟢' : meal.effort === 'בינוני' ? '🟡' : '🔴'} {meal.effort}
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
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          border: 'none',
                          background: 'transparent',
                          padding: 0,
                          cursor: 'pointer',
                        }}
                      >
                        <ApproveIcon size={30} />
                      </button>
                      <button
                        onClick={() => onSwap(slot)}
                        title="שנה"
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          border: 'none',
                          background: 'transparent',
                          padding: 0,
                          cursor: 'pointer',
                        }}
                      >
                        <SwapIcon size={30} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`להסיר את "${meal.name}" מהמאגר לצמיתות? הוא לא יוצע יותר בתפריטים עתידיים.`)) {
                            onDislike(slot);
                          }
                        }}
                        title="לא עובד לי — הסירי מהמאגר"
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          border: 'none',
                          background: 'transparent',
                          padding: 0,
                          cursor: 'pointer',
                        }}
                      >
                        <DislikeIcon size={30} />
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
