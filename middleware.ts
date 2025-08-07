import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make your server
  // vulnerable to CSRF attacks.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  interface RouteRule {
    pattern: RegExp
    requireAuth?: boolean
    roles?: Array<'site_admin' | 'firm_admin' | 'user'>
  }

  const routeRules: RouteRule[] = [
    { pattern: /^\/(?:forms)(?:\/.*)?$/, requireAuth: true },
    { pattern: /^\/profile(?:\/.*)?$/, requireAuth: true },
    { pattern: /^\/setup-admin(?:\/.*)?$/, requireAuth: true },
    // Role-protected routes
    { pattern: /^\/firms\/[^/]+\/admin(?:\/.*)?$/, roles: ['site_admin', 'firm_admin'] },
    { pattern: /^\/firm-admin(?:\/.*)?$/, roles: ['site_admin', 'firm_admin'] },
    { pattern: /^\/admin(?:\/.*)?$/, roles: ['site_admin'] },
    { pattern: /^\/firms(?:\/.*)?$/, requireAuth: true },
  ]

  const path = request.nextUrl.pathname
  const matchedRule = routeRules.find(rule => rule.pattern.test(path))

  if (matchedRule) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    if (matchedRule.roles) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      if (!profile || !matchedRule.roles.includes(profile.role)) {
        return new NextResponse('Forbidden', { status: 403 })
      }
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're trying to modify the response, do it above.
  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)',
  ],
}