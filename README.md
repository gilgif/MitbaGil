# מטבגיל

אפליקציית תכנון תפריט, קניות ולו״ז אישי — Next.js + Supabase, פרוסה כ-PWA.

## מבנה הפרויקט

- `app/` — עמודי Next.js (App Router): `/now`, `/schedule`, `/menu`, `/settings`
- `app/api/` — API routes (מתכונים, תפריט, קניות, הגדרות, תזכורות)
- `lib/` — לוגיקה משותפת: יצירת תפריט, ריכוז קניות, טיפוסי TypeScript
- `components/` — רכיבי React משותפים
- `supabase/schema.sql` — מבנה מסד הנתונים המלא
- `supabase/seed.sql` — 85 המתכונים הראשוניים
- `DEPLOY.md` — מדריך העלאה מלא, צעד-אחר-צעד

## פיתוח מקומי (אופציונלי — לא נדרש להעלאה)

```bash
npm install
cp .env.example .env.local   # למלא עם ערכי Supabase האמיתיים
npm run dev
```

האפליקציה תעלה על http://localhost:3000

## העלאה לפרודקשן

ראי `DEPLOY.md` — מדריך מלא בעברית, מתאים למי שלא מתכנתת.
