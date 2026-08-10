-- ═══════════════════════════════════════════════════════════
-- מטבגיל — Seed data: recipes + ingredients ported from the prototype
-- Run this AFTER schema.sql, in the Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

-- Safe to re-run: clears any partially-inserted data from a previous failed attempt
-- before inserting fresh. (recipe_ingredients is cleared automatically via ON DELETE CASCADE.)
TRUNCATE TABLE recipes CASCADE;

-- סלמון במחבת ברוטב שום ודבש
WITH recipe_r1 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'סלמון במחבת ברוטב שום ודבש', 'דג', '🐟', 'lunch', 'approved', 5, 'all',
    460, 44, 1, 'דיאטטי', 'בריא', 5, 10,
    '{"דג","מהיר"}', NULL, NULL, 'kal-lehachana.co.il',
    '{"מתבלים את הסלמון במלח ופלפל","מערבבים דבש, מים, חומץ, שמן זית ושום לרוטב","צורבים את הסלמון במחבת חמה 3-4 דקות מכל צד","יוצקים את הרוטב ומטגנים עוד דקה עד שהוא מסמיך","מגישים עם פלחי לימון"}', true, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r1, (VALUES
  ('פילה סלמון טרי', 220, 'גר׳', 'fresh-fish', false, 0),
  ('דבש', 2, 'כפות', 'pantry', false, 1),
  ('שום', 3, 'שיני', 'fresh-produce', false, 2),
  ('חומץ תפוחים', 1.5, 'כפית', 'pantry', false, 3)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- פילה דניס בתנור בלימון ושום
WITH recipe_r2 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'פילה דניס בתנור בלימון ושום', 'דג', '🐟', 'lunch', 'approved', 5, 'all',
    420, 44, 1, 'דיאטטי', 'בריא', 5, 12,
    '{"דג","מהיר"}', NULL, NULL, '10dakot.co.il',
    '{"מחממים תנור ל-200°C ומרפדים תבנית בנייר אפייה","מניחים פילטים עם העור כלפי מטה","מערבבים שמן זית, לימון, שום, כמון וכוסברה","מורחים על הדגים","אופים 10-12 דקות"}', true, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r2, (VALUES
  ('פילה דניס טרי', 220, 'גר׳', 'fresh-fish', false, 0),
  ('לימון', 1, 'יח׳', 'fresh-produce', false, 1),
  ('שום', 2, 'שיני', 'fresh-produce', false, 2),
  ('כוסברה', 1, 'חופן', 'fresh-sprouts', false, 3)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- דניס בתנור עם ירקות בהשראה יוונית
WITH recipe_r3 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'דניס בתנור עם ירקות בהשראה יוונית', 'דג', '🐟', 'lunch', 'approved', 5, 'all',
    209, 30, 3, 'דיאטטי', 'בריא', 10, 30,
    '{"דג","יווני"}', NULL, NULL, 'thekitchencoach.co.il',
    '{"מחממים תנור ל-200°C","מסדרים עגבניות שרי וקישואים פרוסים בתבנית","מניחים את הדגים מעל הירקות","מזלפים שמן זית ומתבלים","אופים עד שהדג לבן ומתפורר בקלות"}', true, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r3, (VALUES
  ('דג דניס שלם', 450, 'גר׳', 'fresh-fish', false, 0),
  ('עגבניות שרי', 200, 'גר׳', 'fresh-produce', false, 1),
  ('קישוא', 1, 'יח׳', 'fresh-produce', false, 2),
  ('תפוחי אדמה', 2, 'יח׳', 'fresh-produce', false, 3)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- לברק/דניס בתנור עם לימון, כוסברה ופפריקה
WITH recipe_r13 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'לברק/דניס בתנור עם לימון, כוסברה ופפריקה', 'דג', '🐟', 'lunch', 'approved', 5, 'all',
    249, 44, 2, 'דיאטטי', 'בריא', 8, 18,
    '{"דג","מהיר"}', NULL, NULL, 'המתכון של גיל',
    '{"מסדרים את פילטי הדג בתבנית עם נייר אפייה","סוחטים לימון, מפזרים כוסברה קצוצה, שום כתוש ופפריקה","מזלפים שמן זית","אופים בתנור חם (200°C) כ-15-20 דקות עד שהדג מתפורר בקלות"}', true, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r13, (VALUES
  ('פילה לברק או דניס', 400, 'גר׳', 'fresh-fish', false, 0),
  ('לימון', 3, 'יח׳', 'fresh-produce', false, 1),
  ('כוסברה או פטרוזיליה', 1, 'חופן', 'fresh-sprouts', false, 2),
  ('שמן זית', 2, 'כפות', 'pantry', false, 3),
  ('פפריקה אדומה', 1, 'כפית', 'pantry', false, 4),
  ('שום טרי', 3, 'שיני', 'fresh-produce', false, 5)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- דג ברוטב אדום של שישי
WITH recipe_r14 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'דג ברוטב אדום של שישי', 'דג', '🐟', 'dinner', 'approved', 5, 'winter',
    236, 33, 3, 'דיאטטי', 'בריא', 15, 25,
    '{"דג"}', 5, NULL, 'המתכון של שישי',
    '{"מטגנים בצל ושום בשמן עד שקוף","מוסיפים פלפל אדום ופלפל חריף קצוצים, מטגנים עוד כמה דקות","מוסיפים עגבניות מגוררות ופפריקה, מבשלים לרוטב סמיך","מניחים את פילטי הדג ברוטב, מפזרים כוסברה","מבשלים על אש נמוכה כ-15 דקות עד שהדג מוכן"}', true, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r14, (VALUES
  ('פילה לברק או דניס', 500, 'גר׳', 'fresh-fish', false, 0),
  ('פלפל אדום', 3, 'יח׳', 'fresh-produce', false, 1),
  ('עגבניות', 4, 'יח׳', 'fresh-produce', false, 2),
  ('פלפל ירוק חריף', 1, 'יח׳', 'fresh-produce', false, 3),
  ('כוסברה', 1, 'חופן', 'fresh-sprouts', false, 4),
  ('פפריקה אדומה', 1, 'כפית', 'pantry', false, 5),
  ('בצל', 1, 'יח׳', 'fresh-produce', false, 6),
  ('שום', 3, 'שיני', 'fresh-produce', false, 7)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- חזה עוף עם קינואה בתנור
WITH recipe_r4 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'חזה עוף עם קינואה בתנור', 'עוף', '🍗', 'lunch', 'approved', 4, 'all',
    560, 80, 1, 'לא-דיאטטי', 'בריא', 15, 25,
    '{"עוף","חלבון"}', NULL, NULL, 'gilacooking.co.il',
    '{"שוטפים קינואה ומבשלים במים על אש נמוכה עד שהמים נספגים","מתבלים את חזה העוף","מניחים עוף וקינואה מבושלת בתבנית","אופים כ-25 דקות ב-200°C עד שהעוף עשוי"}', true, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r4, (VALUES
  ('חזה עוף', 230, 'גר׳', 'freezer-meat', true, 0),
  ('קינואה', 100, 'גר׳', 'pantry', false, 1),
  ('שמן זית', 1, 'כף', 'pantry', false, 2)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- קציצות בקר קלות ברוטב עגבניות
WITH recipe_r5 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'קציצות בקר קלות ברוטב עגבניות', 'בשר', '🍖', 'lunch', 'approved', 4, 'all',
    560, 61, 1, 'לא-דיאטטי', 'בריא', 15, 25,
    '{"בשר"}', NULL, NULL, 'kal-lehachana.co.il',
    '{"מערבבים בשר, בצל, פירורי לחם ותבלינים","מעצבים קציצות","מטגנים בצל לרוטב ומוסיפים רסק ועגבנייה","מניחים את הקציצות ברוטב ומבשלים 20 דקות"}', true, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r5, (VALUES
  ('בקר טחון', 220, 'גר׳', 'freezer-meat', true, 0),
  ('אורז מלא', 60, 'גר׳', 'pantry', false, 1),
  ('בצל', 1, 'יח׳', 'fresh-produce', false, 2),
  ('רסק עגבניות', 2, 'כפות', 'pantry', false, 3)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- סלט עגבניות ומלפפונים עם פטה
WITH recipe_r6 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'סלט עגבניות ומלפפונים עם פטה', 'סלט', '🥗', 'lunch', 'approved', 5, 'summer',
    480, 18, 1, 'דיאטטי', 'פחות-בריא', 8, 0,
    '{"סלט","יווני","ללא בישול"}', NULL, NULL, 'שילוב אישי',
    '{"חותכים את הירקות","מערבבים עם גבינה ושמן זית","מתבלים בלימון, מלח ואורגנו"}', true, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r6, (VALUES
  ('עגבניות שרי', 150, 'גר׳', 'fresh-produce', false, 0),
  ('מלפפון', 1, 'יח׳', 'fresh-produce', false, 1),
  ('גבינה בולגרית', 100, 'גר׳', 'weekly-dairy', false, 2),
  ('שמן זית', 1, 'כף', 'pantry', false, 3)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- סלט קינואה עם ירקות צלויים וחומוס
WITH recipe_r7 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'סלט קינואה עם ירקות צלויים וחומוס', 'סלט', '🥗', 'lunch', 'approved', 4, 'all',
    520, 9, 1, 'לא-דיאטטי', 'בריא', 5, 0,
    '{"סלט","צמחוני"}', NULL, NULL, 'שילוב אישי',
    '{"מערבבים קינואה עם ירקות צלויים","מוסיפים כפות חומוס","מזלפים שמן זית ולימון"}', true, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r7, (VALUES
  ('קינואה', 100, 'גר׳', 'pantry', false, 0),
  ('ברוקולי', 100, 'גר׳', 'fresh-produce', false, 1),
  ('חומוס', 4, 'כפות', 'pantry', false, 2)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- סלט בישבש של ירדי
WITH recipe_r15 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'סלט בישבש של ירדי', 'סלט', '🥗', 'lunch', 'approved', 5, 'summer',
    280, 0, 1, 'דיאטטי', 'בריא', 10, 0,
    '{"סלט","ללא בישול","קליל"}', NULL, NULL, 'המתכון של ירדי',
    '{"פורסים דק את השומר, הגזר והכרוב (סכין חדה או פומפייה)","סוחטים לימון ומערבבים היטב","אפשר להוסיף שמן זית ומלח לפי טעם — הכי טוב אחרי כמה דקות מנוחה"}', true, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r15, (VALUES
  ('שומר', 1, 'יח׳', 'fresh-produce', false, 0),
  ('גזר', 2, 'יח׳', 'fresh-produce', false, 1),
  ('כרוב', 0.25, 'ראש', 'fresh-produce', false, 2),
  ('לימון', 2, 'יח׳', 'fresh-produce', false, 3)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- סביצ׳ה של גיל
WITH recipe_r16 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'סביצ׳ה של גיל', 'דג', '🐟', 'lunch', 'approved', 5, 'summer',
    380, 61, 1, 'דיאטטי', 'בריא', 20, 0,
    '{"דג","ללא בישול","קליל"}', NULL, NULL, 'המתכון של גיל',
    '{"חותכים את הדג הטרי לקוביות קטנות ומניחים בקערה עם מיץ לימון סחוט (הלימון \"מבשל\" את הדג)","חותכים את הפרי, הבצל הסגול, הפלפל החריף והעגבנייה לקוביות קטנות","מערבבים הכל עם הדג, כוסברה קצוצה ושמן זית","מגישים על מצע עלי רוקט עם כפית גבינת שמנת בצד"}', true, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r16, (VALUES
  ('פילה לברק או דניס טרי', 250, 'גר׳', 'fresh-fish', false, 0),
  ('נקטרינה (או מנגו/אפרסק/משמש)', 3, 'יח׳', 'fresh-produce', false, 1),
  ('בצל סגול', 1, 'יח׳', 'fresh-produce', false, 2),
  ('פלפל חריף ירוק', 1, 'יח׳', 'fresh-produce', false, 3),
  ('גבינת שמנת', 1, 'גביע', 'weekly-dairy', false, 4),
  ('כוסברה', 1, 'חופן', 'fresh-sprouts', false, 5),
  ('עלי רוקט', 1, 'חופן', 'fresh-sprouts', false, 6),
  ('לימון', 4, 'יח׳', 'fresh-produce', false, 7),
  ('עגבנייה', 1, 'יח׳', 'fresh-produce', false, 8),
  ('שמן זית', 2, 'כפות', 'pantry', false, 9)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- שניצל דג מטוגן
WITH recipe_r17 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'שניצל דג מטוגן', 'דג', '🐟', 'lunch', 'approved', 4, 'all',
    480, 64, 1, 'דיאטטי', 'פחות-בריא', 15, 10,
    '{"דג"}', NULL, NULL, 'המתכון שלי',
    '{"מכינים 3 קערות: קמח, ביצים טרופות, פירורי לחם","טובלים כל פרוסת דג בקמח, אחר כך בביצה, ולבסוף בפירורי לחם","מטגנים בשמן חם עד הזהבה משני הצדדים (כ-3-4 דקות לכל צד)"}', true, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r17, (VALUES
  ('פילה דניס', 250, 'גר׳', 'fresh-fish', false, 0),
  ('קמח', 100, 'גר׳', 'pantry', false, 1),
  ('פירורי לחם', 100, 'גר׳', 'pantry', false, 2),
  ('ביצים', 2, 'יח׳', 'pantry', false, 3)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- מרק עוף של גיל
WITH recipe_r18 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'מרק עוף של גיל', 'מרק', '🍲', 'lunch', 'approved', 5, 'winter',
    590, 75, 2, 'לא-דיאטטי', 'בריא', 20, 70,
    '{"עוף","מרק","חם"}', NULL, NULL, 'המתכון של גיל',
    '{"מניחים את העוף והגרונות בסיר גדול עם מים לכיסוי, מביאים לרתיחה ומסירים קצף","מוסיפים את כל הירקות החתוכים לגסים (תפו״א, סלרי, בטטה, גזר, שום)","מבשלים על אש נמוכה כשעה עד שהעוף רך והירקות מתרככים","לקראת הסוף מוסיפים שמיר, פטרוזיליה ועלי סלרי קצוצים","מתבלים במלח ופלפל לפי טעם"}', true, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r18, (VALUES
  ('תפוחי אדמה', 2, 'יח׳', 'fresh-produce', false, 0),
  ('סלרי (ראש)', 1.5, 'יח׳', 'fresh-produce', false, 1),
  ('בטטה', 1, 'יח׳', 'fresh-produce', false, 2),
  ('גזר', 4, 'יח׳', 'fresh-produce', false, 3),
  ('שמיר', 1, 'חופן', 'fresh-sprouts', false, 4),
  ('פטרוזיליה', 1, 'חופן', 'fresh-sprouts', false, 5),
  ('שום', 3, 'שיני', 'fresh-produce', false, 6),
  ('עלי סלרי', 1, 'חופן', 'fresh-sprouts', false, 7),
  ('שוקי עוף או חזה עוף', 2, 'יח׳', 'freezer-meat', false, 8),
  ('גרונות עוף', 2, 'יח׳', 'freezer-meat', false, 9)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- מרק בורשט
WITH recipe_r19 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'מרק בורשט', 'מרק', '🍲', 'lunch', 'approved', 4, 'winter',
    313, 26, 2, 'דיאטטי', 'בריא', 20, 60,
    '{"בשר","מרק","חם"}', NULL, NULL, 'hashulchan.co.il — השף אסף מישקובסקי',
    '{"מבשלים את הבשר (אם משתמשים) בסיר עם מים כ-40 דקות עד שמתרכך","מוסיפים סלק, כרוב, בצל וגזר חתוכים","ממשיכים לבשל כ-30-40 דקות נוספות עד שהירקות רכים","מאזנים טעם עם מיץ לימון, מלח וקצת סוכר לפי הצורך","מגישים עם כף שמנת חמוצה במרכז הצלחת"}', true, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r19, (VALUES
  ('סלק', 4, 'יח׳', 'fresh-produce', false, 0),
  ('בקר לתבשיל (או ציר ירקות בלבד)', 200, 'גר׳', 'freezer-meat', false, 1),
  ('כרוב לבן', 0.25, 'ראש', 'fresh-produce', false, 2),
  ('בצל', 1, 'יח׳', 'fresh-produce', false, 3),
  ('גזר', 2, 'יח׳', 'fresh-produce', false, 4),
  ('מיץ לימון', 2, 'כפות', 'pantry', false, 5),
  ('שמנת חמוצה להגשה', 2, 'כפות', 'weekly-dairy', false, 6)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- מחית עוף וירקות לתינוקת
WITH recipe_r8 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'מחית עוף וירקות לתינוקת', 'תינוקת', '👶', 'lunch', 'approved', 5, 'all',
    210, 19, 1, 'דיאטטי', 'בריא', 5, 20,
    '{}', NULL, NULL, 'sleepmybaby.co.il',
    '{"מבשלים את כל הירקות והעוף עד רכים","טוחנים הכל יחד עם מעט ממי הבישול למרקם חלק"}', true, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r8, (VALUES
  ('חזה עוף מבושל', 60, 'גר׳', 'freezer-meat', false, 0),
  ('גזר מבושל', 1, 'יח׳', 'fresh-produce', false, 1),
  ('תפוח אדמה מבושל', 1, 'יח׳', 'fresh-produce', false, 2),
  ('קישוא מבושל', 0.5, 'יח׳', 'fresh-produce', false, 3)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- דייסת אורז עם מחית בננה
WITH recipe_r9 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'דייסת אורז עם מחית בננה', 'תינוקת', '👶', 'breakfast', 'approved', 5, 'all',
    180, 0, 1, 'דיאטטי', 'בריא', 5, 5,
    '{}', NULL, NULL, 'firsttaste.co.il',
    '{"מכינים דייסת אורז לפי ההוראות על גבי האריזה","מועכים בננה למחית חלקה","מערבבים יחד"}', true, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r9, (VALUES
  ('פתיתי אורז לתינוקות', 30, 'גר׳', 'pantry', false, 0),
  ('בננה', 0.5, 'יח׳', 'fresh-produce', false, 1)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- קציצות חזה עוף עם ירקות מגוררים
WITH recipe_r10 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'קציצות חזה עוף עם ירקות מגוררים', 'עוף', '🍗', 'lunch', 'pending', 0, 'all',
    364, 62, 2, 'דיאטטי', 'בריא', 15, 15,
    '{"עוף","חלבון"}', NULL, NULL, 'kal-lehachana.co.il',
    '{"מערבבים את כל המרכיבים בקערה","מעצבים קציצות","מטגנים משני הצדדים עד הזהבה"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r10, (VALUES
  ('חזה עוף טחון', 400, 'גר׳', 'freezer-meat', true, 0),
  ('בצל', 1, 'יח׳', 'fresh-produce', false, 1),
  ('פטרוזיליה', 1, 'חופן', 'fresh-sprouts', false, 2),
  ('גזר מגורר', 1, 'יח׳', 'fresh-produce', false, 3)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- טונה צרובה עם סלט ירקות
WITH recipe_r12 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'טונה צרובה עם סלט ירקות', 'דג', '🐟', 'lunch', 'pending', 0, 'summer',
    480, 50, 1, 'דיאטטי', 'בריא', 5, 3,
    '{"דג","מהיר"}', NULL, NULL, 'm-achiya.co.il',
    '{"צורבים את הטונה 20 שניות מכל צד על אש חזקה","מקררים ופורסים דק","מגישים עם סלט ירקות"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r12, (VALUES
  ('פילה טונה טרי', 200, 'גר׳', 'fresh-fish', false, 0),
  ('סלט ירקות טרי', 150, 'גר׳', 'fresh-sprouts', false, 1)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- שקשוקה ירוקה עם תרד
WITH recipe_r21 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'שקשוקה ירוקה עם תרד', 'ביצים', '🍳', 'breakfast', 'pending', 0, 'all',
    380, 14, 1, 'דיאטטי', 'בריא', 10, 15,
    '{"ביצים","ירקות"}', NULL, NULL, 'foodislife.co.il',
    '{"מחממים שמן זית במחבת גדולה, מוסיפים בצל, שום ופלפל ירוק ומטגנים עד לריכוך","מערבבים פנימה כמון וכוסברה טחונה לדקה","מוסיפים תרד, כוסברה ופטרוזיליה קצוצים ומבשלים עד שהעלים נובלים","מערבבים פנימה עגבניות קצוצות ומבשלים כ-5 דקות","יוצרים בארות בתערובת ופורצים לתוכן ביצים, מכסים ומבשלים עד המידה הרצויה"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r21, (VALUES
  ('תרד טרי', 150, 'גר׳', 'fresh-sprouts', false, 0),
  ('כוסברה', 1, 'חופן', 'fresh-sprouts', false, 1),
  ('פטרוזיליה', 1, 'חופן', 'fresh-sprouts', false, 2),
  ('בצל', 0.5, 'יח׳', 'fresh-produce', false, 3),
  ('פלפל ירוק חריף', 0.5, 'יח׳', 'fresh-produce', false, 4),
  ('עגבניות', 2, 'יח׳', 'fresh-produce', false, 5),
  ('ביצים', 2, 'יח׳', 'pantry', false, 6),
  ('כמון וכוסברה טחונה', 1, 'כפית', 'pantry', false, 7)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- המבורגר הודו ביתי עם רוטב טרטר
WITH recipe_r22 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'המבורגר הודו ביתי עם רוטב טרטר', 'הודו', '🍔', 'lunch', 'pending', 0, 'summer',
    520, 59, 1, 'לא-דיאטטי', 'בריא', 20, 12,
    '{"הודו","מהיר"}', NULL, NULL, 'kikar.co.il',
    '{"משלבים בקערה בשר הודו, שום כתוש, מלח, פלפל, זעתר, מעט שמן זית ופטרוזיליה קצוצה","מערבבים בעדינות רק עד לאיחוד, מעצבים לקציצה ומשטיחים קלות","מצננים במקרר כ-15 דקות לפני הצלייה","צולים במחבת פסים חמה כ-10-12 דקות, הופכים באמצע, עד לבישול מלא","מגישים בתוך לחמנייה קלויה"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r22, (VALUES
  ('הודו טחון', 220, 'גר׳', 'freezer-meat', true, 0),
  ('שום', 2, 'שיני', 'fresh-produce', false, 1),
  ('זעתר', 1, 'כפית', 'pantry', false, 2),
  ('פטרוזיליה', 1, 'חופן', 'fresh-sprouts', false, 3),
  ('לחמנייה מחיטה מלאה', 1, 'יח׳', 'pantry', false, 4)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- עוף ואורז בתנור בתבנית אחת
WITH recipe_r23 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'עוף ואורז בתנור בתבנית אחת', 'עוף', '🍗', 'lunch', 'pending', 0, 'winter',
    611, 29, 2, 'לא-דיאטטי', 'פחות-בריא', 15, 60,
    '{"עוף","חם"}', NULL, NULL, '10dakot.co.il',
    '{"משרים את האורז במים כשעה מראש ומסננים","מערבבים בתבנית את האורז עם גזר מגורד, שום, שמן ומלח","מוסיפים מים רותחים לתבנית","מתבלים את חלקי העוף בסילאן, פפריקה, מלח ופלפל","מניחים את העוף מעל תערובת האורז ואופים בתנור חם עד לגימור (כשעה)"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r23, (VALUES
  ('שוקי עוף', 4, 'יח׳', 'freezer-meat', true, 0),
  ('אורז לבן', 200, 'גר׳', 'pantry', false, 1),
  ('גזר', 2, 'יח׳', 'fresh-produce', false, 2),
  ('שום', 2, 'שיני', 'fresh-produce', false, 3),
  ('סילאן', 1, 'כף', 'pantry', false, 4),
  ('פפריקה מתוקה', 1, 'כפית', 'pantry', false, 5)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- עוף מתוק בתנור ברוטב דבש וצ׳ילי
WITH recipe_r24 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'עוף מתוק בתנור ברוטב דבש וצ׳ילי', 'עוף', '🍗', 'lunch', 'pending', 0, 'all',
    540, 71, 1, 'לא-דיאטטי', 'בריא', 5, 28,
    '{"עוף","מהיר"}', NULL, NULL, '10dakot.co.il',
    '{"מערבבים דבש, רוטב צ׳ילי מתוק ושום כתוש לרוטב","מניחים את חזה העוף בתבנית ויוצקים את הרוטב מעליו","אופים בתנור חם (200°C) כ-25-30 דקות, כשמדי פעם מבריישים ברוטב שנוצר"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r24, (VALUES
  ('חזה עוף', 230, 'גר׳', 'freezer-meat', true, 0),
  ('דבש', 2, 'כפות', 'pantry', false, 1),
  ('רוטב צ׳ילי מתוק', 2, 'כפות', 'pantry', false, 2),
  ('שום', 2, 'שיני', 'fresh-produce', false, 3)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- חזה עוף בקארי וחלב קוקוס עם אורז
WITH recipe_r25 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'חזה עוף בקארי וחלב קוקוס עם אורז', 'עוף', '🍛', 'lunch', 'pending', 0, 'winter',
    580, 74, 1, 'לא-דיאטטי', 'פחות-בריא', 15, 20,
    '{"עוף","חם"}', NULL, NULL, '10dakot.co.il',
    '{"מטגנים בצל בסיר רחב עד להזהבה קלה","מוסיפים שום, ג׳ינג׳ר ועגבנייה, מבשלים עד שהעגבנייה מתרככת","מוסיפים קוביות חזה עוף ומטגנים כדקה מכל צד","מוסיפים אבקת קארי ורוטב סויה, מערבבים היטב","מבשלים על אש נמוכה עד שהעוף מוכן, מגישים עם אורז לבן"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r25, (VALUES
  ('חזה עוף', 220, 'גר׳', 'freezer-meat', true, 0),
  ('אורז לבן', 80, 'גר׳', 'pantry', false, 1),
  ('בצל', 0.5, 'יח׳', 'fresh-produce', false, 2),
  ('שום וג׳ינג׳ר', 1, 'כף', 'fresh-produce', false, 3),
  ('עגבנייה', 1, 'יח׳', 'fresh-produce', false, 4),
  ('אבקת קארי', 1.5, 'כפית', 'pantry', false, 5),
  ('רוטב סויה', 1, 'כף', 'pantry', false, 6)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- פריטטה ירקות עם גבינה בולגרית
WITH recipe_r26 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'פריטטה ירקות עם גבינה בולגרית', 'ביצים', '🍳', 'breakfast', 'approved', 5, 'all',
    390, 27, 1, 'דיאטטי', 'בריא', 10, 15,
    '{"ביצים","לא מתוק"}', NULL, NULL, '10dakot.co.il',
    '{"מטגנים בצל במחבת עם ציפוי עד להזהבה קלה","מוסיפים תפוח אדמה וקישוא חתוכים לקוביות קטנות, מכסים ומבשלים עד רכים","מצננים מעט את התערובת","טורפים ביצים בקערית, מוסיפים את תערובת הירקות, גבינה בולגרית ופטרוזיליה קצוצה","יוצקים חזרה למחבת חמה עם מעט שמן, מכסים ומבשלים כ-4-5 דקות מכל צד"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r26, (VALUES
  ('ביצים', 3, 'יח׳', 'pantry', false, 0),
  ('בצל', 0.5, 'יח׳', 'fresh-produce', false, 1),
  ('קישוא', 0.5, 'יח׳', 'fresh-produce', false, 2),
  ('תפוח אדמה קטן', 0.5, 'יח׳', 'fresh-produce', false, 3),
  ('גבינה בולגרית', 40, 'גר׳', 'weekly-dairy', false, 4),
  ('פטרוזיליה', 1, 'חופן', 'fresh-sprouts', false, 5)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- ביצים מקושקשות עם תרד ועגבנייה (פשוט)
WITH recipe_r27 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'ביצים מקושקשות עם תרד ועגבנייה (פשוט)', 'ביצים', '🍳', 'breakfast', 'approved', 5, 'all',
    340, 21, 1, 'דיאטטי', 'בריא', 5, 6,
    '{"ביצים","מהיר","לא מתוק"}', NULL, NULL, 'שילוב אישי',
    '{"מטגנים תרד קצוץ במעט שמן זית עד שנובל","מוסיפים עגבנייה קצוצה, מבשלים 2 דקות","טורפים ביצים ומוסיפים למחבת, מקשקשים עד המרקם הרצוי"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r27, (VALUES
  ('ביצים', 3, 'יח׳', 'pantry', false, 0),
  ('תרד טרי', 50, 'גר׳', 'fresh-sprouts', false, 1),
  ('עגבנייה', 1, 'יח׳', 'fresh-produce', false, 2)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- ממרח חומוס עם ירקות וביצה קשה
WITH recipe_r28 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'ממרח חומוס עם ירקות וביצה קשה', 'ללא בישול', '🥙', 'breakfast', 'approved', 4, 'all',
    360, 19, 1, 'דיאטטי', 'בריא', 5, 0,
    '{"ללא בישול","מהיר","לא מתוק"}', NULL, NULL, 'שילוב אישי',
    '{"פורסים לחם ומורחים חומוס בנדיבות","חותכים ביצה קשה לפרוסות ומניחים מעל","מוסיפים ירקות טריים חתוכים בצד"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r28, (VALUES
  ('חומוס', 4, 'כפות', 'pantry', false, 0),
  ('ביצה קשה', 2, 'יח׳', 'pantry', false, 1),
  ('מלפפון ועגבנייה חתוכים', 1, 'מנה', 'fresh-produce', false, 2),
  ('פרוסת לחם מחיטה מלאה', 1, 'יח׳', 'pantry', false, 3)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- דייסת שיבולת שועל מלוחה עם ביצה ואגוזים
WITH recipe_r55 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'דייסת שיבולת שועל מלוחה עם ביצה ואגוזים', 'ללא בישול', '🥣', 'breakfast', 'approved', 5, 'winter',
    360, 16, 1, 'דיאטטי', 'בריא', 3, 7,
    '{"לא מתוק","חם","חלבון"}', NULL, NULL, 'quaker.co.il',
    '{"מבשלים שיבולת שועל במים כ-5-7 דקות עד למרקם דייסה","מתבלים בקורט מלח (לא ממתיקים)","פורסים ביצה קשה מעל","מפזרים אגוזי מלך גרוסים"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r55, (VALUES
  ('שיבולת שועל', 50, 'גר׳', 'pantry', false, 0),
  ('ביצה קשה', 1, 'יח׳', 'pantry', false, 1),
  ('אגוזי מלך', 15, 'גר׳', 'pantry', false, 2),
  ('מלח', 1, 'קורט', 'pantry', false, 3)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- לאבנה עם שמן זית, זעתר וירקות טריים
WITH recipe_r56 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'לאבנה עם שמן זית, זעתר וירקות טריים', 'ללא בישול', '🧈', 'breakfast', 'approved', 5, 'summer',
    320, 13, 1, 'דיאטטי', 'פחות-בריא', 5, 0,
    '{"ללא בישול","מהיר","לא מתוק"}', NULL, NULL, 'omermiller.co.il',
    '{"שופכים לאבנה לצלחת","מזלפים שמן זית ומפזרים זעתר","מגישים לצד ירקות טריים חתוכים"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r56, (VALUES
  ('לאבנה או גבינה לבנה סמיכה', 100, 'גר׳', 'weekly-dairy', false, 0),
  ('שמן זית', 1, 'כף', 'pantry', false, 1),
  ('זעתר', 1, 'כפית', 'pantry', false, 2),
  ('מלפפון ועגבנייה חתוכים', 1, 'מנה', 'fresh-produce', false, 3)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- ביצי עין עם עגבניות שרי צלויות
WITH recipe_r57 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'ביצי עין עם עגבניות שרי צלויות', 'ביצים', '🍳', 'breakfast', 'approved', 4, 'all',
    330, 18, 1, 'דיאטטי', 'בריא', 3, 8,
    '{"ביצים","לא מתוק"}', NULL, NULL, 'שילוב אישי',
    '{"מטגנים עגבניות שרי שלמות במחבת עם שמן זית כ-5 דקות עד שהעור נסדק","מפנים מקום ופורצים ביצים למחבת","מבשלים עד המידה הרצויה, מתבלים במלח ופלפל"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r57, (VALUES
  ('ביצים', 2, 'יח׳', 'pantry', false, 0),
  ('עגבניות שרי', 150, 'גר׳', 'fresh-produce', false, 1),
  ('שמן זית', 1, 'כף', 'pantry', false, 2)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- קערת קוטג׳ עם ירקות טריים
WITH recipe_r58 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'קערת קוטג׳ עם ירקות טריים', 'ללא בישול', '🥗', 'breakfast', 'approved', 4, 'all',
    280, 0, 1, 'דיאטטי', 'פחות-בריא', 5, 0,
    '{"ללא בישול","מהיר","לא מתוק"}', NULL, NULL, 'שילוב אישי',
    '{"שמים קוטג׳ בקערה","מוסיפים ירקות חתוכים וצנוניות פרוסות דק","מזלפים שמן זית ומתבלים במלח ופלפל"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r58, (VALUES
  ('גבינת קוטג׳ 5%', 200, 'גר׳', 'weekly-dairy', false, 0),
  ('מלפפון ופלפל חתוכים', 1, 'מנה', 'fresh-produce', false, 1),
  ('צנוניות', 4, 'יח׳', 'fresh-produce', false, 2)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- שקשוקה חורפית עם כרובית וכמון
WITH recipe_r59 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'שקשוקה חורפית עם כרובית וכמון', 'ביצים', '🍳', 'breakfast', 'approved', 4, 'winter',
    370, 14, 1, 'דיאטטי', 'בריא', 8, 15,
    '{"ביצים","חם"}', NULL, NULL, 'שילוב אישי',
    '{"מאדים פרחי כרובית קטנים כ-5 דקות","מטגנים עגבניות קצוצות עם כמון עד לרוטב","מוסיפים כרובית מאודה","פורצים ביצים ומבשלים עד המידה הרצויה"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r59, (VALUES
  ('ביצים', 2, 'יח׳', 'pantry', false, 0),
  ('כרובית', 150, 'גר׳', 'fresh-produce', false, 1),
  ('עגבניות', 2, 'יח׳', 'fresh-produce', false, 2),
  ('כמון', 1, 'כפית', 'pantry', false, 3)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- ביצים קשות עם חומוס ועלים ירוקים
WITH recipe_r60 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'ביצים קשות עם חומוס ועלים ירוקים', 'ללא בישול', '🥚', 'breakfast', 'approved', 4, 'all',
    340, 18, 1, 'דיאטטי', 'בריא', 3, 0,
    '{"ללא בישול","מהיר","לא מתוק","חלבון"}', NULL, NULL, 'שילוב אישי',
    '{"חוצים ביצים קשות","מגישים עם מנת חומוס נדיבה בצד","מוסיפים עלים ירוקים ומזלפים שמן זית"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r60, (VALUES
  ('ביצים קשות', 2, 'יח׳', 'pantry', false, 0),
  ('חומוס', 3, 'כפות', 'pantry', false, 1),
  ('עלים ירוקים', 50, 'גר׳', 'fresh-sprouts', false, 2)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- שייק ירוק עם תרד, מלפפון ואגוזים
WITH recipe_r61 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'שייק ירוק עם תרד, מלפפון ואגוזים', 'ללא בישול', '🥤', 'breakfast', 'approved', 4, 'summer',
    280, 16, 1, 'דיאטטי', 'בריא', 5, 0,
    '{"ללא בישול","מהיר","לא מתוק"}', NULL, NULL, 'שילוב אישי',
    '{"טוחנים בבלנדר תרד, מלפפון ויוגורט עד למרקם חלק","מוסיפים אגוזים וטוחנים שוב קלות","שותים מיד"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r61, (VALUES
  ('תרד טרי', 50, 'גר׳', 'fresh-sprouts', false, 0),
  ('מלפפון', 1, 'יח׳', 'fresh-produce', false, 1),
  ('יוגורט יווני 5%', 150, 'גר׳', 'weekly-dairy', false, 2),
  ('אגוזי מלך', 15, 'גר׳', 'pantry', false, 3)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- חביתה ספרדית קטנה עם תפוח אדמה ובצל
WITH recipe_r62 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'חביתה ספרדית קטנה עם תפוח אדמה ובצל', 'ביצים', '🍳', 'breakfast', 'approved', 4, 'winter',
    350, 14, 1, 'דיאטטי', 'בריא', 10, 12,
    '{"ביצים","לא מתוק"}', NULL, NULL, 'שילוב אישי',
    '{"פורסים תפוח אדמה ובצל דק, מטגנים בשמן זית עד רכים","טורפים ביצים ומוסיפים למחבת","מבשלים על אש נמוכה עד שנקרש, הופכים בעדינות"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r62, (VALUES
  ('ביצים', 2, 'יח׳', 'pantry', false, 0),
  ('תפוח אדמה קטן', 1, 'יח׳', 'fresh-produce', false, 1),
  ('בצל', 0.5, 'יח׳', 'fresh-produce', false, 2)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- סלט אבוקדו וביצה קשה עם עגבנייה
WITH recipe_r34 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'סלט אבוקדו וביצה קשה עם עגבנייה', 'ללא בישול', '🥑', 'breakfast', 'approved', 4, 'all',
    340, 7, 1, 'דיאטטי', 'בריא', 8, 0,
    '{"ללא בישול","מהיר","לא מתוק"}', NULL, NULL, 'gilacooking.co.il',
    '{"מועכים אבוקדו בגסות עם מיץ לימון","קוצצים בצל סגול ועגבנייה ומערבבים פנימה","חותכים ביצה קשה לקוביות ומוסיפים","מתבלים במלח ופלפל"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r34, (VALUES
  ('אבוקדו', 1, 'יח׳', 'fresh-produce', false, 0),
  ('בצל סגול', 0.25, 'יח׳', 'fresh-produce', false, 1),
  ('עגבנייה', 1, 'יח׳', 'fresh-produce', false, 2),
  ('ביצה קשה', 1, 'יח׳', 'pantry', false, 3),
  ('לימון', 0.5, 'יח׳', 'fresh-produce', false, 4)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- סלט עדשים חומות בלימון ושום
WITH recipe_r29 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'סלט עדשים חומות בלימון ושום', 'סלט', '🥗', 'lunch', 'approved', 5, 'all',
    420, 24, 1, 'דיאטטי', 'בריא', 10, 20,
    '{"סלט","קטניות","ללא בישול"}', NULL, NULL, 'kal-lehachana.co.il',
    '{"מבשלים עדשים חומות שטופות במים עם קורט מלח עד רכות (כ-20 דקות), מסננים ומצננים","קוצצים בצל סגול ופטרוזיליה, כותשים שום","מערבבים הכל עם העדשים","מתבלים במיץ לימון, שמן זית, מלח ופלפל"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r29, (VALUES
  ('עדשים חומות', 180, 'גר׳', 'pantry', false, 0),
  ('בצל סגול', 0.5, 'יח׳', 'fresh-produce', false, 1),
  ('פטרוזיליה', 1, 'חופן', 'fresh-sprouts', false, 2),
  ('שום', 2, 'שיני', 'fresh-produce', false, 3),
  ('לימון', 1, 'יח׳', 'fresh-produce', false, 4),
  ('שמן זית', 2, 'כפות', 'pantry', false, 5)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- סלט קינואה עם עגבניות, מלפפון ופטה
WITH recipe_r30 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'סלט קינואה עם עגבניות, מלפפון ופטה', 'סלט', '🥗', 'lunch', 'approved', 5, 'summer',
    460, 16, 1, 'דיאטטי', 'פחות-בריא', 15, 15,
    '{"סלט","ללא בישול"}', NULL, NULL, 'שילוב אישי',
    '{"מבשלים קינואה לפי ההוראות ומצננים","חותכים עגבניות ומלפפון לקוביות","מערבבים הכל עם גבינה בולגרית מפוררת ונענע קצוצה","מתבלים בשמן זית ומיץ לימון"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r30, (VALUES
  ('קינואה', 100, 'גר׳', 'pantry', false, 0),
  ('עגבניות שרי', 150, 'גר׳', 'fresh-produce', false, 1),
  ('מלפפון', 1, 'יח׳', 'fresh-produce', false, 2),
  ('גבינה בולגרית', 80, 'גר׳', 'weekly-dairy', false, 3),
  ('נענע', 1, 'חופן', 'fresh-sprouts', false, 4),
  ('לימון', 1, 'יח׳', 'fresh-produce', false, 5)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- שניצל חזה עוף בתנור
WITH recipe_r31 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'שניצל חזה עוף בתנור', 'עוף', '🍗', 'lunch', 'approved', 4, 'all',
    480, 78, 1, 'דיאטטי', 'פחות-בריא', 15, 20,
    '{"עוף","חלבון"}', NULL, NULL, 'שילוב אישי',
    '{"מכינים 3 קערות: קמח, ביצה טרופה, פירורי לחם","טובלים כל פרוסת עוף בקמח, ביצה ואז פירורי לחם","מסדרים בתבנית עם נייר אפייה ומרססים מעט שמן","אופים בתנור חם (200°C) כ-20 דקות, הופכים באמצע"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r31, (VALUES
  ('חזה עוף פרוס דק', 230, 'גר׳', 'freezer-meat', true, 0),
  ('קמח', 40, 'גר׳', 'pantry', false, 1),
  ('ביצה', 1, 'יח׳', 'pantry', false, 2),
  ('פירורי לחם', 60, 'גר׳', 'pantry', false, 3)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- רטטוי ירקות צרפתי
WITH recipe_r32 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'רטטוי ירקות צרפתי', 'צמחוני', '🍆', 'dinner', 'approved', 4, 'summer',
    340, 14, 1, 'דיאטטי', 'בריא', 10, 20,
    '{"צמחוני","קליל"}', NULL, NULL, '10dakot.co.il',
    '{"מטגנים בצל בשמן זית עד להזהבה קלה","מוסיפים חציל בקוביות, מטגנים כ-4 דקות","מוסיפים פלפל, מבשלים 2-3 דקות","מוסיפים קישוא, שום, עגבניות שרי, מתבלים ומבשלים עד שהירקות רכים אך פריכים","מגישים עם ביצים קשות חצויות בצד להשלמת חלבון"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r32, (VALUES
  ('חציל', 1, 'יח׳', 'fresh-produce', false, 0),
  ('קישוא', 1, 'יח׳', 'fresh-produce', false, 1),
  ('פלפל צבעוני', 1, 'יח׳', 'fresh-produce', false, 2),
  ('עגבניות שרי', 200, 'גר׳', 'fresh-produce', false, 3),
  ('בצל', 0.5, 'יח׳', 'fresh-produce', false, 4),
  ('שום', 2, 'שיני', 'fresh-produce', false, 5),
  ('ביצה קשה (להוספת חלבון)', 2, 'יח׳', 'pantry', false, 6)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- חופן אגוזים ופרי (יום משרד)
WITH recipe_r35 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'חופן אגוזים ופרי (יום משרד)', 'ללא בישול', '🥜', 'breakfast', 'approved', 5, 'all',
    220, 6, 1, 'דיאטטי', 'בריא', 2, 0,
    '{"ללא בישול","מהיר","יום משרד"}', NULL, '{0,3}', 'שגרת יום משרד',
    '{"אוכלת חופן אגוזים ופרי טרי בדרך למשרד או שם"}', true, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r35, (VALUES
  ('שקדים ואגוזי מלך', 30, 'גר׳', 'pantry', false, 0),
  ('פרי טרי (תפוח/נקטרינה/אגס)', 1, 'יח׳', 'fresh-produce', false, 1)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- סלט טונה (סיבוס — יום משרד)
WITH recipe_r36 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'סלט טונה (סיבוס — יום משרד)', 'הזמנה', '🥗', 'lunch', 'approved', 5, 'all',
    450, 32, 1, 'לא-דיאטטי', 'פחות-בריא', 0, 0,
    '{"דג","הזמנה","יום משרד"}', NULL, '{0,3}', 'סיבוס',
    '{"מזמינה סלט טונה דרך סיבוס במשרד"}', true, false
  )
  RETURNING id
)
SELECT 1;

-- המבורגר איכותי עם ירקות קפואים מאודים
WITH recipe_r37 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'המבורגר איכותי עם ירקות קפואים מאודים', 'בשר', '🍔', 'lunch', 'approved', 5, 'all',
    520, 37, 1, 'לא-דיאטטי', 'בריא', 2, 10,
    '{"בשר","מהיר","10 דק׳"}', NULL, NULL, 'המתכון שלי — פשטות זה עידון',
    '{"מאדים את הירקות הקפואים כ-10 דקות (סיר אידוי או מיקרוגל)","מטגנים/צולים את ההמבורגר לפי ההוראות על גבי האריזה","מתבלים את הירקות המאודים בלימון, שמן זית, מלח ופלפל","מגישים יחד"}', true, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r37, (VALUES
  ('המבורגר קפוא מהקצב', 1, 'יח׳', 'freezer-meat', false, 0),
  ('ירקות קפואים (ברוקולי/כרובית/אפונה/שעועית ירוקה)', 250, 'גר׳', 'pantry', false, 1),
  ('לימון', 0.5, 'יח׳', 'fresh-produce', false, 2),
  ('שמן זית', 1, 'כף', 'pantry', false, 3)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- ירקות קפואים מאודים עם חומוס ולימון
WITH recipe_r38 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'ירקות קפואים מאודים עם חומוס ולימון', 'צמחוני', '🥦', 'lunch', 'approved', 5, 'all',
    380, 9, 1, 'דיאטטי', 'בריא', 2, 10,
    '{"צמחוני","מהיר","10 דק׳"}', NULL, NULL, 'המתכון שלי — פשטות זה עידון',
    '{"מאדים את הירקות הקפואים כ-10 דקות","מתבלים בלימון, שמן זית, מלח ופלפל","מגישים עם מנת חומוס נדיבה בצד"}', true, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r38, (VALUES
  ('ירקות קפואים (ברוקולי/כרובית/אפונה/שעועית ירוקה)', 300, 'גר׳', 'pantry', false, 0),
  ('חומוס', 4, 'כפות', 'pantry', false, 1),
  ('לימון', 0.5, 'יח׳', 'fresh-produce', false, 2),
  ('שמן זית', 1, 'כף', 'pantry', false, 3)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- צזיקי יווני ביתי
WITH recipe_r39 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'צזיקי יווני ביתי', 'ללא בישול', '🥒', 'lunch', 'approved', 5, 'summer',
    220, 19, 1, 'דיאטטי', 'בריא', 10, 0,
    '{"יווני","ללא בישול","מהיר"}', NULL, NULL, 'המתכון שלי',
    '{"מגררים מלפפון גס, סוחטים היטב את הנוזלים העודפים","כותשים שום ומערבבים עם היוגורט","מוסיפים מלפפון מסונן, עשב תיבול קצוץ, שמן זית ומיץ לימון","מתבלים במלח ומצננים כרבע שעה לפני ההגשה"}', true, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r39, (VALUES
  ('יוגורט יווני 10%', 250, 'גר׳', 'weekly-dairy', false, 0),
  ('מלפפון', 1, 'יח׳', 'fresh-produce', false, 1),
  ('שום', 2, 'שיני', 'fresh-produce', false, 2),
  ('שמיר או נענע', 1, 'חופן', 'fresh-sprouts', false, 3),
  ('שמן זית', 1, 'כף', 'pantry', false, 4),
  ('לימון', 0.5, 'יח׳', 'fresh-produce', false, 5)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- סלט קישואים טריים עם יוגורט ונענע
WITH recipe_r40 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'סלט קישואים טריים עם יוגורט ונענע', 'סלט', '🥗', 'lunch', 'approved', 5, 'summer',
    260, 17, 1, 'דיאטטי', 'בריא', 10, 0,
    '{"יווני","ללא בישול","קליל"}', NULL, NULL, 'המתכון שלי',
    '{"פורסים קישואים לפרוסות דקות מאוד (מנדולינה או קולפן)","מערבבים יוגורט עם נענע קצוצה, שמן זית ומיץ לימון לרוטב","יוצקים את הרוטב מעל פרוסות הקישוא","מתבלים במלח ופלפל, מגישים מיד"}', true, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r40, (VALUES
  ('קישואים צעירים', 2, 'יח׳', 'fresh-produce', false, 0),
  ('יוגורט יווני 5%', 150, 'גר׳', 'weekly-dairy', false, 1),
  ('נענע', 1, 'חופן', 'fresh-sprouts', false, 2),
  ('שמן זית', 1, 'כף', 'pantry', false, 3),
  ('לימון', 0.5, 'יח׳', 'fresh-produce', false, 4)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- פילה פורל בתנור עם לימון ושמיר
WITH recipe_r41 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'פילה פורל בתנור עם לימון ושמיר', 'דג', '🐟', 'lunch', 'approved', 5, 'all',
    440, 48, 1, 'דיאטטי', 'בריא', 5, 15,
    '{"דג","מהיר"}', NULL, NULL, 'המתכון שלי',
    '{"מחממים תנור ל-190°C","מניחים את הפילה על נייר אפייה, סוחטים לימון ומפזרים שמיר קצוץ","מזלפים שמן זית ומתבלים במלח ופלפל","אופים כ-15 דקות עד שהדג מתפורר בקלות"}', true, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r41, (VALUES
  ('פילה פורל טרי', 220, 'גר׳', 'fresh-fish', false, 0),
  ('לימון', 1, 'יח׳', 'fresh-produce', false, 1),
  ('שמיר', 1, 'חופן', 'fresh-sprouts', false, 2),
  ('שמן זית', 1, 'כף', 'pantry', false, 3)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- קציצות עוף בתנור עם ירקות מוחבאים
WITH recipe_r42 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'קציצות עוף בתנור עם ירקות מוחבאים', 'עוף', '🍗', 'lunch', 'approved', 5, 'all',
    368, 62, 2, 'דיאטטי', 'בריא', 15, 28,
    '{"עוף","חלבון"}', NULL, NULL, 'kal-lehachana.co.il',
    '{"מערבבים עוף טחון עם בצל, גזר וקישוא מגורדים, שום כתוש ופירורי לחם","מתבלים במלח ופלפל, יוצרים קציצות שטוחות","מסדרים בתבנית עם נייר אפייה ומרססים מעט שמן זית","אופים ב-180°C כ-25-30 דקות, הופכים באמצע"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r42, (VALUES
  ('חזה עוף טחון', 400, 'גר׳', 'freezer-meat', true, 0),
  ('בצל', 1, 'יח׳', 'fresh-produce', false, 1),
  ('גזר מגורד', 1, 'יח׳', 'fresh-produce', false, 2),
  ('קישוא מגורד', 1, 'יח׳', 'fresh-produce', false, 3),
  ('שום', 1, 'שן', 'fresh-produce', false, 4),
  ('פירורי לחם', 60, 'גר׳', 'pantry', false, 5)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- בקר מוקפץ עם ירקות וברוקולי
WITH recipe_r43 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'בקר מוקפץ עם ירקות וברוקולי', 'בשר', '🥘', 'lunch', 'approved', 4, 'all',
    500, 52, 1, 'לא-דיאטטי', 'בריא', 15, 10,
    '{"בשר","מהיר"}', NULL, NULL, 'שילוב אישי',
    '{"פורסים בקר לרצועות דקות","מחממים וֹוק/מחבת רחבה על אש גבוהה עם מעט שמן","מקפיצים בקר כ-2 דקות עד שמשחים, מוציאים לצד","מקפיצים ברוקולי, פלפל ושום כ-3-4 דקות","מחזירים בקר, מוסיפים רוטב סויה ומקפיצים עוד דקה"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r43, (VALUES
  ('נתח בקר לקפצנות (אנטריקוט/פילה)', 200, 'גר׳', 'freezer-meat', true, 0),
  ('ברוקולי', 200, 'גר׳', 'fresh-produce', false, 1),
  ('פלפל צבעוני', 1, 'יח׳', 'fresh-produce', false, 2),
  ('שום', 2, 'שיני', 'fresh-produce', false, 3),
  ('רוטב סויה', 2, 'כפות', 'pantry', false, 4)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- קציצות הודו עם קישוא ומנטה
WITH recipe_r44 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'קציצות הודו עם קישוא ומנטה', 'הודו', '🦃', 'lunch', 'approved', 4, 'all',
    440, 67, 1, 'דיאטטי', 'בריא', 15, 10,
    '{"הודו","חלבון"}', NULL, NULL, 'שילוב אישי',
    '{"סוחטים נוזלים מהקישוא המגורד","מערבבים הודו טחון, קישוא, נענע קצוצה וביצה","מעצבים קציצות ומטגנים במחבת עם מעט שמן זית כ-4 דקות לכל צד"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r44, (VALUES
  ('הודו טחון', 220, 'גר׳', 'freezer-meat', true, 0),
  ('קישוא מגורד', 1, 'יח׳', 'fresh-produce', false, 1),
  ('נענע', 1, 'חופן', 'fresh-sprouts', false, 2),
  ('ביצה', 1, 'יח׳', 'pantry', false, 3)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- שקשוקה עשירה לערב עם גבינה
WITH recipe_r45 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'שקשוקה עשירה לערב עם גבינה', 'ביצים', '🍳', 'dinner', 'approved', 5, 'all',
    410, 21, 1, 'דיאטטי', 'בריא', 10, 15,
    '{"ביצים","קליל"}', NULL, NULL, 'שילוב אישי',
    '{"מטגנים בצל ופלפל בשמן זית עד רכים","מוסיפים עגבניות קצוצות, מבשלים עד שמצטמצם לרוטב","יוצרים בארות ופורצים ביצים פנימה","מפזרים גבינה בולגרית מפוררת, מכסים ומבשלים עד המידה הרצויה"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r45, (VALUES
  ('ביצים', 2, 'יח׳', 'pantry', false, 0),
  ('עגבניות', 3, 'יח׳', 'fresh-produce', false, 1),
  ('פלפל אדום', 1, 'יח׳', 'fresh-produce', false, 2),
  ('גבינה בולגרית', 50, 'גר׳', 'weekly-dairy', false, 3),
  ('בצל', 0.5, 'יח׳', 'fresh-produce', false, 4)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- קערת יוגורט עם פרי ואגוזים
WITH recipe_r46 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'קערת יוגורט עם פרי ואגוזים', 'ללא בישול', '🥣', 'dinner', 'approved', 5, 'summer',
    280, 21, 1, 'דיאטטי', 'בריא', 5, 0,
    '{"ללא בישול","מהיר","קליל"}', NULL, NULL, 'walla.co.il',
    '{"פורסים או חותכים פרי טרי לקוביות","מניחים מעל היוגורט","מפזרים אגוזים או שקדים גרוסים גס","אפשר להוסיף קורט קינמון"}', true, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r46, (VALUES
  ('יוגורט יווני 5%', 200, 'גר׳', 'weekly-dairy', false, 0),
  ('פרי טרי (נקטרינה/אפרסק/פירות יער)', 1, 'מנה', 'fresh-produce', false, 1),
  ('אגוזים או שקדים', 15, 'גר׳', 'pantry', false, 2)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- קרקרים מקמח מלא עם גבינת שמנת וירקות חתוכים
WITH recipe_r48 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'קרקרים מקמח מלא עם גבינת שמנת וירקות חתוכים', 'ללא בישול', '🧀', 'dinner', 'approved', 4, 'all',
    300, 4, 1, 'דיאטטי', 'בריא', 5, 0,
    '{"ללא בישול","מהיר","קליל"}', NULL, NULL, 'שילוב אישי',
    '{"מסדרים קרקרים על צלחת — כדאי לבחור קרקרים מקמח מלא/שיפון עם רכיבים פשוטים וללא תוספת סוכר","מורחים גבינת שמנת","מוסיפים מקלות ירק חתוכים בצד לטבילה"}', true, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r48, (VALUES
  ('קרקרים מקמח מלא/שיפון (ללא תוספת סוכר)', 6, 'יח׳', 'pantry', false, 0),
  ('גבינת שמנת 5%', 60, 'גר׳', 'weekly-dairy', false, 1),
  ('מלפפון וגזר חתוכים', 1, 'מנה', 'fresh-produce', false, 2)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- גספצ׳ו קר עם קרוטונים
WITH recipe_r49 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'גספצ׳ו קר עם קרוטונים', 'מרק', '🍅', 'dinner', 'approved', 5, 'summer',
    85, 4, 2, 'דיאטטי', 'בריא', 15, 0,
    '{"ללא בישול","קליל"}', NULL, NULL, 'hashulchan.co.il',
    '{"טוחנים בבלנדר עגבניות, מלפפון, פלפל ושום עד למרקם חלק","מוסיפים שמן זית, מלח ופלפל, טוחנים שוב","מצננים במקרר לפחות שעה","חותכים לחם ישן לקוביות, קולים או צולים מעט לקרוטונים","מגישים קר עם קרוטונים מעל"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r49, (VALUES
  ('עגבניות בשלות', 5, 'יח׳', 'fresh-produce', false, 0),
  ('מלפפון', 1, 'יח׳', 'fresh-produce', false, 1),
  ('פלפל אדום', 0.5, 'יח׳', 'fresh-produce', false, 2),
  ('שום', 1, 'שן', 'fresh-produce', false, 3),
  ('שמן זית', 2, 'כפות', 'pantry', false, 4),
  ('פרוסת לחם ישן (לקרוטונים)', 1, 'יח׳', 'pantry', false, 5)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- מרק ירקות קליל וחם
WITH recipe_r50 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'מרק ירקות קליל וחם', 'מרק', '🍵', 'dinner', 'approved', 4, 'winter',
    50, 0, 2, 'דיאטטי', 'בריא', 10, 25,
    '{"מרק","חם","קליל"}', NULL, NULL, 'שילוב אישי',
    '{"מבשלים את כל הירקות החתוכים בסיר עם מים לכיסוי כ-25 דקות עד רכים","טוחנים בבלנדר מוט למרקם חלק או גס לפי טעם","מתבלים במלח, פלפל ומעט שמן זית"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r50, (VALUES
  ('גזר', 2, 'יח׳', 'fresh-produce', false, 0),
  ('קישוא', 1, 'יח׳', 'fresh-produce', false, 1),
  ('בצל', 0.5, 'יח׳', 'fresh-produce', false, 2),
  ('תפוח אדמה קטן', 1, 'יח׳', 'fresh-produce', false, 3)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- ביצה קשה עם אבוקדו וירקות חתוכים
WITH recipe_r51 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'ביצה קשה עם אבוקדו וירקות חתוכים', 'ביצים', '🥑', 'dinner', 'approved', 4, 'all',
    310, 14, 1, 'דיאטטי', 'בריא', 5, 0,
    '{"ללא בישול","מהיר","קליל"}', NULL, NULL, 'שילוב אישי',
    '{"חוצים ביצים קשות","פורסים אבוקדו","מסדרים הכל בצלחת עם ירקות חתוכים","מתבלים במלח, פלפל ומעט שמן זית"}', true, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r51, (VALUES
  ('ביצה קשה', 2, 'יח׳', 'pantry', false, 0),
  ('אבוקדו', 0.5, 'יח׳', 'fresh-produce', false, 1),
  ('מלפפון ועגבנייה חתוכים', 1, 'מנה', 'fresh-produce', false, 2)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- גולש הונגרי — תבשיל בקר ופפריקה
WITH recipe_r52 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'גולש הונגרי — תבשיל בקר ופפריקה', 'בשר', '🍲', 'lunch', 'pending', 0, 'winter',
    323, 33, 2, 'דיאטטי', 'בריא', 20, 120,
    '{"בשר","מרק","חם"}', NULL, NULL, 'hashulchan.co.il',
    '{"מטגנים בצל קצוץ עד להזהבה, מוסיפים בשר וצורבים מכל הצדדים","מוסיפים פפריקה ומטגנים דקה (חשוב — זה מפתח את הטעם)","מוציאים לצד, מטגנים פלפל ושום כ-5 דקות","מחזירים בשר ובצל, מוסיפים עגבנייה מגוררת ורסק עגבניות","יוצקים מים לכיסוי, מבשלים על אש נמוכה כשעה עד שעה וחצי","מוסיפים תפוח אדמה, ממשיכים לבשל כ-30 דקות עד שהבשר והתפו״א רכים"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r52, (VALUES
  ('כתף/צלעות בקר לתבשיל', 250, 'גר׳', 'freezer-meat', true, 0),
  ('בצל', 1.5, 'יח׳', 'fresh-produce', false, 1),
  ('פלפל אדום/צהוב', 1, 'יח׳', 'fresh-produce', false, 2),
  ('שום', 2, 'שיני', 'fresh-produce', false, 3),
  ('עגבנייה מגוררת', 1, 'יח׳', 'fresh-produce', false, 4),
  ('רסק עגבניות', 1, 'כף', 'pantry', false, 5),
  ('תפוח אדמה', 1, 'יח׳', 'fresh-produce', false, 6),
  ('פפריקה מתוקה', 1, 'כף', 'pantry', false, 7)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- צלי בקר בתנור עם יין
WITH recipe_r53 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'צלי בקר בתנור עם יין', 'בשר', '🍷', 'lunch', 'pending', 0, 'winter',
    275, 33, 2, 'דיאטטי', 'בריא', 15, 180,
    '{"בשר","חם"}', NULL, NULL, 'meatnet.co.il',
    '{"מכניסים שיני שום שלמות לתוך נקבים בנתח הבשר","כותשים שום, חרדל, פלפל שחור ומלח, מערבבים עם יין אדום","שופכים את התערובת מעל הבשר בתבנית עמוקה","מכסים בנייר כסף היטב","אופים ב-200°C כחצי שעה, מנמיכים ל-180°C וממשיכים כ-2.5-3 שעות עד שהבשר רך ונחתך בקלות","פורסים דק ומגישים עם הרוטב שנוצר"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r53, (VALUES
  ('צלי כתף בקר (נתח שלם)', 250, 'גר׳', 'freezer-meat', true, 0),
  ('שום', 4, 'שיני', 'fresh-produce', false, 1),
  ('חרדל דיז׳ון', 1, 'כף', 'pantry', false, 2),
  ('יין אדום יבש', 0.25, 'כוס', 'pantry', false, 3)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- ביף בורגיניון — תבשיל בקר ביין אדום
WITH recipe_r54 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'ביף בורגיניון — תבשיל בקר ביין אדום', 'בשר', '🍷', 'lunch', 'pending', 0, 'winter',
    299, 33, 2, 'דיאטטי', 'בריא', 20, 180,
    '{"בשר","חם"}', NULL, NULL, 'hashulchan.co.il — עמיר אילן',
    '{"צורבים קוביות בקר בסיר כבד עד שמזהיבות מכל הצדדים, מוציאים לצד","מטגנים גזר ובצל חתוכים גס כ-5 דקות","מחזירים את הבשר לסיר, מוסיפים שום","יוצקים יין אדום עד לכיסוי חצי מגובה הבשר, מוסיפים עלה דפנה וטימין","מכסים ומבשלים על אש נמוכה מאוד (או בתנור 150°C) כ-3 שעות עד שהבשר רך ומתפורר","30 דקות לפני הסוף מוסיפים פטריות פרוסות","מגישים חם, אפשר עם אורז או פירה"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r54, (VALUES
  ('כתף/שריר בקר לתבשיל', 250, 'גר׳', 'freezer-meat', true, 0),
  ('גזר', 1, 'יח׳', 'fresh-produce', false, 1),
  ('בצל', 0.5, 'יח׳', 'fresh-produce', false, 2),
  ('שום', 2, 'שיני', 'fresh-produce', false, 3),
  ('פטריות שמפיניון', 80, 'גר׳', 'fresh-produce', false, 4),
  ('יין אדום יבש (איכותי, לא זול)', 0.5, 'כוס', 'pantry', false, 5),
  ('עלה דפנה וטימין', 1, 'מנה', 'pantry', false, 6)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- לאבנה עם ירקות קלויים חמים
WITH recipe_r63 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'לאבנה עם ירקות קלויים חמים', 'ללא בישול', '🧈', 'dinner', 'approved', 4, 'winter',
    310, 13, 1, 'דיאטטי', 'פחות-בריא', 5, 15,
    '{"קליל"}', NULL, NULL, 'omermiller.co.il',
    '{"צולים פלפל וקישוא חתוכים בתנור/מחבת כ-15 דקות עד רכים","שופכים לאבנה לצלחת","מניחים ירקות חמים מעל, מזלפים שמן זית"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r63, (VALUES
  ('לאבנה או גבינה לבנה סמיכה', 100, 'גר׳', 'weekly-dairy', false, 0),
  ('פלפל וקישוא', 1, 'מנה', 'fresh-produce', false, 1),
  ('שמן זית', 1, 'כף', 'pantry', false, 2)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- סלט קוטג׳ עם ירקות טריים
WITH recipe_r64 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'סלט קוטג׳ עם ירקות טריים', 'ללא בישול', '🥗', 'dinner', 'approved', 4, 'all',
    270, 0, 1, 'דיאטטי', 'פחות-בריא', 5, 0,
    '{"ללא בישול","מהיר","קליל"}', NULL, NULL, 'שילוב אישי',
    '{"מערבבים קוטג׳ עם ירקות חתוכים וצנוניות פרוסות דק","מזלפים שמן זית ומתבלים במלח ופלפל"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r64, (VALUES
  ('גבינת קוטג׳ 5%', 200, 'גר׳', 'weekly-dairy', false, 0),
  ('מלפפון ופלפל חתוכים', 1, 'מנה', 'fresh-produce', false, 1),
  ('צנוניות', 4, 'יח׳', 'fresh-produce', false, 2)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- מרק עדשים כתומות קליל
WITH recipe_r65 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'מרק עדשים כתומות קליל', 'מרק', '🍲', 'dinner', 'approved', 4, 'winter',
    164, 4, 2, 'דיאטטי', 'בריא', 8, 20,
    '{"מרק","חם","קליל"}', NULL, NULL, 'שילוב אישי',
    '{"מטגנים בצל עד שקוף","מוסיפים עדשים שטופות, גזר וכמון","מוסיפים מים לכיסוי ומבשלים כ-20 דקות עד שהעדשים רכות","טוחנים חלקית או מגישים כמו שהוא"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r65, (VALUES
  ('עדשים כתומות', 80, 'גר׳', 'pantry', false, 0),
  ('גזר', 1, 'יח׳', 'fresh-produce', false, 1),
  ('בצל', 0.5, 'יח׳', 'fresh-produce', false, 2),
  ('כמון', 1, 'כפית', 'pantry', false, 3)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- קערת ירקות טריים חתוכים עם טחינה
WITH recipe_r66 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'קערת ירקות טריים חתוכים עם טחינה', 'ללא בישול', '🥒', 'dinner', 'approved', 4, 'summer',
    260, 8, 1, 'דיאטטי', 'בריא', 8, 0,
    '{"ללא בישול","מהיר","קליל"}', NULL, NULL, 'שילוב אישי',
    '{"חותכים ירקות לאצבעות","מדללים טחינה עם מים ולימון עד למרקם רך","טובלים ירקות בטחינה"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r66, (VALUES
  ('מלפפון, גזר, פלפל חתוכים', 1, 'מנה', 'fresh-produce', false, 0),
  ('טחינה גולמית', 3, 'כפות', 'pantry', false, 1),
  ('לימון', 0.5, 'יח׳', 'fresh-produce', false, 2)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- שייק תרד, אננס וג׳ינג׳ר
WITH recipe_r67 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'שייק תרד, אננס וג׳ינג׳ר', 'ללא בישול', '🥤', 'breakfast', 'approved', 4, 'summer',
    220, 0, 1, 'דיאטטי', 'בריא', 5, 0,
    '{"ללא בישול","מהיר","לא מתוק"}', NULL, NULL, 'karenann.co.il',
    '{"טוחנים הכל בבלנדר עד למרקם חלק","שותים מיד"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r67, (VALUES
  ('תרד טרי', 40, 'גר׳', 'fresh-sprouts', false, 0),
  ('אננס טרי/קפוא', 100, 'גר׳', 'fresh-produce', false, 1),
  ('ג׳ינג׳ר טרי', 1, 'פרוסה', 'fresh-produce', false, 2),
  ('מים', 150, 'מ״ל', 'pantry', false, 3)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- שייק חלבון וניל עם בננה וקינמון
WITH recipe_r68 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'שייק חלבון וניל עם בננה וקינמון', 'ללא בישול', '🥤', 'breakfast', 'approved', 4, 'all',
    290, 26, 1, 'דיאטטי', 'בריא', 5, 0,
    '{"ללא בישול","מהיר","חלבון"}', NULL, NULL, 'sahut.co.il',
    '{"טוחנים הכל בבלנדר עד למרקם חלק","מגישים עם קוביות קרח אם רוצים קר יותר"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r68, (VALUES
  ('אבקת חלבון וניל', 1, 'סקופ', 'pantry', false, 0),
  ('בננה', 1, 'יח׳', 'fresh-produce', false, 1),
  ('חלב/משקה שקדים', 200, 'מ״ל', 'weekly-dairy', false, 2),
  ('קינמון', 0.5, 'כפית', 'pantry', false, 3)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- שייק פירות יער ויוגורט
WITH recipe_r69 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'שייק פירות יער ויוגורט', 'ללא בישול', '🥤', 'breakfast', 'approved', 5, 'summer',
    260, 16, 1, 'דיאטטי', 'בריא', 5, 0,
    '{"ללא בישול","מהיר","חלבון"}', NULL, NULL, 'ynet.co.il',
    '{"טוחנים הכל בבלנדר עד למרקם חלק וקצפי"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r69, (VALUES
  ('פירות יער קפואים', 100, 'גר׳', 'fresh-produce', false, 0),
  ('יוגורט יווני 5%', 180, 'גר׳', 'weekly-dairy', false, 1),
  ('מים', 80, 'מ״ל', 'pantry', false, 2)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- שייק אבוקדו ולימון קר
WITH recipe_r70 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'שייק אבוקדו ולימון קר', 'ללא בישול', '🥤', 'breakfast', 'approved', 4, 'summer',
    280, 0, 1, 'דיאטטי', 'בריא', 5, 0,
    '{"ללא בישול","מהיר","קר"}', NULL, NULL, 'liora-houbara.co.il',
    '{"טוחנים הכל בבלנדר עד למרקם קרמי וחלק","מגישים קר מיד"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r70, (VALUES
  ('אבוקדו', 0.5, 'יח׳', 'fresh-produce', false, 0),
  ('לימון', 0.5, 'יח׳', 'fresh-produce', false, 1),
  ('מים קרים', 200, 'מ״ל', 'pantry', false, 2),
  ('מלח', 1, 'קורט', 'pantry', false, 3)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- שייק תפוח, קינמון ושקדים
WITH recipe_r71 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'שייק תפוח, קינמון ושקדים', 'ללא בישול', '🥤', 'breakfast', 'approved', 4, 'winter',
    240, 2, 1, 'דיאטטי', 'בריא', 5, 0,
    '{"ללא בישול","מהיר","לא מתוק"}', NULL, NULL, 'karenann.co.il',
    '{"טוחנים הכל בבלנדר עד למרקם חלק"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r71, (VALUES
  ('תפוח', 1, 'יח׳', 'fresh-produce', false, 0),
  ('שקדים', 15, 'גר׳', 'pantry', false, 1),
  ('קינמון', 0.5, 'כפית', 'pantry', false, 2),
  ('חלב/משקה שקדים', 150, 'מ״ל', 'weekly-dairy', false, 3)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- שייק ירוק עם מלפפון, סלרי ותפוח
WITH recipe_r72 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'שייק ירוק עם מלפפון, סלרי ותפוח', 'ללא בישול', '🥤', 'breakfast', 'approved', 4, 'summer',
    190, 0, 1, 'דיאטטי', 'בריא', 5, 0,
    '{"ללא בישול","מהיר","לא מתוק"}', NULL, NULL, 'zhlilteva.co.il',
    '{"טוחנים הכל בבלנדר עם מעט מים עד למרקם חלק"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r72, (VALUES
  ('מלפפון', 1, 'יח׳', 'fresh-produce', false, 0),
  ('סלרי', 1, 'גבעול', 'fresh-produce', false, 1),
  ('תפוח', 0.5, 'יח׳', 'fresh-produce', false, 2),
  ('לימון', 0.5, 'יח׳', 'fresh-produce', false, 3)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- מרק כרוב, גזר ושעועית ירוקה
WITH recipe_r73 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'מרק כרוב, גזר ושעועית ירוקה', 'מרק', '🍲', 'dinner', 'approved', 4, 'winter',
    62, 0, 2, 'דיאטטי', 'בריא', 10, 30,
    '{"מרק","חם","דל קלוריות"}', NULL, NULL, 'zhlilteva.co.il',
    '{"מטגנים בצל, שום וסלרי (אם יש) בשמן זית עד לריכוך","מוסיפים כרוב וגזר, ממשיכים לטגן כ-10 דקות","מוסיפים מים רותחים, שעועית ירוקה ותבלינים","מבשלים 20 דקות, מגישים עם כוסברה טרייה"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r73, (VALUES
  ('כרוב לבן', 0.25, 'ראש', 'fresh-produce', false, 0),
  ('גזר', 2, 'יח׳', 'fresh-produce', false, 1),
  ('שעועית ירוקה', 150, 'גר׳', 'fresh-produce', false, 2),
  ('בצל', 0.5, 'יח׳', 'fresh-produce', false, 3),
  ('שום', 1, 'שן', 'fresh-produce', false, 4)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- מרק עגבניות צלויות
WITH recipe_r74 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'מרק עגבניות צלויות', 'מרק', '🍅', 'dinner', 'approved', 5, 'all',
    68, 2, 2, 'דיאטטי', 'בריא', 10, 60,
    '{"מרק","דל קלוריות"}', NULL, NULL, 'mako.co.il',
    '{"מניחים עגבניות שלמות על תבנית עם נייר אפייה, מפזרים מלח","אופים 35 דקות ב-200°C עד שמתקלפות","מטגנים קלות בסיר עם שמן זית כדי שיתפרקו","מוסיפים מים ומבשלים 20 דקות","טוחנים חלק במעבד מזון"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r74, (VALUES
  ('עגבניות', 6, 'יח׳', 'fresh-produce', false, 0),
  ('שמן זית', 1, 'כף', 'pantry', false, 1),
  ('מלח', 1, 'כפית', 'pantry', false, 2)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- מרק סלרי וגזר קליל
WITH recipe_r75 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'מרק סלרי וגזר קליל', 'מרק', '🥕', 'dinner', 'approved', 4, 'winter',
    52, 0, 2, 'דיאטטי', 'בריא', 10, 25,
    '{"מרק","חם","דל קלוריות"}', NULL, NULL, 'momflavours.co.il',
    '{"מטגנים בצל בשמן זית עד שקוף","מוסיפים גזר וסלרי חתוכים גס","מוסיפים מים לכיסוי ומבשלים כ-25 דקות עד שהירקות רכים","טוחנים חלק, מגישים עם לימון ופטרוזיליה"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r75, (VALUES
  ('גזר', 3, 'יח׳', 'fresh-produce', false, 0),
  ('סלרי', 2, 'גבעולים', 'fresh-produce', false, 1),
  ('בצל', 0.5, 'יח׳', 'fresh-produce', false, 2),
  ('לימון ופטרוזיליה להגשה', 1, 'מנה', 'fresh-sprouts', false, 3)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- מרק סלק ויוגורט קר
WITH recipe_r76 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'מרק סלק ויוגורט קר', 'מרק', '🍲', 'dinner', 'approved', 4, 'summer',
    97, 7, 2, 'דיאטטי', 'בריא', 10, 0,
    '{"מרק","קר","דל קלוריות"}', NULL, NULL, 'liora-houbara.co.il',
    '{"טוחנים סלק מבושל עם יוגורט ומעט מים בבלנדר עד למרקם חלק","מתבלים במיץ לימון, מלח ופלפל","מצננים במקרר לפחות שעה לפני הגשה"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r76, (VALUES
  ('סלק מבושל', 2, 'יח׳', 'fresh-produce', false, 0),
  ('יוגורט יווני 5%', 150, 'גר׳', 'weekly-dairy', false, 1),
  ('לימון', 0.5, 'יח׳', 'fresh-produce', false, 2)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- מרק דלעת עם תפוז
WITH recipe_r77 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'מרק דלעת עם תפוז', 'מרק', '🎃', 'dinner', 'approved', 4, 'winter',
    63, 0, 2, 'דיאטטי', 'בריא', 10, 25,
    '{"מרק","חם","דל קלוריות"}', NULL, NULL, 'foody.co.il',
    '{"מטגנים בצל בשמן זית עד שקוף","מוסיפים דלעת וגזר חתוכים, מכסים במים ומבשלים 25 דקות","טוחנים חלק ומוסיפים מיץ תפוז","מתבלים במלח ופלפל"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r77, (VALUES
  ('דלעת', 300, 'גר׳', 'fresh-produce', false, 0),
  ('גזר', 1, 'יח׳', 'fresh-produce', false, 1),
  ('בצל', 0.5, 'יח׳', 'fresh-produce', false, 2),
  ('מיץ תפוז סחוט', 3, 'כפות', 'fresh-produce', false, 3)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- סלט טונה עם ירקות שורש צלויים
WITH recipe_r78 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'סלט טונה עם ירקות שורש צלויים', 'דג', '🐟', 'dinner', 'approved', 4, 'all',
    320, 31, 1, 'דיאטטי', 'בריא', 5, 20,
    '{"דג","קליל"}', NULL, NULL, 'שילוב אישי',
    '{"צולים גזר ובטטה חתוכים בתנור 20 דקות (בלי טיגון)","מערבבים עם עלים ירוקים וטונה מסוננת","מתבלים בשמן זית ולימון"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r78, (VALUES
  ('טונה בשמן זית', 120, 'גר׳', 'pantry', false, 0),
  ('גזר ובטטה קלויים', 150, 'גר׳', 'fresh-produce', false, 1),
  ('עלים ירוקים', 50, 'גר׳', 'fresh-sprouts', false, 2)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- קערת ירקות מאודים עם שמן זית ולימון
WITH recipe_r79 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'קערת ירקות מאודים עם שמן זית ולימון', 'צמחוני', '🥦', 'dinner', 'approved', 4, 'all',
    180, 4, 1, 'דיאטטי', 'בריא', 5, 12,
    '{"צמחוני","קליל","דל קלוריות"}', NULL, NULL, 'שילוב אישי',
    '{"מאדים את כל הירקות כ-12 דקות עד רכים אך לא רסוקים","מתבלים בשמן זית, לימון, מלח ופלפל"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r79, (VALUES
  ('ברוקולי, כרובית וגזר', 300, 'גר׳', 'fresh-produce', false, 0),
  ('שמן זית', 1, 'כף', 'pantry', false, 1),
  ('לימון', 0.5, 'יח׳', 'fresh-produce', false, 2)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- ביצה קשה עם מלפפון וגזר חתוכים
WITH recipe_r80 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'ביצה קשה עם מלפפון וגזר חתוכים', 'ביצים', '🥚', 'dinner', 'approved', 4, 'all',
    220, 14, 1, 'דיאטטי', 'בריא', 3, 0,
    '{"ללא בישול","מהיר","קליל","דל קלוריות"}', NULL, NULL, 'שילוב אישי',
    '{"חוצים ביצים קשות","מגישים עם ירקות חתוכים לאצבעות","מזלפים שמן זית ומתבלים במלח ופלפל"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r80, (VALUES
  ('ביצה קשה', 2, 'יח׳', 'pantry', false, 0),
  ('מלפפון וגזר חתוכים', 1, 'מנה', 'fresh-produce', false, 1)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- סלט עוף צלוי קליל עם עלים ירוקים
WITH recipe_r81 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'סלט עוף צלוי קליל עם עלים ירוקים', 'עוף', '🥗', 'dinner', 'approved', 4, 'all',
    340, 37, 1, 'דיאטטי', 'בריא', 5, 12,
    '{"עוף","קליל"}', NULL, NULL, 'שילוב אישי',
    '{"צולים את חזה העוף במחבת פסים (בלי שמן עודף, בלי טיגון) כ-6 דקות לכל צד","פורסים ומניחים על מצע עלים ירוקים ועגבניות שרי","מתבלים בשמן זית ולימון"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r81, (VALUES
  ('חזה עוף', 120, 'גר׳', 'freezer-meat', true, 0),
  ('עלים ירוקים', 80, 'גר׳', 'fresh-sprouts', false, 1),
  ('עגבניות שרי', 100, 'גר׳', 'fresh-produce', false, 2)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- מחית קישואים חמה עם שמיר
WITH recipe_r82 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'מחית קישואים חמה עם שמיר', 'צמחוני', '🥣', 'dinner', 'approved', 4, 'winter',
    150, 0, 1, 'דיאטטי', 'בריא', 8, 15,
    '{"צמחוני","חם","דל קלוריות"}', NULL, NULL, 'שילוב אישי',
    '{"מטגנים בצל בשמן זית עד שקוף","מוסיפים קישואים פרוסים ומעט מים, מבשלים 15 דקות עד רכים","טוחנים חלק, מוסיפים שמיר קצוץ"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r82, (VALUES
  ('קישואים', 3, 'יח׳', 'fresh-produce', false, 0),
  ('בצל', 0.5, 'יח׳', 'fresh-produce', false, 1),
  ('שמיר', 1, 'חופן', 'fresh-sprouts', false, 2)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- סלט אבוקדו, מלפפון ועגבנייה עם ביצה
WITH recipe_r83 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'סלט אבוקדו, מלפפון ועגבנייה עם ביצה', 'ללא בישול', '🥑', 'dinner', 'approved', 4, 'summer',
    290, 7, 1, 'דיאטטי', 'בריא', 5, 0,
    '{"ללא בישול","מהיר","קליל"}', NULL, NULL, 'שילוב אישי',
    '{"חותכים אבוקדו, מלפפון ועגבנייה לקוביות","מוסיפים ביצה קשה חצויה","מתבלים בשמן זית, מלח ופלפל"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r83, (VALUES
  ('אבוקדו', 0.5, 'יח׳', 'fresh-produce', false, 0),
  ('מלפפון ועגבנייה', 1, 'מנה', 'fresh-produce', false, 1),
  ('ביצה קשה', 1, 'יח׳', 'pantry', false, 2)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- סלט הודו צלוי עם ירקות קלויים
WITH recipe_r84 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'סלט הודו צלוי עם ירקות קלויים', 'הודו', '🦃', 'dinner', 'approved', 4, 'all',
    330, 35, 1, 'דיאטטי', 'בריא', 10, 15,
    '{"הודו","קליל"}', NULL, NULL, 'שילוב אישי',
    '{"צולים חזה הודו בתנור/מחבת פסים ללא שמן עודף כ-15 דקות","צולים ירקות בתנור במקביל","מערבבים הכל עם עלים ירוקים ומתבלים בשמן זית ולימון"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r84, (VALUES
  ('חזה הודו', 120, 'גר׳', 'freezer-meat', true, 0),
  ('קישוא ופלפל צלויים', 150, 'גר׳', 'fresh-produce', false, 1),
  ('עלים ירוקים', 50, 'גר׳', 'fresh-sprouts', false, 2)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- מרק כרובית קרמי ללא שמנת
WITH recipe_r85 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'מרק כרובית קרמי ללא שמנת', 'מרק', '🍲', 'dinner', 'approved', 4, 'winter',
    50, 0, 2, 'דיאטטי', 'בריא', 8, 20,
    '{"מרק","חם","דל קלוריות"}', NULL, NULL, 'שילוב אישי',
    '{"מטגנים בצל ושום בשמן זית עד שקוף","מוסיפים כרובית לפרחים ומים לכיסוי","מבשלים 20 דקות עד רכה","טוחנים חלק עד קרמי — המרקם הקרמי מגיע מהכרובית עצמה, בלי שמנת"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r85, (VALUES
  ('כרובית', 1, 'ראש', 'fresh-produce', false, 0),
  ('בצל', 0.5, 'יח׳', 'fresh-produce', false, 1),
  ('שום', 1, 'שן', 'fresh-produce', false, 2)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- דג וירקות על המחבת עם סילאן
WITH recipe_r86 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'דג וירקות על המחבת עם סילאן', 'דג', '🐟', 'lunch', 'approved', 5, 'all',
    440, 44, 1, 'דיאטטי', 'בריא', 10, 20,
    '{"דג","מהיר"}', NULL, NULL, 'המתכון שלי',
    '{"פורסים בצל דק ומטגנים במחבת עם מעט שמן זית עד להזהבה קלה","מוסיפים שעועית וברוקולי קפואים ישירות למחבת, מבשלים כ-8 דקות עד שמופשרים ומתרככים","מוסיפים עגבניות קצוצות, ממשיכים לבשל 3-4 דקות","מפנים מקום ומניחים את פילה הדג במחבת, מבשלים כ-4-5 דקות לכל צד","לקראת הסוף מזלפים סילאן מעל הדג לרוטב מתקתק עדין"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r86, (VALUES
  ('פילה דניס/לברק/סלמון', 220, 'גר׳', 'fresh-fish', false, 0),
  ('בצל', 1, 'יח׳', 'fresh-produce', false, 1),
  ('שעועית קפואה', 150, 'גר׳', 'pantry', false, 2),
  ('ברוקולי קפוא', 150, 'גר׳', 'pantry', false, 3),
  ('עגבניות', 2, 'יח׳', 'fresh-produce', false, 4),
  ('סילאן', 1, 'כף', 'pantry', false, 5)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- סלט חסות ופירות עם רוטב תפוז-חרדל
WITH recipe_r87 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'סלט חסות ופירות עם רוטב תפוז-חרדל', 'סלט', '🥗', 'lunch', 'approved', 5, 'summer',
    280, 5, 1, 'דיאטטי', 'בריא', 12, 0,
    '{"סלט","ללא בישול","קליל"}', NULL, NULL, 'המתכון שלי',
    '{"קורעים/חותכים את עלי החסה לגודל נוח, מניחים בקערה","מוסיפים בצל סגול פרוס דק ופרי פרוס דק","מפזרים פקאן קלוי קלות (או גולמי)","מערבבים בקערית קטנה מיץ תפוז, חרדל, דבש ושמן זית לרוטב","יוצקים את הרוטב מעל הסלט ומערבבים בעדינות רגע לפני ההגשה"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r87, (VALUES
  ('מבחר עלי חסה', 100, 'גר׳', 'fresh-sprouts', false, 0),
  ('בצל סגול', 0.25, 'יח׳', 'fresh-produce', false, 1),
  ('נקטרינה/מנגו פרוסים דק', 1, 'יח׳', 'fresh-produce', false, 2),
  ('פקאן', 10, 'גר׳', 'pantry', false, 3),
  ('מיץ תפוז סחוט', 2, 'כפות', 'fresh-produce', false, 4),
  ('חרדל דיז׳ון', 1, 'כפית', 'pantry', false, 5),
  ('דבש', 1, 'כפית', 'pantry', false, 6),
  ('שמן זית', 1, 'כף', 'pantry', false, 7)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- צלי בקר עם אגסים ושורש פטרוזיליה
WITH recipe_r88 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'צלי בקר עם אגסים ושורש פטרוזיליה', 'בשר', '🍐', 'lunch', 'pending', 0, 'winter',
    335, 33, 2, 'דיאטטי', 'בריא', 20, 100,
    '{"בשר","חם"}', NULL, NULL, 'hashulchan.co.il',
    '{"מפלפלים את נתחי הבשר וסוגרים אותם בסיר כבד כ-5 דקות מכל צד עד שמשחימים היטב","מוציאים את הבשר לצלחת בצד","מטגנים באותו סיר בצלי פנינה, שום וקליפת לימון עם תימין כ-5 דקות","מוסיפים יין לבן ומגרדים בעדינות את המשקעים מתחתית הסיר","נותנים ליין להצטמצם כ-5 דקות","מחזירים את הבשר ומיצי הבשר לסיר","מוסיפים אגסים, שורש פטרוזיליה, עלה דפנה ומים לכיסוי חלקי","מביאים לרתיחה ואז מנמיכים ומבשלים על אש נמוכה כשעה וחצי עד שהבשר רך ומתפורר בקלות"}', false, false
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, qty, unit, freshness, pre_marinate, sort_order)
SELECT id, name, qty, unit, freshness, pre_marinate, sort_order FROM recipe_r88, (VALUES
  ('בקר לצלי (כתף/שייטל/אווזית)', 250, 'גר׳', 'freezer-meat', true, 0),
  ('בצלי פנינה', 6, 'יח׳', 'fresh-produce', false, 1),
  ('שום', 3, 'שיני', 'fresh-produce', false, 2),
  ('אגסים', 2, 'יח׳', 'fresh-produce', false, 3),
  ('שורש פטרוזיליה', 1, 'יח׳', 'fresh-produce', false, 4),
  ('יין לבן יבש', 0.25, 'כוס', 'pantry', false, 5),
  ('עלה דפנה ותימין', 1, 'מנה', 'pantry', false, 6)
) AS ingdata(name, qty, unit, freshness, pre_marinate, sort_order);

-- הזמנה מבחוץ — סלט, דג או המבורגר
WITH recipe_r20 AS (
  INSERT INTO recipes (name, category, icon, meal_slot, status, rating, season, cal, protein_g, servings, diet_tag, health_tag, prep_min, cook_min, tags, only_day, only_days, source, steps, liked, disliked)
  VALUES (
    'הזמנה מבחוץ — סלט, דג או המבורגר', 'הזמנה', '🛵', 'dinner', 'approved', 5, 'all',
    550, 28, 1, 'לא-דיאטטי', 'פחות-בריא', 0, 0,
    '{"הזמנה"}', NULL, NULL, 'Wolt / סיבוס',
    '{"בחרי קטגוריה מתאימה ליעד הקלורי והגיוון של השבוע (סלט, דג, או המבורגר)"}', true, false
  )
  RETURNING id
)
SELECT 1;

