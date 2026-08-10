// Core menu-generation algorithm, ported from the original HTML prototype.
// This is pure logic (no DOM, no Supabase calls) so it can be unit-tested and reused
// both in the app's UI and in the background reminder-scheduling job.

import type { Recipe, MealSlot, Season, UserSettings } from './types';

// Israel has two culinary seasons: winter (Oct–Mar, soups/stews/warm) and
// summer (Apr–Sep, cold/fresh/salads/shakes).
export function seasonForDate(date: Date): 'summer' | 'winter' {
  const month = date.getMonth(); // 0=Jan..11=Dec
  const winterMonths = [9, 10, 11, 0, 1, 2];
  return winterMonths.includes(month) ? 'winter' : 'summer';
}

export function isSaladStyle(meal: Recipe | null | undefined): boolean {
  if (!meal) return false;
  return meal.category === 'סלט' || meal.cook_min === 0;
}

export function isWarmCooked(meal: Recipe | null | undefined): boolean {
  if (!meal) return false;
  return meal.cook_min > 0 || (meal.tags && meal.tags.includes('חם'));
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Filters the full recipe list down to what's eligible for a given slot/season/day/settings,
// respecting: approval status, day-of-week restrictions (Friday-only, office-day-only),
// dislikes, and the month-level diet/health filters.
export function poolForSlot(
  allRecipes: Recipe[],
  slot: MealSlot,
  season: Season,
  dayOfWeek: number,
  settings: Pick<UserSettings, 'diet_mode' | 'health_mode'>
): Recipe[] {
  const candidates = allRecipes.filter((r) => {
    if (r.status !== 'approved' || r.meal_slot !== slot || r.category === 'תינוקת') return false;
    if (r.disliked) return false;
    if (r.only_day !== null && r.only_day !== dayOfWeek) return false;
    if (r.only_days && !r.only_days.includes(dayOfWeek)) return false;
    return true;
  });

  let filtered = candidates;
  if (settings.diet_mode === 'diet') {
    const dietOnly = filtered.filter((r) => r.diet_tag === 'דיאטטי');
    if (dietOnly.length) filtered = dietOnly;
  }
  if (settings.health_mode === 'healthy') {
    const healthyOnly = filtered.filter((r) => r.health_tag === 'בריא');
    if (healthyOnly.length) filtered = healthyOnly;
  }

  const seasonal = filtered.filter((r) => !r.season || r.season === 'all' || r.season === season);
  return seasonal.length ? seasonal : filtered;
}

// Stateful shuffled-bag generator: call `next()` repeatedly to get non-repeating picks
// until the bag is exhausted, then it reshuffles automatically.
class MealBag {
  private queue: Recipe[] = [];
  private lastId: string | null = null;

  next(candidates: Recipe[]): Recipe {
    if (this.queue.length === 0) {
      this.queue = shuffleArray(candidates);
      // Avoid repeating the same dish across a bag boundary
      if (candidates.length > 1 && this.queue[this.queue.length - 1].id === this.lastId) {
        const swapIdx = Math.floor(Math.random() * (this.queue.length - 1));
        const lastIdx = this.queue.length - 1;
        [this.queue[swapIdx], this.queue[lastIdx]] = [this.queue[lastIdx], this.queue[swapIdx]];
      }
    }
    const item = this.queue.pop()!;
    this.lastId = item.id;
    return item;
  }
}

export interface GeneratedDay {
  date: string; // ISO date
  season: 'summer' | 'winter';
  breakfast: Recipe;
  lunch: Recipe;
  dinner: Recipe;
}

// Generates a full month of meals, day by day, respecting:
//  - office-day forced breakfast/lunch (fixed recipes tagged with only_days)
//  - Friday-only / other day-restricted recipes
//  - salad/warm-dish balancing between lunch and dinner (summer: guaranteed daily salad)
//  - no back-to-back repeats within a meal slot
export function generateMonth(
  allRecipes: Recipe[],
  year: number,
  month0: number, // 0-indexed month
  settings: Pick<UserSettings, 'office_days' | 'diet_mode' | 'health_mode'>
): GeneratedDay[] {
  const numDays = new Date(year, month0 + 1, 0).getDate();
  const bags: Record<string, MealBag> = {};
  const getBag = (key: string) => {
    if (!bags[key]) bags[key] = new MealBag();
    return bags[key];
  };

  const pickForSlot = (
    slot: MealSlot,
    season: Season,
    dow: number,
    preferSalad: boolean | null
  ): Recipe => {
    const isOfficeDay = settings.office_days.includes(dow);
    if (isOfficeDay && (slot === 'breakfast' || slot === 'lunch')) {
      const forced = allRecipes.find(
        (r) => r.status === 'approved' && r.meal_slot === slot && r.only_days?.includes(dow)
      );
      if (forced) return forced;
    }

    const candidates = poolForSlot(allRecipes, slot, season, dow, settings);
    const dayRestricted = candidates.find(
      (r) => r.only_day === dow || (r.only_days && r.only_days.includes(dow))
    );
    if (dayRestricted) return dayRestricted;

    const rotationCandidates = candidates.filter((r) => r.only_day === null && !r.only_days);
    const pool = rotationCandidates.length ? rotationCandidates : candidates;

    if (preferSalad === null) {
      return getBag(`${slot}-${season}`).next(pool);
    }
    const biased = pool.filter((r) => (preferSalad ? isSaladStyle(r) : isWarmCooked(r)));
    const finalPool = biased.length ? biased : pool;
    return getBag(`${slot}-${season}-${preferSalad ? 'salad' : 'warm'}`).next(finalPool);
  };

  const days: GeneratedDay[] = [];
  for (let i = 0; i < numDays; i++) {
    const d = new Date(year, month0, i + 1);
    const season = seasonForDate(d);
    const dow = d.getDay();

    const breakfast = pickForSlot('breakfast', season, dow, null);

    const saladLeadsLunch = i % 2 === 0;
    const lunch =
      season === 'summer'
        ? pickForSlot('lunch', season, dow, saladLeadsLunch)
        : pickForSlot('lunch', season, dow, saladLeadsLunch ? false : null);

    const lunchWasSalad = isSaladStyle(lunch);
    const dinner =
      season === 'summer'
        ? pickForSlot('dinner', season, dow, !lunchWasSalad)
        : pickForSlot('dinner', season, dow, lunchWasSalad ? null : false);

    days.push({
      date: d.toISOString().slice(0, 10),
      season,
      breakfast,
      lunch,
      dinner,
    });
  }

  return days;
}
