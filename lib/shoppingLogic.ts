// Shopping consolidation algorithm, ported from the HTML prototype.
// Groups ingredients from approved meals into the minimum number of shopping trips,
// respecting each ingredient's real-world freshness window.

import type { Recipe, UserSettings, ShoppingTrip, ShoppingTripItem } from './types';
import type { GeneratedDay } from './menuLogic';

interface ApprovedMeal {
  date: Date;
  recipe: Recipe;
}

function nextVegDeliveryOnOrAfter(date: Date, vegDays: number[]): Date {
  const d = new Date(date);
  for (let i = 0; i < 7; i++) {
    if (vegDays.includes(d.getDay())) return new Date(d);
    d.setDate(d.getDate() + 1);
  }
  return new Date(date);
}

function prevVegDeliveryOnOrBefore(date: Date, vegDays: number[]): Date {
  const d = new Date(date);
  for (let i = 0; i < 7; i++) {
    if (vegDays.includes(d.getDay())) return new Date(d);
    d.setDate(d.getDate() - 1);
  }
  return new Date(date);
}

// Fast-spoiling items (leafy greens, sprouts, ~5-day shelf life): use the most recent delivery
// if it's still within the shelf-life window by cook-day, otherwise fall forward to the next one.
function deliveryDateForFastSpoiling(cookDate: Date, vegDays: number[], maxAgeDays: number): Date {
  const lastDelivery = prevVegDeliveryOnOrBefore(cookDate, vegDays);
  const ageAtCookTime = Math.floor((cookDate.getTime() - lastDelivery.getTime()) / 86400000);
  if (ageAtCookTime <= maxAgeDays) return lastDelivery;
  return nextVegDeliveryOnOrAfter(cookDate, vegDays);
}

function cycleBucketStart(date: Date, cycleDays: number, anchor: Date): Date {
  const diffDays = Math.floor((date.getTime() - anchor.getTime()) / 86400000);
  const bucketIndex = Math.floor(diffDays / cycleDays);
  const bucketStart = new Date(anchor);
  bucketStart.setDate(bucketStart.getDate() + bucketIndex * cycleDays);
  return bucketStart;
}

