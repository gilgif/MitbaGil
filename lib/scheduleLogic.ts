// Builds the unified daily schedule ("לו״ז") by merging every activity type into one
// chronological timeline — the piece that connects the approved menu to real daily life.
//
// Activity types (matching the original prototype exactly):
//   shop  — קניות        (buying/ordering groceries)
//   recv  — קבלת משלוח   (receiving a delivery, putting it away)
//   prep  — Meal Prep    (chopping/prepping ingredients ahead)
//   cook  — בישול        (the actual cooking)
//   eat   — ארוחה        (eating the meal)
//   sport — ספורט        (training sessions)
//   baby  — תינוקת       (the toddler's meals)

import type { Meal, UserSettings, ShoppingTrip } from './types';
import { mealIngredients } from './mealLogic';
import type { GeneratedDay } from './menuLogic';
import { buildShoppingPlan } from './shoppingLogic';

export type ActivityType = 'shop' | 'recv' | 'prep' | 'cook' | 'eat' | 'sport' | 'baby';

export const TYPE_LABEL: Record<ActivityType, string> = {
  shop: 'קניות',
  recv: 'קבלת משלוח',
  prep: 'Meal Prep',
  cook: 'בישול',
  eat: 'ארוחה',
  sport: 'ספורט',
  baby: 'תינוקת',
};

export const TYPE_ICON: Record<ActivityType, string> = {
  shop: '🛒',
  recv: '📦',
  prep: '🔪',
  cook: '👩‍🍳',
  eat: '🍽️',
  sport: '💪',
  baby: '👶',
};

export interface ScheduleEvent {
  id: string;
  date: string; // ISO date (YYYY-MM-DD)
  time: string; // HH:MM, used for chronological sorting
  type: ActivityType;
  icon: string;
  title: string;
  detail?: string;
  // Populated for meal/cook/prep events so the UI can show the full meal (all its
  // components, with instructions where they exist) on tap
  meal?: Meal;
  // Populated for shopping events so the UI can show the item list
  items?: { name: string; qty: number; unit: string }[];
  burnCal?: number; // for sport events
}

// ── Default times for each activity, per the user's real routine ──
const MEAL_TIMES: Record<'breakfast' | 'lunch' | 'dinner', string> = {
  breakfast: '09:15',
  lunch: '13:00',
  dinner: '18:00', // dinner cutoff — 3h before bed, eaten with the toddler
};

// Cooking happens shortly before the meal it belongs to; prep earlier still.
const COOK_LEAD_MINUTES = 45;
const PREP_LEAD_MINUTES = 90;

const SNACK_TIME = '15:00'; // the 14:00-16:00 afternoon craving window
const SHOP_TIME_DEFAULT = '09:00'; // meat / fish / dairy / pantry runs
const VEG_ORDER_MON = '10:30'; // Monday order → Tuesday evening delivery
const VEG_ORDER_WED = '10:00'; // Wednesday order → Thursday evening delivery
const DELIVERY_RECEIVE_TIME = '19:00'; // Tue/Thu evening deliveries arrive
const THAW_TIME = '18:00'; // move from freezer to fridge, evening before cooking

