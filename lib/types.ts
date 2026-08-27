// Shared types mirroring supabase/schema.sql — keep these two files in sync.

// 'any' means the meal is suitable for either lunch or dinner — used since the
// fish-at-lunch-only rule was removed. Only meals (not recipes) use it.
export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'any';
export type Season = 'all' | 'summer' | 'winter';
export type DietTag = 'דיאטטי' | 'לא-דיאטטי';
export type HealthTag = 'בריא' | 'פחות-בריא';
export type Freshness =
  | 'fresh-fish'
  | 'fresh-produce'
  | 'fresh-sprouts'
  | 'freezer-meat'
  | 'weekly-dairy'
  | 'pantry';

export interface Ingredient {
  id: string;
  recipe_id: string;
  name: string;
  qty: number;
  unit: string;
  freshness: Freshness;
  pre_marinate: boolean;
  sort_order: number;
}

export interface Recipe {
  id: string;
  name: string;
  category: string;
  icon: string;
  meal_slot: MealSlot;
  status: 'approved' | 'pending';
  rating: number;
  season: Season;
  cal: number;
  protein_g: number;
  servings: number;
  diet_tag: DietTag;
  health_tag: HealthTag;
  prep_min: number;
  cook_min: number;
  tags: string[];
  only_day: number | null;
  only_days: number[] | null;
  source: string | null;
  steps: string[];
  liked: boolean;
  disliked: boolean;
  ingredients?: Ingredient[]; // populated via join when needed
}

// ═══════════════════════════════════════════════════════════════════════════
// MEALS — what actually appears on the menu.
//
// A meal is made of one or more components. Some components are backed by a
// recipe (they need instructions); others are simple items that don't —
// "steamed peas" needs no method, "paprika chicken strips" does.
//
// Every recipe that existed before this model was introduced was migrated into
// a single-component meal, so nothing was lost.
// ═══════════════════════════════════════════════════════════════════════════

export type Effort = 'קל' | 'בינוני' | 'מורכב';

export interface SimpleComponentIngredient {
  id: string;
  component_id: string;
  name: string;
  qty: number;
  unit: string;
  freshness: Freshness;
  sort_order: number;
}

export interface MealComponent {
  id: string;
  meal_id: string;
  // Exactly one of these is set — enforced by a DB constraint.
  recipe_id: string | null;
  simple_name: string | null;
  simple_cal: number;
  simple_protein_g: number;
  sort_order: number;
  // Populated by joins when loading a full meal
  recipe?: Recipe;
  simple_ingredients?: SimpleComponentIngredient[];
}

export interface Meal {
  id: string;
  name: string;
  icon: string;
  meal_slot: MealSlot;
  status: 'approved' | 'pending';
  rating: number;
  season: Season;
  // Totals across all components — this is what the planning algorithm reads.
  cal: number;
  protein_g: number;
  diet_tag: DietTag;
  health_tag: HealthTag;
  effort: Effort;
  total_prep_min: number;
  total_cook_min: number;
  tags: string[];
  only_day: number | null;
  only_days: number[] | null;
  liked: boolean;
  disliked: boolean;
  // ── Batch-cooking logistics ──
  // How long the cooked dish keeps in the fridge (USDA-based: most cooked food 3-4 days,
  // soups 2-3, anything with cooked rice just 1 because of Bacillus cereus).
  fridge_life_days: number;
  // How many days in a row it's reasonable to actually want to eat it. This is about
  // appetite, not safety — a stew is fine three days running, a fresh salad isn't.
  repeat_days: number;
  // Worth cooking once and eating from for several days.
  batch_friendly: boolean;
  // Contains dairy. The dietitian advises minimising cow's-milk products, so the planner
  // caps these to roughly twice a week rather than excluding them outright.
  has_dairy: boolean;
  components?: MealComponent[];
}

export interface MenuDay {
  id: string;
  user_id: string;
  date: string; // ISO date
  season: 'summer' | 'winter';
  breakfast_recipe_id: string | null;
  breakfast_approved: boolean;
  lunch_recipe_id: string | null;
  lunch_approved: boolean;
  dinner_recipe_id: string | null;
  dinner_approved: boolean;
  snack_recipe_id: string | null;
  snack_approved: boolean;
}

export interface UserSettings {
  user_id: string;
  weight_kg: number;
  weight_goal_kg: number;
  daily_cal_target: number;
  daily_protein_target: number;
  veg_days: number[];
  veg_order_by: string;
  produce_mode: 'weekly' | 'cycle';
  produce_cycle_days: number;
  sprout_max_age_days: number;
  meat_batch_days: number;
  thaw_lead_days: number;
  office_days: number[];
  work_from_home_days: number[];
  dinner_cutoff_time: string;
  wake_time: string;
  strength_days: number[];
  strength_time: string;
  running_can_replace: number[];
  diet_mode: 'any' | 'diet';
  health_mode: 'any' | 'healthy';
  baby_in_nursery: boolean;
  order_out_per_week: number;
  notify_shop: boolean;
  notify_recv: boolean;
  notify_prep: boolean;
  notify_cook: boolean;
  notify_eat: boolean;
  notify_sport: boolean;
  // Food preferences & dietitian guidance — displayed in Settings and used as the
  // reference when sourcing new recipes. Not inputs to the generation algorithm.
  disliked_foods: string[];
  preferred_fish: string[];
  always_available_fruit: string[];
  dietitian_guidelines: string[];
  preferred_cuisine: string;
  lifestyle_notes: string[];
  // The overarching goals every meal suggestion is weighed against.
  core_goals: string[];
}

export interface Reminder {
  id: string;
  user_id: string;
  type: 'shop' | 'recv' | 'prep' | 'cook' | 'eat' | 'sport' | 'thaw';
  title: string;
  body: string | null;
  scheduled_for: string; // ISO datetime
  sent: boolean;
  related_recipe_id: string | null;
}

export interface ShoppingTripItem {
  name: string;
  qty: number;
  unit: string;
}

export interface ShoppingTrip {
  type: 'fish' | 'produce' | 'meat' | 'dairy' | 'pantry' | 'sprouts';
  date: string; // ISO date
  label: string;
  items: ShoppingTripItem[];
}
