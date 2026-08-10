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

// PATCH /api/recipes/[id] — update fields like status, liked, disliked, rating
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getSupabase();
  const body = await req.json();
  const { data, error } = await supabase.from('recipes').update(body).eq('id', params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE /api/recipes/[id] — used to reject a pending suggestion
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getSupabase();
  const { error } = await supabase.from('recipes').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
