import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import Negotiator from "negotiator"
import { match as matchLocale } from "@formatjs/intl-localematcher"
import type { NextRequest } from "next/server"
import { type Locale, i18n } from "./i18n-config"
import { cookies } from "next/headers"
import { type Route } from "next"

// Define the routes that require authentication
const protectedRoutes: Route[] = ["/groups"]

export async function middleware(req: NextRequest) {
  const fullPathname = req.nextUrl.pathname
  const pathnameWithoutLocale = removeLocaleFromPath(fullPathname)
  const isProtectedRoute = checkIfProtectedRoute(pathnameWithoutLocale)

  // Check if there is any supported locale in the pathname
  // Redirect if there is no locale, except for the auth callback
  if (isPathnameMissingLocale(fullPathname) && !fullPathname.startsWith("/auth/callback")) {
    return handleMissingLocale(req, fullPathname)
  }

  const res = NextResponse.next()

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) {
    return NextResponse.error()
  }

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/auth", req.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - share (publicly shared chats)
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     * - sitemap.xml (sitemap file)
     * - manifest.json (PWA manifest file)
     * - And all other static files (html, css, js, images, fonts, etc.)
     */
    "/((?!share|api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
}

function removeLocaleFromPath(path: string): string {
  return path.replace(/\/[a-z]{2}(-[A-Z]{2})?/, "")
}

function checkIfProtectedRoute(path: string): boolean {
  return protectedRoutes.some((route) => path.startsWith(route))
}

function isPathnameMissingLocale(path: string): boolean {
  return i18n.locales.every((locale) => !path.startsWith(`/${locale}/`) && path !== `/${locale}`)
}

function handleMissingLocale(req: NextRequest, fullPathname: string) {
  const locale = getLocale(req)
  const urlParams = getUrlParams(req)

  const newUrl = new URL(
    `/${locale}${fullPathname.startsWith("/") ? "" : "/"}${fullPathname}${urlParams}`,
    req.url
  )

  if (locale === i18n.defaultLocale) {
    return NextResponse.rewrite(newUrl)
  }

  return NextResponse.redirect(newUrl)
}

function getUrlParams(req: NextRequest): string {
  const { search } = req.nextUrl
  const urlSearchParams = new URLSearchParams(search)
  const params = Object.fromEntries(urlSearchParams.entries())
  return "?" + new URLSearchParams(params)
}

function getLocale(req: NextRequest): Locale | undefined {
  // Check if locale is stored in cookie, if so use it
  const cookieStore = cookies()
  const cookieLocale = cookieStore.get("NEXT_LOCALE")
  if (cookieLocale) return cookieLocale.value as Locale

  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {}
  req.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales

  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales)

  const locale = matchLocale(languages, locales, i18n.defaultLocale)

  return locale as Locale
}
