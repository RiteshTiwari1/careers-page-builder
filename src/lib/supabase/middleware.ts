import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes - /[slug]/edit and /[slug]/preview
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = pathname.includes('/edit') || pathname.includes('/preview');

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If logged in and trying to access login, redirect to dashboard
  if (pathname === '/login' && user) {
    // Get user's company slug
    const { data: userData } = await supabase
      .from('users')
      .select('company_id, companies(slug)')
      .eq('id', user.id)
      .single();

    if (userData?.companies) {
      const url = request.nextUrl.clone();
      const companyData = userData.companies as unknown as { slug: string };
      url.pathname = `/${companyData.slug}/edit`;
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
