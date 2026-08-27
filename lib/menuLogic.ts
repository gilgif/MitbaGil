// Helpers for working with meals — the composed unit that appears on the menu.
//
// A meal's nutrition and shopping needs come from its components, which may be a
// mix of recipe-backed items (with instructions) and simple items (no recipe needed).
// These helpers hide that distinction from the rest of the app.

import type { Meal, MealComponent, Recipe, Freshness } from './types';

export type Effort = 'קל' | 'בינוני' | 'מורכב';

export interface EffortInputs {
  totalMinutes: number;
  stepCount: number;
  methodCount: number; // distinct cooking methods (pan / oven / boil / raw ...)
}

// Effort deliberately combines three things, because time alone is misleading:
// a 30-minute stew that's "chop, throw in pot, wait" is genuinely easier than a
// 20-minute dish with four separate techniques running at once.
export function scoreEffort({ totalMinutes, stepCount, methodCount }: EffortInputs): Effort {
  const points =
    (totalMinutes <= 15 ? 0 : totalMinutes <= 35 ? 2 : 4) +
    (stepCount <= 3 ? 0 : stepCount <= 6 ? 1 : 2) +
    (methodCount <= 1 ? 0 : methodCount === 2 ? 1 : 2);

  if (points <= 2) return 'קל';
  if (points <= 5) return 'בינוני';
  return 'מורכב';
}

// Rough detection of distinct cooking methods from a recipe's written steps, so
// effort can be scored without hand-tagging every recipe.
export function countCookingMethods(steps: string[]): number {
  const text = steps.join(' ');
  const methods = [
    /מטגנ|במחבת/,
    /בתנור|אופ|צול/,
    /מבשל|רותח|סיר/,
    /מאדה|אידוי/,
    /טוחn|בלנדר|מעבד/,
    /ללא בישול|חותכ|מערבב/,
  ];
  return methods.filter((re) => re.test(text)).length || 1;
}

// A meal's totals are the sum of its components. Recipe-backed components carry
// their own numbers; simple ones carry theirs inline.
export function mealTotals(components: MealComponent[]): { cal: number; protein_g: number } {
  return components.reduce(
    (acc, c) => {
      if (c.recipe) {
        acc.cal += c.recipe.cal || 0;
        acc.protein_g += c.recipe.protein_g || 0;
      } else {
        acc.cal += c.simple_cal || 0;
        acc.protein_g += c.simple_protein_g || 0;
      }
      return acc;
    },
    { cal: 0, protein_g: 0 }
  );
}

export interface AggregatedIngredient {
  name: string;
  qty: number;
  unit: string;
  freshness: Freshness;
}

// Everything you need to buy for a meal, pulled from both recipe-backed and simple
// components and merged so the same item doesn't appear twice on a shopping list.
export function mealIngredients(components: MealComponent[]): AggregatedIngredient[] {
  const merged = new Map<string, AggregatedIngredient>();

  const add = (name: string, qty: number, unit: string, freshness: Freshness) => {
    const key = `${name}|${unit}`;
    const existing = merged.get(key);
    if (existing) existing.qty += qty;
    else merged.set(key, { name, qty, unit, freshness });
  };

  components.forEach((c) => {
    if (c.recipe?.ingredients) {
      c.recipe.ingredients.forEach((ing) => add(ing.name, ing.qty, ing.unit, ing.freshness));
    }
    c.simple_ingredients?.forEach((ing) => add(ing.name, ing.qty, ing.unit, ing.freshness));
  });

  return Array.from(merged.values());
}

// Only components that actually have instructions are worth surfacing as cooking
// steps — "steamed peas" doesn't need a method, "paprika chicken strips" does.
export function componentsWithInstructions(components: MealComponent[]): MealComponent[] {
  return components.filter((c) => c.recipe && (c.recipe.steps?.length || 0) > 0);
}

// A meal counts as needing real cooking if any component does.
export function mealNeedsCooking(meal: Meal): boolean {
  return (meal.total_cook_min || 0) > 0;
}

// Used by the fresh/cooked daily balance rule: a meal is "fresh" when nothing in
// it is actually cooked.
export function isFreshMeal(meal: Meal): boolean {
  return (meal.total_cook_min || 0) === 0;
}

// Convenience for the UI: a readable one-line summary of what's in the meal.
export function componentSummary(components: MealComponent[]): string {
  return components
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((c) => c.recipe?.name || c.simple_name || '')
    .filter(Boolean)
    .join(' + ');
}
