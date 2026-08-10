import { NextResponse, type NextRequest } from 'next/server';

// This middleware intentionally does NOT import @supabase/ssr or @supabase/supabase-js.
// Those libraries pull in Node.js-only APIs (via @supabase/realtime-js) that crash with
// "ReferenceError: __dirname is not defined" when run in Vercel's Edge Runtime, which is
// where Next.js middleware executes by default. Instead, we do a lightweight check for the
// presence of Supabase's own auth cookie — real, secure session validation still happens
// per-request in each page/API route via supabase.auth.getUser() (see lib/supabase.ts and
// the createServerClient calls in app/api/**/route.ts), which run in the full Node.js
// runtime where @supabase/ssr works correctly. This middleware only decides whether to
// redirect to /login for a better UX; it is not the security boundary by itself.
function hasSupabaseSessionCookie(request: NextRequest): boolean {
  return request.cookies.getAll().some((c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'));
}

export function middleware(request: NextRequest) {
  const isLoggedIn = hasSupabaseSessionCookie(request);

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/auth');
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/cron'); // cron is protected by its own secret header

  if (!isLoggedIn && !isAuthRoute && !isApiRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (isLoggedIn && isAuthRoute && !request.nextUrl.pathname.startsWith('/auth/callback')) {
    const url = request.nextUrl.clone();
    url.pathname = '/now';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js).*)'],
};
