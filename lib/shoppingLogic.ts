// Shopping consolidation algorithm, ported from the HTML prototype.
// Groups ingredients from approved meals into the minimum number of shopping trips,
// respecting each ingredient's real-world freshness window.

import type { Meal, UserSettings, ShoppingTrip, ShoppingTripItem } from './types';
import { mealIngredients } from './mealLogic';
import type { GeneratedDay } from './menuLogic';

// Some ingredients across the recipe pool are written slightly differently for the
// same real product — different phrasing, or just a typo (מגורד vs מגורר, for
// example) — which meant they never merged into one shopping-list line even though
// they're the same thing to buy. This canonicalizes a name BEFORE it's used as the
// merge key, without touching the underlying recipe data at all.
function canonicalIngredientName(name: string): string {
  // Every egg variant — plain, hard-boiled, organic — is still just "eggs" to buy.
  if (/^ביצ/.test(name) || /^ביצה/.test(name)) return 'ביצים';
  // "מגורד" and "מגורר" are the same word (grated) — normalize to one spelling.
  let n = name.replace(/מגורד/g, 'מגורר');
  // "תימין" is a common misspelling of "טימין" (thyme).
  n = n.replace(/תימין/g, 'טימין');
  // Unify cottage cheese phrasing.
  if (/^קוטג׳/.test(n)) n = `גבינת ${n}`;
  return n;
}

// A rough estimate of how many of a unit come in a typical package — only where this
// is safe to assume. Returns a short parenthetical like "(2 חבילות)", or undefined
// where no assumption is being made (most items: package sizes vary too much to guess
// safely).
function packageHint(canonicalName: string, totalQty: number, unit: string): string | undefined {
  if (canonicalName === 'ביצים' && unit === 'יח׳') {
    const packages = Math.ceil(totalQty / 12);
    return `(${packages} חבי${packages === 1 ? 'לה' : 'לות'} של 12)`;
  }
  return undefined;
}

// Finer grouping within a produce/sprouts trip — vegetables, fruit, or leafy
// greens/herbs/sprouts — purely for how the list is laid out, not which trip it's on.
function produceSubcategory(name: string): 'ירקות' | 'פירות' | 'עלים ירוקים ונבטים' {
  if (/חסה|תרד|עלים ירוק|^עלה |רוקט|פטרוזיליה|כוסברה|נענע|שמיר|נבט|חובזה|עלי סלרי|בזיליקום/.test(name)) {
    return 'עלים ירוקים ונבטים';
  }
  if (/תפוח(?!\s*אדמה)|בננה|אגס|ענבים|קיווי|נקטרינה|תמר|אננס|פרי טרי|אבוקדו/.test(name)) {
    return 'פירות';
  }
  return 'ירקות';
}

// Finer grouping within a pantry trip — spices (usually already on hand, listed so
// it's easy to spot-check what's missing), nuts/seeds, oils, or legumes/grains.
// Anything that doesn't clearly fit one of the four falls back to "אחר" rather than
// being forced into the wrong bucket.
function pantrySubcategory(name: string): 'תבלינים' | 'גרעינים ואגוזים' | 'שמנים' | 'קטניות ודגנים' | 'אחר' {
  if (
    /מלח|פלפל שחור|כמון|כורכום|קינמון|זעתר|פפריקה|קארי|עלה דפנה|טימין|חומץ|חרדל|רוטב סויה|אבקת/.test(name)
  ) {
    return 'תבלינים';
  }
  if (/שקד|אגוז|פקאן|גרעינ|זרעי/.test(name)) return 'גרעינים ואגוזים';
  if (/^שמן/.test(name)) return 'שמנים';
  if (/עדש|חומוס|קינואה|שעועית|כוסמת|אמרנט|דוחן|אורז|קטני|שיבולת שועל/.test(name)) return 'קטניות ודגנים';
  return 'אחר';
}

