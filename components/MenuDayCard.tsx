'use client';

import { useState } from 'react';
import type { Meal } from '@/lib/types';
import { componentSummary } from '@/lib/mealLogic';
import { IllustrationStage, illustrationForMeal, SwapIcon, DislikeIcon } from '@/components/Illustrations';
import ActivityPopup from '@/components/ActivityPopup';
import type { ScheduleEvent } from '@/lib/scheduleLogic';

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
  onSwap,
  onDislike,
  dailyProteinTarget,
  dailyCalTarget,
}: {
  day: DayRow;
  expanded: boolean;
  onToggle: () => void;
  onSwap: (slot: SlotName, preference?: 'hot' | 'cold') => void;
  onDislike: (slot: SlotName) => void;
  dailyProteinTarget: number;
  dailyCalTarget: number;
}) {
  // Which slot's swap-preference menu is currently open, if any — the swap button opens
  // a small choice ("hot" / "cold" / "surprise me") rather than firing immediately, since
  // what someone wants to eat is a real-time craving, not something worth predicting in
  // advance during month generation.
  const [swapMenuSlot, setSwapMenuSlot] = useState<SlotName | null>(null);
  // Which meal's detail popup is open, if any — lets you see exactly why a meal is
  // tagged "complex" (which components, how long each takes to cook) instead of just
  // guessing from the name.
  const [detailSlot, setDetailSlot] = useState<SlotName | null>(null);
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
                <div
                  onClick={() => setDetailSlot(slot)}
                  style={{ display: 'contents', cursor: 'pointer' }}
                >
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
                      <span style={macroTagStyle}>🥩 {meal.protein_g}g</span>
                      <span style={macroTagStyle}>🔥 {meal.cal}</span>
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
                        title="רמת מאמץ: זמן + מספר שלבים + מספר שיטות בישול — הקישי על הארוחה לפרטים"
                      >
                        {meal.effort === 'קל' ? '🟢' : meal.effort === 'בינוני' ? '🟡' : '🔴'} {meal.effort}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                  {/* Every meal is "in the plan" by default now (auto-approved on
                      generation, and a swap immediately confirms the new choice too),
                      so this is a passive status badge rather than something to click —
                      there's no longer a separate confirmation step to wait for. */}
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
                  <div style={{ position: 'relative' }}>
                        <button
                          onClick={() => setSwapMenuSlot(swapMenuSlot === slot ? null : slot)}
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

                        {swapMenuSlot === slot && (
                          <>
                            {/* Backdrop to close the menu on an outside tap */}
                            <div
                              onClick={() => setSwapMenuSlot(null)}
                              style={{ position: 'fixed', inset: 0, zIndex: 90 }}
                            />
                            <div
                              style={{
                                position: 'absolute',
                                top: 34,
                                left: 0,
                                zIndex: 91,
                                background: 'var(--surface)',
                                borderRadius: 14,
                                boxShadow: '0 4px 16px rgba(0,0,0,.15)',
                                padding: 6,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                minWidth: 130,
                              }}
                            >
                              {[
                                { label: '🎲 הפתעה', pref: undefined },
                                { label: '🔥 משהו חם', pref: 'hot' as const },
                                { label: '🧊 משהו קר', pref: 'cold' as const },
                              ].map((opt) => (
                                <button
                                  key={opt.label}
                                  onClick={() => {
                                    setSwapMenuSlot(null);
                                    onSwap(slot, opt.pref);
                                  }}
                                  style={{
                                    textAlign: 'right',
                                    padding: '8px 10px',
                                    borderRadius: 8,
                                    border: 'none',
                                    background: 'transparent',
                                    fontSize: 13,
                                    cursor: 'pointer',
                                    color: 'var(--text)',
                                  }}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
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
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reuses the same popup already built for the schedule page — same look, same
          ingredient/instruction rendering — so meal details are consistent everywhere in
          the app rather than a second, different-looking detail view just for this
          screen. */}
      {detailSlot && day[detailSlot] && (
        <ActivityPopup
          event={
            {
              id: `menu-detail-${day.date}-${detailSlot}`,
              date: day.date,
              time: SLOT_LABEL[detailSlot],
              type: 'eat',
              icon: day[detailSlot]!.icon,
              title: day[detailSlot]!.name,
              detail: `${day[detailSlot]!.cal} קק״ל · ${day[detailSlot]!.protein_g}g חלבון`,
              meal: day[detailSlot]!,
            } as ScheduleEvent
          }
          onClose={() => setDetailSlot(null)}
        />
      )}
    </div>
  );
}

const macroTagStyle: React.CSSProperties = {
  fontSize: 9.5,
  fontWeight: 700,
  color: 'var(--text-3)',
  background: 'var(--bg2)',
  padding: '2px 7px',
  borderRadius: 50,
};
