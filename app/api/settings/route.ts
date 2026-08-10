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

// GET /api/settings — fetch the current user's settings (creates defaults on first call)
export async function GET() {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  let { data, error } = await supabase.from('user_settings').select('*').eq('user_id', user.id).single();

  if (error && error.code === 'PGRST116') {
    // No row yet — create defaults (matches the column defaults in schema.sql)
    const { data: created, error: createError } = await supabase
      .from('user_settings')
      .insert({ user_id: user.id })
      .select()
      .single();
    if (createError) return NextResponse.json({ error: createError.message }, { status: 500 });
    data = created;
  } else if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// PATCH /api/settings — update one or more settings fields
export async function PATCH(req: NextRequest) {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const body = await req.json();
  const { data, error } = await supabase
    .from('user_settings')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
