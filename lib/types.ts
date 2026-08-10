// Shared types mirroring supabase/schema.sql — keep these two files in sync.

export type MealSlot = 'breakfast' | 'lunch' | 'dinner';
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