function shiftTime(time: string, deltaMinutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + deltaMinutes;
  const hh = Math.floor(((total % 1440) + 1440) % 1440 / 60);
  const mm = ((total % 60) + 60) % 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// A meal needs a real cooking step if any component takes cook time; it needs prep if
// total prep is meaningful (chopping etc.) beyond a token minute or two.
function needsCookStep(m: Meal): boolean {
  return (m.total_cook_min || 0) > 0;
}
function needsPrepStep(m: Meal): boolean {
  return (m.total_prep_min || 0) >= 10;
}

// Vegetable orders are placed the day before delivery, at the times the user specified.
// Deliveries themselves land Tuesday/Thursday evening.
function vegOrderTimeForDeliveryDay(deliveryDow: number): { orderDow: number; time: string } | null {
  if (deliveryDow === 2) return { orderDow: 1, time: VEG_ORDER_MON }; // Tue delivery ← Mon order
  if (deliveryDow === 4) return { orderDow: 3, time: VEG_ORDER_WED }; // Thu delivery ← Wed order
  return null;
}

export interface BuildScheduleArgs {
  days: GeneratedDay[];
  approvals: { date: string; breakfast: boolean; lunch: boolean; dinner: boolean; snack: boolean }[];
  settings: UserSettings;
  monthAnchor: Date;
}

// Produces every schedule event for the month, sorted by date then time.
// Only APPROVED meals generate cook/prep/shop/thaw events — an unapproved suggestion
// shouldn't put shopping on your list. Sport events are independent of the menu.
export function buildSchedule({ days, approvals, settings, monthAnchor }: BuildScheduleArgs): ScheduleEvent[] {
  const events: ScheduleEvent[] = [];
  const approvalByDate = new Map(approvals.map((a) => [a.date, a]));

  // ── 1. Meals, plus the cooking and prep they imply ──
  days.forEach((day) => {
    const approval = approvalByDate.get(day.date);
    (['breakfast', 'lunch', 'dinner'] as const).forEach((slot) => {
      const meal = day[slot];
      if (!meal) return;
      const isApproved = approval ? approval[slot] : false;
      const mealTime = MEAL_TIMES[slot];

      events.push({
        id: `eat-${day.date}-${slot}`,
        date: day.date,
        time: mealTime,
        type: 'eat',
        icon: meal.icon || TYPE_ICON.eat,
        title: meal.name,
        detail: `${meal.cal} קק״ל · ${meal.protein_g}g חלבון`,
        meal,
      });

      // Cooking / prep only make sense once you've actually committed to the meal.
      if (!isApproved) return;

      if (needsCookStep(meal)) {
        events.push({
          id: `cook-${day.date}-${slot}`,
          date: day.date,
          time: shiftTime(mealTime, -COOK_LEAD_MINUTES),
          type: 'cook',
          icon: TYPE_ICON.cook,
          title: `בישול: ${meal.name}`,
          detail: `${meal.total_cook_min} דק׳ בישול`,
          meal,
        });
      }
      if (needsPrepStep(meal)) {
        events.push({
          id: `prep-${day.date}-${slot}`,
          date: day.date,
          time: shiftTime(mealTime, -PREP_LEAD_MINUTES),
          type: 'prep',
          icon: TYPE_ICON.prep,
          title: `הכנה: ${meal.name}`,
          detail: `${meal.total_prep_min} דק׳ הכנה`,
          meal,
        });
      }

      // Anything using frozen meat needs to come out of the freezer the evening before.
      const usesFrozenMeat = mealIngredients(meal.components || []).some(
        (ing) => ing.freshness === 'freezer-meat'
      );
      if (usesFrozenMeat) {
        const thawDate = new Date(day.date);
        thawDate.setDate(thawDate.getDate() - (settings.thaw_lead_days || 1));
        events.push({
          id: `thaw-${day.date}-${slot}`,
          date: isoDate(thawDate),
          time: THAW_TIME,
          type: 'prep',
          icon: '🧊',
          title: `הוציאי להפשרה: ${meal.name}`,
          detail: `לבישול ב-${new Date(day.date).toLocaleDateString('he-IL')}`,
          meal,
        });
      }
    });

    // The afternoon snack shows up on the timeline so it's visible and plannable, but it
    // deliberately produces NO cook/prep/thaw events and NO reminders — the snacks are all
    // grab-and-eat by design, and the reminder job only ever loops over the three main meals.
    if (day.snack) {
      events.push({
        id: `snack-${day.date}`,
        date: day.date,
        time: SNACK_TIME,
        type: 'eat',
        icon: day.snack.icon || '🍎',
        title: day.snack.name,
        detail: `נשנוש אחה״צ · ${day.snack.cal} קק״ל · ${day.snack.protein_g}g חלבון`,
        meal: day.snack,
      });
    }
  });

  // ── 2. Shopping trips + the deliveries they produce ──
  const { trips } = buildShoppingPlan(days, approvals, settings, monthAnchor);
  trips.forEach((trip: ShoppingTrip, idx) => {
    const tripDate = new Date(trip.date);
    const dow = tripDate.getDay();

    if (trip.type === 'produce' || trip.type === 'sprouts') {
      // Organic veg is ordered online the day before, and arrives Tue/Thu evening.
      const orderInfo = vegOrderTimeForDeliveryDay(dow);
      if (orderInfo) {
        const orderDate = new Date(tripDate);
        orderDate.setDate(orderDate.getDate() - 1);
        events.push({
          id: `shop-${trip.type}-${trip.date}-${idx}`,
          date: isoDate(orderDate),
          time: orderInfo.time,
          type: 'shop',
          icon: '🌿',
          title: `הזמנת ${trip.type === 'sprouts' ? 'עלים ונבטים' : 'ירקות אורגניים'}`,
          detail: `${trip.items.length} פריטים · למשלוח מחר בערב`,
          items: trip.items,
        });
      }
      // The delivery itself
      events.push({
        id: `recv-${trip.type}-${trip.date}-${idx}`,
        date: trip.date,
        time: DELIVERY_RECEIVE_TIME,
        type: 'recv',
        icon: TYPE_ICON.recv,
        title: `קבלת ${trip.type === 'sprouts' ? 'עלים ונבטים' : 'ירקות'}`,
        detail: 'לסדר מיד בקירור — עלים קודם',
        items: trip.items,
      });
    } else {
      // Fish / meat / dairy / pantry — a physical shopping run on the morning of the trip.
      events.push({
        id: `shop-${trip.type}-${trip.date}-${idx}`,
        date: trip.date,
        time: SHOP_TIME_DEFAULT,
        type: 'shop',
        icon:
          trip.type === 'fish' ? '🐟' : trip.type === 'meat' ? '🥩' : trip.type === 'dairy' ? '🧀' : '🧂',
        title: trip.label,
        detail: `${trip.items.length} פריטים`,
        items: trip.items,
      });
    }
  });

  // ── 3. Training sessions (independent of the menu) ──
  const strengthDays = settings.strength_days || [];
  const strengthTime = settings.strength_time || '08:15';
  const runningDays = settings.running_can_replace || [];
  days.forEach((day) => {
    const dow = new Date(day.date).getDay();
    if (!strengthDays.includes(dow)) return;
    // Tuesday and Thursday are flexible: strength can be swapped for running, and on
    // Tuesday specifically for dance. The schedule shows the options rather than assuming.
    const canBeRunning = runningDays.includes(dow);
    const canBeDance = dow === 2; // Tuesday
    events.push({
      id: `sport-${day.date}`,
      date: day.date,
      time: strengthTime,
      type: 'sport',
      icon: canBeDance ? '💃' : canBeRunning ? '🏃‍♀️' : TYPE_ICON.sport,
      title: canBeDance
        ? 'אימון כוח / ריצה / ריקוד'
        : canBeRunning
          ? 'אימון כוח או ריצה'
          : 'אימון כוח',
      detail: canBeDance
        ? 'אפשר להחליף בריצה קלה או בשיעור ריקוד'
        : canBeRunning
          ? 'אפשר להחליף בריצה קלה'
          : '30–45 דקות',
      burnCal: canBeRunning ? 280 : 220,
    });
  });

  events.sort((a, b) => (a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)));
  return events;
}

import { illustrationForMeal, type IllustrationKind } from '@/components/Illustrations';

// Which illustration represents this event. Meal events (breakfast/lunch/dinner/snack)
// use the meal's own food category so a salad looks like a salad, not a generic apple;
// every other event type maps directly since the activity types and illustration kinds
// share the same names.
export function illustrationForEvent(event: ScheduleEvent): IllustrationKind {
  if (event.type === 'eat' && event.meal) {
    return illustrationForMeal({
      tags: event.meal.tags,
      mealSlot: event.meal.meal_slot,
      name: event.meal.name,
    });
  }
  const direct: Record<string, IllustrationKind> = {
    eat: 'eat', cook: 'cook', prep: 'prep', shop: 'shop', sport: 'sport', recv: 'recv', baby: 'baby',
  };
  return direct[event.type] || 'eat';
}

// Convenience: all events for one specific date, already in chronological order.
export function eventsForDate(events: ScheduleEvent[], date: string): ScheduleEvent[] {
  return events.filter((e) => e.date === date);
}