interface ApprovedMeal {
  date: Date;
  meal: Meal;
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
  approvals: { date: string; breakfast: boolean; lunch: boolean; dinner: boolean; snack: boolean }[],
  settings: UserSettings,
  monthAnchor: Date
): { trips: ShoppingTrip[]; totalMeals: number } {
  const approvalByDate = new Map(approvals.map((a) => [a.date, a]));

  const approvedMeals: ApprovedMeal[] = [];
  approvedDays.forEach((day) => {
    const approval = approvalByDate.get(day.date);
    if (!approval) return;
    const date = new Date(day.date);
    if (approval.breakfast) approvedMeals.push({ date, meal: day.breakfast });
    if (approval.lunch) approvedMeals.push({ date, meal: day.lunch });
    if (approval.dinner) approvedMeals.push({ date, meal: day.dinner });
    // Approved snacks contribute their ingredients too — otherwise nuts, hummus, cottage etc.
    // would be eaten daily but never appear on any shopping list.
    if (approval.snack && day.snack) approvedMeals.push({ date, meal: day.snack });
  });

  if (!approvedMeals.length) return { trips: [], totalMeals: 0 };

  const fishTrips: Record<string, { date: Date; items: Record<string, ShoppingTripItem> }> = {};
  const produceTrips: Record<string, { date: Date; items: Record<string, ShoppingTripItem> }> = {};
  const sproutTrips: Record<string, { date: Date; items: Record<string, ShoppingTripItem> }> = {};
  const meatTrips: Record<string, { date: Date; items: Record<string, ShoppingTripItem> }> = {};
  const dairyTrips: Record<string, { date: Date; items: Record<string, ShoppingTripItem> }> = {};
  const pantryList: Record<string, ShoppingTripItem> = {};

  // Shared by both the produce and sprouts branches below, so sprouts can check
  // whether it's safe to just ride along with the same delivery as regular produce.
  const produceDeliveryDateFor = (date: Date): Date =>
    settings.produce_mode === 'cycle'
      ? produceCycleDeliveryDate(date, settings.produce_cycle_days, monthAnchor, settings.veg_days)
      : nextVegDeliveryOnOrAfter(date, settings.veg_days);

  const addIngredient = (
    bucket: Record<string, ShoppingTripItem>,
    name: string,
    qty: number,
    unit: string,
    subcategory?: string
  ) => {
    // Merge on the CANONICAL name (so "ביצים קשות" and "ביצים אורגניות" combine into
    // one "ביצים" line) but keep that canonical form as the displayed name too — the
    // person doesn't need to know which recipe's exact phrasing won.
    const canonical = canonicalIngredientName(name);
    if (!bucket[canonical]) bucket[canonical] = { name: canonical, qty: 0, unit, subcategory };
    bucket[canonical].qty += qty;
  };

  approvedMeals.forEach(({ date, meal }) => {
    // Ingredients now come from every component of the meal — both the recipe-backed
    // ones and the simple items that never had a recipe.
    mealIngredients(meal.components || []).forEach((ing) => {
      if (ing.freshness === 'fresh-fish') {
        const key = date.toISOString().slice(0, 10);
        if (!fishTrips[key]) fishTrips[key] = { date: new Date(date), items: {} };
        addIngredient(fishTrips[key].items, ing.name, ing.qty, ing.unit);
      } else if (ing.freshness === 'fresh-produce') {
        const bucketDate = produceDeliveryDateFor(date);
        const key = bucketDate.toISOString().slice(0, 10);
        if (!produceTrips[key]) produceTrips[key] = { date: bucketDate, items: {} };
        addIngredient(produceTrips[key].items, ing.name, ing.qty, ing.unit, produceSubcategory(ing.name));
      } else if (ing.freshness === 'fresh-sprouts') {
        // Leafy greens/sprouts are bought together with regular vegetables in
        // practice — try the SAME delivery date used for produce first, and only
        // fall back to a separately-timed trip if that date would already be too old
        // for something this perishable by the time it's actually cooked. This is
        // checked up front (rather than merging two independently-computed trips
        // after the fact), so the common case never creates a separate 'sprouts'
        // trip at all — it just lands in the same produce trip directly.
        const produceDate = produceDeliveryDateFor(date);
        const ageIfShared = Math.floor((date.getTime() - produceDate.getTime()) / 86400000);
        const canShareProduceTrip = ageIfShared <= settings.sprout_max_age_days;
        const bucketDate = canShareProduceTrip
          ? produceDate
          : deliveryDateForFastSpoiling(date, settings.veg_days, settings.sprout_max_age_days);
        const key = bucketDate.toISOString().slice(0, 10);
        if (canShareProduceTrip) {
          if (!produceTrips[key]) produceTrips[key] = { date: bucketDate, items: {} };
          addIngredient(produceTrips[key].items, ing.name, ing.qty, ing.unit, produceSubcategory(ing.name));
        } else {
          if (!sproutTrips[key]) sproutTrips[key] = { date: bucketDate, items: {} };
          addIngredient(sproutTrips[key].items, ing.name, ing.qty, ing.unit, produceSubcategory(ing.name));
        }
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
        addIngredient(pantryList, ing.name, ing.qty, ing.unit, pantrySubcategory(ing.name));
      }
    });
  });

  // A short "(X חבילות)" hint is only added where package size is safe to assume
  // (eggs, currently) — added here, once, after all quantities are finalized, rather
  // than recomputed on every addIngredient call.
  const withPackageHints = (items: Record<string, ShoppingTripItem>): ShoppingTripItem[] =>
    Object.values(items).map((item) => ({
      ...item,
      note: packageHint(item.name, item.qty, item.unit),
    }));

  const trips: ShoppingTrip[] = [];
  Object.values(fishTrips).forEach((t) =>
    trips.push({ type: 'fish', date: t.date.toISOString().slice(0, 10), label: TRIP_LABELS.fish, items: withPackageHints(t.items) })
  );
  Object.values(produceTrips).forEach((t) =>
    trips.push({ type: 'produce', date: t.date.toISOString().slice(0, 10), label: TRIP_LABELS.produce, items: withPackageHints(t.items) })
  );
  Object.values(sproutTrips).forEach((t) =>
    trips.push({ type: 'sprouts', date: t.date.toISOString().slice(0, 10), label: TRIP_LABELS.sprouts, items: withPackageHints(t.items) })
  );
  Object.values(dairyTrips).forEach((t) =>
    trips.push({ type: 'dairy', date: t.date.toISOString().slice(0, 10), label: TRIP_LABELS.dairy, items: withPackageHints(t.items) })
  );
  Object.values(meatTrips).forEach((t) =>
    trips.push({ type: 'meat', date: t.date.toISOString().slice(0, 10), label: TRIP_LABELS.meat, items: withPackageHints(t.items) })
  );
  if (Object.keys(pantryList).length) {
    trips.push({
      type: 'pantry',
      date: monthAnchor.toISOString().slice(0, 10),
      label: TRIP_LABELS.pantry,
      items: withPackageHints(pantryList),
    });
  }

  trips.sort((a, b) => a.date.localeCompare(b.date));
  return { trips, totalMeals: approvedMeals.length };
}
