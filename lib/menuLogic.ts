// Core menu-generation algorithm, ported from the original HTML prototype.
// This is pure logic (no DOM, no Supabase calls) so it can be unit-tested and reused
// both in the app's UI and in the background reminder-scheduling job.

import type { Meal, MealSlot, Season, UserSettings } from './types';

// Israel has two culinary seasons: winter (Oct–Mar, soups/stews/warm) and
// summer (Apr–Sep, cold/fresh/salads/shakes).
export function seasonForDate(date: Date): 'summer' | 'winter' {
  const month = date.getMonth(); // 0=Jan..11=Dec
  const winterMonths = [9, 10, 11, 0, 1, 2];
  return winterMonths.includes(month) ? 'winter' : 'summer';
}

// A meal counts as "fresh/salad-style" when nothing in it is actually cooked, or when
// it's been explicitly tagged as a salad. Note this is judged at the MEAL level, not per
// component — a meal of "grilled chicken + big green salad" is a cooked meal that happens
// to include salad, not a fresh meal.
export function isSaladStyle(meal: Meal | null | undefined): boolean {
  if (!meal) return false;
  return meal.total_cook_min === 0 || (meal.tags?.includes('סלט') ?? false);
}

export function isWarmCooked(meal: Meal | null | undefined): boolean {
  if (!meal) return false;
  return meal.total_cook_min > 0 || (meal.tags && meal.tags.includes('חם'));
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
  allRecipes: Meal[],
  slot: MealSlot,
  season: Season,
  dayOfWeek: number,
  settings: Pick<UserSettings, 'diet_mode' | 'health_mode'>
): Meal[] {
  const candidates = allRecipes.filter((r) => {
    // Baby meals are excluded from the adult menu. Previously keyed off recipe.category;
    // at the meal level this is carried as a tag instead.
    // A meal marked 'any' fits either lunch or dinner — this is how fish dishes work now
    // that the fish-at-lunch-only rule is gone. The daily scorer decides where they land.
    const slotFits =
      r.meal_slot === slot || (r.meal_slot === 'any' && (slot === 'lunch' || slot === 'dinner'));
    // Baby meals are excluded from the adult menu. Previously keyed off recipe.category;
    // at the meal level this is carried as a tag instead.
    if (r.status !== 'approved' || !slotFits || r.tags?.includes('תינוקת')) return false;
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
  private queue: Meal[] = [];
  private lastId: string | null = null;

  next(candidates: Meal[]): Meal {
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

  // Preview the next item without consuming it — used to try several combinations
  // for a day before committing to one.
  peek(candidates: Meal[]): Meal {
    if (this.queue.length === 0) {
      this.queue = shuffleArray(candidates);
    }
    return this.queue[this.queue.length - 1];
  }
}

export interface GeneratedDay {
  date: string; // ISO date
  season: 'summer' | 'winter';
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  // The day's planned afternoon snack (14:00–16:00). Picked EVERY day unconditionally —
  // its purpose is to be a standing, planned alternative to the recurring afternoon
  // sweet craving, not a protein top-up that only appears when macros fall short.
  // Only recipes tagged 'אחה״צ' are ever auto-picked here; recipes tagged 'חירום-21:00'
  // live in the pool for manual browsing only and must never be auto-selected.
  snack: Meal | null;
}

// ═══════════════════════════════════════════════════════════════════════════
// DAY-LEVEL PLANNING
// The unit of planning is the DAY, not the individual meal. A day is scored as a
// whole against every constraint at once, and many candidate combinations are
// compared before one is chosen. This is what makes it possible to guarantee the
// daily protein and calorie targets — picking each meal in isolation never can.
//
// IMPORTANT: the afternoon snack is NOT part of any of this. It's a purely optional
// "if I feel like something sweet at 15:00" alternative, deliberately excluded from
// every protein and calorie calculation. The three meals must hit the targets on
// their own; the snack is never relied upon to close a gap.
// ═══════════════════════════════════════════════════════════════════════════

const MAX_DAY_ATTEMPTS = 40; // candidate day-combinations to evaluate before taking the best

export interface DayTotals {
  protein: number;
  cal: number;
  freshCount: number; // salad-style / raw meals
  cookedCount: number; // warm, actually-cooked meals
  complexCount: number; // meals marked 'מורכב' — real kitchen time
  dairyCount: number; // meals containing cow's-milk products
}

// Totals for a day, from the three main meals ONLY — snacks are never included.
export function dayTotals(breakfast: Meal, lunch: Meal, dinner: Meal): DayTotals {
  const meals = [breakfast, lunch, dinner];
  return {
    protein: meals.reduce((s, m) => s + (m?.protein_g || 0), 0),
    cal: meals.reduce((s, m) => s + (m?.cal || 0), 0),
    freshCount: meals.filter((m) => isSaladStyle(m)).length,
    cookedCount: meals.filter((m) => isWarmCooked(m)).length,
    complexCount: meals.filter((m) => m?.effort === 'מורכב').length,
    dairyCount: meals.filter((m) => m?.has_dairy).length,
  };
}

export interface DayTargets {
  proteinTarget: number;
  calTarget: number;
  season: Season;
  // How much cooking effort is realistic on this particular day. Office days and
  // training days leave little appetite for standing in the kitchen; weekends allow more.
  effortBudget: 'low' | 'normal' | 'high';
}

// Effort budget for a given day. The point isn't to ban complex cooking — it's to put it
// where there's actually time for it, so a Tuesday doesn't get sabotaged by a two-hour stew.
export function effortBudgetForDay(
  dow: number,
  officeDays: number[],
  trainingDays: number[]
): 'low' | 'normal' | 'high' {
  if (dow === 5 || dow === 6) return 'high'; // Friday/Saturday — time to cook properly
  if (officeDays.includes(dow)) return 'low';
  if (trainingDays.includes(dow)) return 'low';
  return 'normal';
}

// Scores a candidate day: higher is better. Every constraint is expressed as a penalty
// so they can be traded off against each other rather than applied as hard gates —
// that way a day that misses one target slightly still beats a day that misses badly.
export function scoreDay(totals: DayTotals, targets: DayTargets): number {
  let score = 1000;

  // ── Protein: missing the target is by far the most serious problem, so it carries a
  // much steeper penalty than any other constraint. Without this weighting the scorer
  // settles for a tidy-looking low-calorie day that quietly misses protein every time.
  if (totals.protein < targets.proteinTarget) {
    score -= (targets.proteinTarget - totals.protein) * 25;
  } else {
    // Modest bonus for clearing it; no reward for overshooting far past the target.
    score += Math.min(totals.protein - targets.proteinTarget, 20);
  }

  // ── Calories: aim near the target, but weight this LIGHTLY. Hitting protein reliably
  // means choosing meatier meals, which cost calories — if calories are policed too
  // strictly the two goals fight and protein always loses. Being somewhat under the
  // calorie target is acceptable; being under on protein is not.
  // Being under the calorie target is a real problem too — the goal is a gentle deficit,
  // not accidental under-eating — so once protein is comfortably handled we pull the day
  // back up toward the target. Still weighted below protein so the two don't fight.
  const calDiff = totals.cal - targets.calTarget;
  if (calDiff < 0) score -= Math.abs(calDiff) * 0.35;
  else score -= calDiff * 0.2;

  // ── Fresh vs cooked balance: a day should have real vegetables/fruit AND a proper
  // cooked meal. Summer leans further toward fresh.
  // One fresh meal a day, year-round. Summer used to require two, but that pushed out
  // cooked meals unnecessarily — the fresh-vegetable emphasis is already carried by the
  // recipes themselves rather than needing a stricter count.
  const wantFreshMin = 1;
  if (totals.freshCount < wantFreshMin) score -= (wantFreshMin - totals.freshCount) * 40;
  if (totals.cookedCount < 1) score -= 60; // at least one properly cooked meal a day

  // ── Dairy: the dietitian advises minimising cow's-milk products. Rather than banning
  // them, we allow at most one dairy meal a day and penalise more — combined with the
  // weekly cap applied during generation, this lands at roughly twice a week.
  if (totals.dairyCount > 1) score -= (totals.dairyCount - 1) * 50;

  // ── Effort fit: penalise asking for complex cooking on a day with no time for it.
  // This is what keeps elaborate dishes on Fridays and weekends rather than mid-week.
  if (targets.effortBudget === 'low' && totals.complexCount > 0) {
    score -= totals.complexCount * 70;
  } else if (targets.effortBudget === 'normal' && totals.complexCount > 1) {
    score -= (totals.complexCount - 1) * 40;
  }

  return score;
}

// Generates a full month of meals, day by day, respecting:
//  - office-day forced breakfast/lunch (fixed recipes tagged with only_days)
//  - Friday-only / other day-restricted recipes
//  - salad/warm-dish balancing between lunch and dinner (summer: guaranteed daily salad)
//  - no back-to-back repeats within a meal slot
//  - a daily protein floor (settings.daily_protein_target) and a calorie target band
//    (settings.daily_cal_target) — each day is retried with fresh picks (still respecting
//    all the above rules) until it clears the protein floor or a retry budget is spent,
//    in which case the best attempt seen is kept.
export function generateMonth(
  allRecipes: Meal[],
  year: number,
  month0: number, // 0-indexed month
  settings: Pick<
    UserSettings,
    | 'office_days'
    | 'diet_mode'
    | 'health_mode'
    | 'daily_protein_target'
    | 'daily_cal_target'
    | 'strength_days'
  >
): GeneratedDay[] {
  const numDays = new Date(year, month0 + 1, 0).getDate();
  const bags: Record<string, MealBag> = {};
  const getBag = (key: string) => {
    if (!bags[key]) bags[key] = new MealBag();
    return bags[key];
  };

  // Daily targets the scorer works against. Both come from the user's settings; the
  // scorer treats them as goals to get close to rather than hard gates, so a day that
  // misses one slightly still beats a day that misses badly.
  const proteinFloor = settings.daily_protein_target || 95;
  const calTarget = settings.daily_cal_target || 1500;

  const pickForSlot = (
    slot: MealSlot,
    season: Season,
    dow: number,
    preferSalad: boolean | null,
    bagSuffix: string
  ): Meal => {
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
      return getBag(`${slot}-${season}${bagSuffix}`).next(pool);
    }
    const biased = pool.filter((r) => (preferSalad ? isSaladStyle(r) : isWarmCooked(r)));
    const finalPool = biased.length ? biased : pool;
    return getBag(`${slot}-${season}-${preferSalad ? 'salad' : 'warm'}${bagSuffix}`).next(finalPool);
  };

  // Among the candidates for a protein-boosting swap, prefer the highest-protein option
  // that's still a legal pick for the slot (respects office-day forcing, day-restrictions).
  const pickHighestProteinForSlot = (
    slot: MealSlot,
    season: Season,
    dow: number
  ): Meal | null => {
    const isOfficeDay = settings.office_days.includes(dow);
    if (isOfficeDay && (slot === 'breakfast' || slot === 'lunch')) return null; // forced slot, can't swap
    const candidates = poolForSlot(allRecipes, slot, season, dow, settings);
    const dayRestricted = candidates.find(
      (r) => r.only_day === dow || (r.only_days && r.only_days.includes(dow))
    );
    if (dayRestricted) return null; // forced by day restriction, can't swap
    const rotationCandidates = candidates.filter((r) => r.only_day === null && !r.only_days);
    const pool = rotationCandidates.length ? rotationCandidates : candidates;
    if (!pool.length) return null;
    return pool.reduce((best, r) => ((r.protein_g || 0) > (best.protein_g || 0) ? r : best), pool[0]);
  };

  // Picks the day's afternoon snack — ALWAYS, every day, unconditionally.
  // The point of this snack is to be a planned, concrete alternative to the recurring
  // ~14:00–16:00 sweet craving, so it never sits out a day just because the protein
  // target is already met. `proteinGap` only steers WHICH of the candidates gets picked:
  //   - gap > 0  : bias toward the smallest option that still closes the gap, so we top up
  //                protein without needlessly inflating calories
  //   - gap <= 0 : free rotation across all candidates — variety is the only goal, and the
  //                lower-protein "just for satisfaction" options are equally valid picks
  // Only 'אחה״צ'-tagged recipes are eligible; 'חירום-21:00' snacks are never auto-picked.
  // Tracks recently-used snacks so the deterministic top-up path still rotates for variety
  // instead of picking the same "best fit" snack every single day.
  const recentSnackIds: string[] = [];
  const rememberSnack = (r: Meal) => {
    recentSnackIds.push(r.id);
    if (recentSnackIds.length > 3) recentSnackIds.shift();
  };

  // Picks the day's optional afternoon snack, purely for variety.
  //
  // The snack is deliberately NOT a nutritional instrument. It contributes nothing to the
  // day's protein or calorie planning and is never used to close a gap — the three meals
  // are required to hit the targets on their own. This exists only so that when the
  // ~15:00 sweet craving hits, there's already a decent option decided on, instead of
  // reaching for something worse. Skipping it entirely is always a fine outcome.
  //
  // Only 'אחה״צ'-tagged recipes are eligible; 'חירום-21:00' snacks are browse-only and
  // must never be auto-selected.
  const pickAfternoonSnack = (season: Season, dow: number): Meal | null => {
    const candidates = poolForSlot(allRecipes, 'snack', season, dow, settings).filter((r) =>
      r.tags?.includes('אחה״צ')
    );
    if (!candidates.length) return null;

    const chosen = getBag(`snack-${season}-variety`).next(candidates);
    rememberSnack(chosen);
    return chosen;
  };

  // Rolling record of which days used dairy, so the weekly cap can be enforced as the
  // month is built rather than checked after the fact.
  const dairyDays: number[] = [];
  const WEEKLY_DAIRY_CAP = 2;

  const days: GeneratedDay[] = [];
  for (let i = 0; i < numDays; i++) {
    const d = new Date(year, month0, i + 1);
    const season = seasonForDate(d);
    const dow = d.getDay();

    const targets: DayTargets = {
      proteinTarget: proteinFloor,
      calTarget: calTarget,
      season,
      effortBudget: effortBudgetForDay(dow, settings.office_days, settings.strength_days || []),
    };

    // Build many candidate DAYS and score each as a whole, rather than picking each meal
    // in isolation and hoping the totals work out. Alternating which slot leads with a
    // salad keeps day-to-day variety while the scorer enforces the actual constraints.
    let bestDay: { breakfast: Meal; lunch: Meal; dinner: Meal } | null = null;
    let bestScore = -Infinity;

    for (let attempt = 0; attempt < MAX_DAY_ATTEMPTS; attempt++) {
      const bagSuffix = attempt === 0 ? '' : `-retry${attempt}`;
      const saladLeadsLunch = (i + attempt) % 2 === 0;

      const breakfast = pickForSlot('breakfast', season, dow, null, bagSuffix);
      const lunch = pickForSlot('lunch', season, dow, saladLeadsLunch, bagSuffix);
      const dinner = pickForSlot('dinner', season, dow, !saladLeadsLunch, bagSuffix);

      let score = scoreDay(dayTotals(breakfast, lunch, dinner), targets);

      // Weekly dairy cap: if this week already has its allowance, heavily penalise
      // any further dairy so the planner naturally reaches for non-dairy options.
      const dairyThisWeek = dairyDays.filter((d) => d > i - 7).length;
      const dayUsesDairy = [breakfast, lunch, dinner].some((m) => m?.has_dairy);
      if (dayUsesDairy && dairyThisWeek >= WEEKLY_DAIRY_CAP) score -= 120;

      if (score > bestScore) {
        bestScore = score;
        bestDay = { breakfast, lunch, dinner };
      }
    }

    // Targeted repair: if the best random combination still misses the protein target,
    // try replacing each slot in turn with the highest-protein legal alternative, keeping
    // whichever single change most improves the day's overall score. Repeated until the
    // target is met or no swap helps — this is what rescues days where every random pick
    // happened to be low-protein.
    if (bestDay) {
      for (let pass = 0; pass < 3; pass++) {
        const current = bestDay as { breakfast: Meal; lunch: Meal; dinner: Meal };
        const totals = dayTotals(current.breakfast, current.lunch, current.dinner);
        if (totals.protein >= proteinFloor) break;

        let improvedDay = current;
        let improvedScore = scoreDay(totals, targets);

        (['breakfast', 'lunch', 'dinner'] as const).forEach((slot) => {
          const boosted = pickHighestProteinForSlot(slot, season, dow);
          if (!boosted || boosted.id === current[slot].id) return;
          const candidate = { ...current, [slot]: boosted };
          const candidateScore = scoreDay(
            dayTotals(candidate.breakfast, candidate.lunch, candidate.dinner),
            targets
          );
          if (candidateScore > improvedScore) {
            improvedScore = candidateScore;
            improvedDay = candidate;
          }
        });

        if (improvedDay === current) break; // no swap helped; stop trying
        bestDay = improvedDay;
      }
    }

    // The afternoon snack is chosen purely for variety. It is deliberately NOT part of the
    // protein or calorie calculation above — it's an optional "if I want something sweet"
    // alternative, never a planned contributor to the day's targets.
    const snack = pickAfternoonSnack(season, dow);

    if ([bestDay!.breakfast, bestDay!.lunch, bestDay!.dinner].some((m) => m?.has_dairy)) {
      dairyDays.push(i);
    }

    days.push({
      date: d.toISOString().slice(0, 10),
      season,
      breakfast: bestDay!.breakfast,
      lunch: bestDay!.lunch,
      dinner: bestDay!.dinner,
      snack,
    });
  }

  return days;
}
