-- ═══════════════════════════════════════════════════════════
-- מטבגיל — Database Schema
-- Run this in the Supabase SQL Editor (see DEPLOY.md for how)
-- ═══════════════════════════════════════════════════════════

-- ── RECIPES ──
-- The single source of truth for every recipe (mirrors the app's recipePool)
create table recipes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,               -- 'דג' | 'עוף' | 'בשר' | 'סלט' | 'ביצים' | 'מרק' | 'הזמנה' | 'תינוקת' | etc.
  icon text not null,                   -- emoji shown on cards
  meal_slot text not null check (meal_slot in ('breakfast','lunch','dinner')),
  status text not null default 'pending' check (status in ('approved','pending')),
  rating int not null default 0 check (rating between 0 and 5),
  season text default 'all' check (season in ('all','summer','winter')),
  cal int not null default 0,           -- kcal per single serving
  protein_g int not null default 0,     -- protein grams per single serving
  servings int not null default 1,      -- how many portions the written ingredient list yields
  diet_tag text not null default 'לא-דיאטטי' check (diet_tag in ('דיאטטי','לא-דיאטטי')),
  health_tag text not null default 'בריא' check (health_tag in ('בריא','פחות-בריא')),
  prep_min int not null default 0,
  cook_min int not null default 0,
  tags text[] default '{}',             -- free-form tags like 'מהיר', 'חם', 'לא מתוק'
  only_day int,                         -- 0-6 (Sun-Sat), restricts recipe to exactly this weekday (e.g. Friday fish)
  only_days int[],                      -- restricts recipe to a set of weekdays (e.g. office-day picks)
  source text,                          -- where the recipe came from (site name or "המתכון של X")
  steps text[] not null default '{}',   -- ordered list of preparation steps
  liked boolean not null default false,
  disliked boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── RECIPE INGREDIENTS ──
-- One row per ingredient line, linked to its recipe (lets us aggregate quantities across the whole month)
create table recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  name text not null,
  qty numeric not null,
  unit text not null,                   -- 'גר׳' | 'מ״ל' | 'יח׳' | 'כף' | 'כפית' | 'כפות' | 'חופן' | 'ראש' | 'כוס' | 'שן'/'שיני' | 'מנה'
  freshness text not null check (freshness in (
    'fresh-fish','fresh-produce','fresh-sprouts','freezer-meat','weekly-dairy','pantry'
  )),
  pre_marinate boolean not null default false,  -- true if this ingredient benefits from marinating before freezing
  sort_order int not null default 0
);

-- ── MONTHLY MENUS ──
-- One row per calendar day per user, holding which recipe was assigned to each meal slot
create table menu_days (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  season text not null check (season in ('summer','winter')),
  breakfast_recipe_id uuid references recipes(id),
  breakfast_approved boolean not null default false,
  lunch_recipe_id uuid references recipes(id),
  lunch_approved boolean not null default false,
  dinner_recipe_id uuid references recipes(id),
  dinner_approved boolean not null default false,
  created_at timestamptz not null default now(),
  unique(user_id, date)
);