function produceCycleDeliveryDate(date: Date, cycleDays: number, anchor: Date, vegDays: number[]): Date {
  const bucketStart = cycleBucketStart(date, cycleDays, anchor);
  return nextVegDeliveryOnOrAfter(bucketStart, vegDays);
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

const TRIP_LABELS: Record<ShoppingTrip['type'], string> = {
  fish: 'קניית דג טרי',
  produce: 'הזמנת ירקות אורגניים',
  sprouts: 'עלים ירוקים ונבטים (בתזמון טריות ייעודי)',
  meat: 'קניית בשר/עוף לחודש (להקפאה)',
  dairy: 'מוצרי חלב (שבועי)',
  pantry: 'קניה חודשית — יבשים ומוצרי מזווה',
};

export function buildShoppingPlan(
  approvedDays: GeneratedDay[],
  approvals: { date: string; breakfast: boolean; lunch: boolean; dinner: boolean }[],
  settings: UserSettings,
  monthAnchor: Date
): { trips: ShoppingTrip[]; totalMeals: number } {
  const approvalByDate = new Map(approvals.map((a) => [a.date, a]));

  const approvedMeals: ApprovedMeal[] = [];
  approvedDays.forEach((day) => {
    const approval = approvalByDate.get(day.date);
    if (!approval) return;
    const date = new Date(day.date);
    if (approval.breakfast) approvedMeals.push({ date, recipe: day.breakfast });
    if (approval.lunch) approvedMeals.push({ date, recipe: day.lunch });
    if (approval.dinner) approvedMeals.push({ date, recipe: day.dinner });
  });

  if (!approvedMeals.length) return { trips: [], totalMeals: 0 };

  const fishTrips: Record<string, { date: Date; items: Record<string, ShoppingTripItem> }> = {};
  const produceTrips: Record<string, { date: Date; items: Record<string, ShoppingTripItem> }> = {};
  const sproutTrips: Record<string, { date: Date; items: Record<string, ShoppingTripItem> }> = {};
  const meatTrips: Record<string, { date: Date; items: Record<string, ShoppingTripItem> }> = {};
  const dairyTrips: Record<string, { date: Date; items: Record<string, ShoppingTripItem> }> = {};
  const pantryList: Record<string, ShoppingTripItem> = {};

  const addIngredient = (bucket: Record<string, ShoppingTripItem>, name: string, qty: number, unit: string) => {
    if (!bucket[name]) bucket[name] = { name, qty: 0, unit };
    bucket[name].qty += qty;
  };

  approvedMeals.forEach(({ date, recipe }) => {
    (recipe.ingredients || []).forEach((ing) => {
      if (ing.freshness === 'fresh-fish') {
        const key = date.toISOString().slice(0, 10);
        if (!fishTrips[key]) fishTrips[key] = { date: new Date(date), items: {} };
        addIngredient(fishTrips[key].items, ing.name, ing.qty, ing.unit);
      } else if (ing.freshness === 'fresh-produce') {
        const bucketDate =
          settings.produce_mode === 'cycle'
            ? produceCycleDeliveryDate(date, settings.produce_cycle_days, monthAnchor, settings.veg_days)
            : nextVegDeliveryOnOrAfter(date, settings.veg_days);
        const key = bucketDate.toISOString().slice(0, 10);
        if (!produceTrips[key]) produceTrips[key] = { date: bucketDate, items: {} };
        addIngredient(produceTrips[key].items, ing.name, ing.qty, ing.unit);
      } else if (ing.freshness === 'fresh-sprouts') {
        const bucketDate = deliveryDateForFastSpoiling(date, settings.veg_days, settings.sprout_max_age_days);
        const key = bucketDate.toISOString().slice(0, 10);
        if (!sproutTrips[key]) sproutTrips[key] = { date: bucketDate, items: {} };
        addIngredient(sproutTrips[key].items, ing.name, ing.qty, ing.unit);
      } else if (ing.freshness === 'freezer-meat') {
        const bucketDate = cycleBucketStart(date, settings.meat_batch_days, monthAnchor);
        const key = bucketDate.toISOString().slice(0, 10);
        if (!meatTrips[key]) meatTrips[key] = { date: bucketDate, items: {} };
        addIngredient(meatTrips[key].items, ing.name, ing.qty, ing.unit);
      } else if (ing.freshness === 'weekly-dairy') {
        const weekKey = startOfWeek(date).toISOString().slice(0, 10);
        if (!dairyTrips[weekKey]) dairyTrips[weekKey] = { date: startOfWeek(date), items: {} };
        addIngredient(dairyTrips[weekKey].items, ing.name, ing.qty, ing.unit);
      } else if (ing.freshness === 'pantry') {
        addIngredient(pantryList, ing.name, ing.qty, ing.unit);
      }
    });
  });

  const trips: ShoppingTrip[] = [];
  Object.values(fishTrips).forEach((t) =>
    trips.push({ type: 'fish', date: t.date.toISOString().slice(0, 10), label: TRIP_LABELS.fish, items: Object.values(t.items) })
  );
  Object.values(produceTrips).forEach((t) =>
    trips.push({ type: 'produce', date: t.date.toISOString().slice(0, 10), label: TRIP_LABELS.produce, items: Object.values(t.items) })
  );
  Object.values(sproutTrips).forEach((t) =>
    trips.push({ type: 'sprouts', date: t.date.toISOString().slice(0, 10), label: TRIP_LABELS.sprouts, items: Object.values(t.items) })
  );
  Object.values(dairyTrips).forEach((t) =>
    trips.push({ type: 'dairy', date: t.date.toISOString().slice(0, 10), label: TRIP_LABELS.dairy, items: Object.values(t.items) })
  );
  Object.values(meatTrips).forEach((t) =>
    trips.push({ type: 'meat', date: t.date.toISOString().slice(0, 10), label: TRIP_LABELS.meat, items: Object.values(t.items) })
  );
  if (Object.keys(pantryList).length) {
    trips.push({
      type: 'pantry',
      date: monthAnchor.toISOString().slice(0, 10),
      label: TRIP_LABELS.pantry,
      items: Object.values(pantryList),
    });
  }

  trips.sort((a, b) => a.date.localeCompare(b.date));
  return { trips, totalMeals: approvedMeals.length };
}
