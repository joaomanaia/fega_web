import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import type { Route } from "next"
import { env } from "@/env"

const PROTECTED_ROUTES: Route[] = ["/groups", "/news/create", "/events/create"]

/* const createRouteMatcher = (routes: readonly string[]) => {
  // Escape special regex characters and add optional trailing slash
  const escapedRoutes = routes.map((route) => route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "/?")
  return new RegExp(`^(${escapedRoutes.join("|")})$`)
}

const rotectedRouteMatcher = createRouteMatcher(PROTECTED_ROUTES) */

export const updateSession = async (request: NextRequest, response: NextResponse) => {
  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This will refresh session if expired - required for Server Components
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  /* const isProtectedRoute = rotectedRouteMatcher.test(removeLocaleFromPath(request.nextUrl.pathname)) */

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    removeLocaleFromPath(request.nextUrl.pathname).startsWith(route)
  )
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  return response
}

function removeLocaleFromPath(path: string): string {
  const localePattern = /^\/[a-z]{2}(-[A-Z]{2})?\//
  return path.replace(localePattern, "/")
}
