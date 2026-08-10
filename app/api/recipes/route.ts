import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

function getSupabase() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

// GET /api/recipes — list all recipes with their ingredients
// GET /api/recipes?status=approved — filter by approval status
// GET /api/recipes?mealSlot=breakfast — filter by meal slot
export async function GET(req: NextRequest) {
  const supabase = getSupabase();
  const status = req.nextUrl.searchParams.get('status');
  const mealSlot = req.nextUrl.searchParams.get('mealSlot');

  let query = supabase.from('recipes').select('*, ingredients:recipe_ingredients(*)').order('created_at');
  if (status) query = query.eq('status', status);
  if (mealSlot) query = query.eq('meal_slot', mealSlot);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/recipes — create a new recipe (used by the "add my recipe" flow)
export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const body = await req.json();
  const { ingredients, ...recipeFields } = body;

  const { data: recipe, error } = await supabase.from('recipes').insert(recipeFields).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (ingredients && ingredients.length) {
    const rows = ingredients.map((ing: any, idx: number) => ({ ...ing, recipe_id: recipe.id, sort_order: idx }));
    const { error: ingError } = await supabase.from('recipe_ingredients').insert(rows);
    if (ingError) return NextResponse.json({ error: ingError.message }, { status: 500 });
  }

  return NextResponse.json(recipe);
}