-- ── USER SETTINGS ──
-- One row per user, holding every configurable preference from the app
create table user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,

  -- profile
  weight_kg numeric default 50,
  weight_goal_kg numeric default 47,
  daily_cal_target int default 1500,
  daily_protein_target int default 95,

  -- delivery / shopping cadence
  veg_days int[] default '{2,4}',           -- Tue=2, Thu=4
  veg_order_by text default '20:00',
  produce_mode text default 'cycle' check (produce_mode in ('weekly','cycle')),
  produce_cycle_days int default 10,
  sprout_max_age_days int default 5,
  meat_batch_days int default 30,
  thaw_lead_days int default 1,

  -- schedule
  office_days int[] default '{0,3}',        -- Sun=0, Wed=3
  work_from_home_days int[] default '{1,2,4}',
  dinner_cutoff_time text default '18:00',

  -- training
  wake_time text default '06:30',
  strength_days int[] default '{1,2,4,5}',  -- Mon,Tue,Thu,Fri
  strength_time text default '08:15',
  running_can_replace int[] default '{2,4}', -- Tue or Thu

  -- monthly menu filters
  diet_mode text default 'any' check (diet_mode in ('any','diet')),
  health_mode text default 'any' check (health_mode in ('any','healthy')),

  -- baby / household
  baby_in_nursery boolean default false,
  order_out_per_week int default 1,

  -- notifications (which reminder types are on)
  notify_shop boolean default true,
  notify_recv boolean default true,
  notify_prep boolean default true,
  notify_cook boolean default true,
  notify_eat boolean default true,
  notify_sport boolean default true,


  -- ── Food preferences & dietitian guidance ──
  -- These don't drive menu generation (the recipe pool is already curated to match them);
  -- they're the single source of truth when searching for and adding NEW recipes.
  disliked_foods text[] default '{"זיתים","ליצ׳י","כוסמת","פירות ים","שרימפס","צדפות","גבינת קוטג׳","איברים פנימיים"}',
  preferred_fish text[] default '{"לברק","דניס","סלמון","טונה","לוקוס","פורל"}',
  always_available_fruit text[] default '{"נקטרינות","אגסים","בננות","מנגו","אבוקדו","אבטיח (בעונה)","תותים (בעונה)"}',
  dietitian_guidelines text[] default '{"הרבה ירקות ועלים ירוקים","ירקות מצליבים מאודים (ברוקולי, כרובית, כרוב)","דגנים לא-עמילניים — קינואה, שיבולת שועל","ביצים כמעט יומיות","הפחתת חיטה וסוכר","הימנעות ממטוגן","שמן זית ושמן קוקוס בלבד","העדפת חלבון רזה"}',
  preferred_cuisine text default 'ירקות טריים בשפע · שמן זית · דגים · קטניות · עשבי תיבול וטעמים חמוצים',
  lifestyle_notes text[] default '{"לא מבשלת בערב","ארוחת צהריים בימי משרד מוזמנת (סיבוס)","ילדה קטנה בבית — זמן בישול מוגבל","ארוחות עצלות עם ירקות קפואים הן אופציה לגיטימית"}',

  updated_at timestamptz not null default now()
);

-- ── SCHEDULED REMINDERS ──
-- Generated from the approved menu + settings; a background job reads this table and fires push notifications
create table reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('shop','recv','prep','cook','eat','sport','thaw')),
  title text not null,
  body text,
  scheduled_for timestamptz not null,
  sent boolean not null default false,
  related_recipe_id uuid references recipes(id),
  created_at timestamptz not null default now()
);

-- ── PUSH SUBSCRIPTIONS ──
-- Stores the browser's push notification endpoint (created when the user enables notifications in the PWA)
create table push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════════
-- Row Level Security — every user can only see/edit their own data.
-- Recipes are shared read-only reference data seeded once; menu_days,
-- user_settings, reminders, and push_subscriptions are private per-user.
-- ═══════════════════════════════════════════════════════════

alter table recipes enable row level security;
alter table recipe_ingredients enable row level security;
alter table menu_days enable row level security;
alter table user_settings enable row level security;
alter table reminders enable row level security;
alter table push_subscriptions enable row level security;

-- Recipes + ingredients: readable by any signed-in user (single-household app, shared recipe library)
create policy "recipes_read_all" on recipes for select using (auth.role() = 'authenticated');
create policy "recipes_write_own" on recipes for all using (auth.role() = 'authenticated');
create policy "ingredients_read_all" on recipe_ingredients for select using (auth.role() = 'authenticated');
create policy "ingredients_write_own" on recipe_ingredients for all using (auth.role() = 'authenticated');

-- Everything else: strictly scoped to the owning user
create policy "menu_days_own" on menu_days for all using (auth.uid() = user_id);
create policy "user_settings_own" on user_settings for all using (auth.uid() = user_id);
create policy "reminders_own" on reminders for all using (auth.uid() = user_id);
create policy "push_subscriptions_own" on push_subscriptions for all using (auth.uid() = user_id);

-- Helpful indexes for the queries the app runs most often
create index idx_menu_days_user_date on menu_days(user_id, date);
create index idx_recipes_meal_slot on recipes(meal_slot, status);
create index idx_recipe_ingredients_recipe on recipe_ingredients(recipe_id);
create index idx_reminders_user_scheduled on reminders(user_id, scheduled_for) where sent = false;

-- ═══════════════════════════════════════════════════════════
-- Auto-create a default settings row whenever a new user signs up,
-- so the app never has to handle a "no settings yet" case manually.
-- ═══════════════════════════════════════════════════════════
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_settings (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
