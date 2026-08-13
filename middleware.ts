// This middleware intentionally avoids NextRequest/NextResponse from 'next/server'.
// Importing those types can cause Next.js to bundle its own internal user-agent.js module
// (which wraps the ua-parser-js library) into the Edge middleware bundle — a long-standing,
// still-unresolved Next.js bug where that bundled code throws
// "ReferenceError: __dirname is not defined" at runtime in Vercel's Edge Runtime, even when
// the app's own code never touches user-agent parsing or __dirname. See:
// https://github.com/vercel/next.js/issues/53968 and 58140. Using only the plain Web APIs
// (Request/Response/URL, all natively available in Edge Runtime) avoids the problematic
// import path entirely.
//
// Real, secure session validation still happens per-request in each page/API route via
// supabase.auth.getUser() (see lib/supabase.ts and the createServerClient calls in
// app/api/**/route.ts), which run in the full Node.js runtime. This middleware only decides
// whether to redirect to /login for a better UX; it is not the security boundary by itself.
function hasSupabaseSessionCookie(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false;
  return cookieHeader
    .split(';')
    .map((c) => c.trim().split('=')[0])
    .some((name) => name.startsWith('sb-') && name.endsWith('-auth-token'));
}

export function middleware(request: Request) {
  const url = new URL(request.url);
  const isLoggedIn = hasSupabaseSessionCookie(request.headers.get('cookie'));

  const isAuthRoute = url.pathname.startsWith('/login') || url.pathname.startsWith('/auth');
  const isApiRoute = url.pathname.startsWith('/api/cron'); // cron is protected by its own secret header

  if (!isLoggedIn && !isAuthRoute && !isApiRoute) {
    const redirectUrl = new URL(url);
    redirectUrl.pathname = '/login';
    return Response.redirect(redirectUrl, 307);
  }

  if (isLoggedIn && isAuthRoute && !url.pathname.startsWith('/auth/callback')) {
    const redirectUrl = new URL(url);
    redirectUrl.pathname = '/now';
    return Response.redirect(redirectUrl, 307);
  }

  return undefined; // no redirect — continue to the requested route
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js).*)'],
};
