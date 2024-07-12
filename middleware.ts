import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import Negotiator from "negotiator"
import { match as matchLocale } from "@formatjs/intl-localematcher"
import type { NextRequest } from "next/server"
import { type Locale, i18n } from "./i18n-config"
import { cookies } from "next/headers"

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

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale, except for the auth callback
  if (pathnameIsMissingLocale && !pathname.startsWith("/auth/callback")) {
    const locale = getLocale(req)

    const {
      nextUrl: { search },
    } = req
    const urlSearchParams = new URLSearchParams(search)
    const params = Object.fromEntries(urlSearchParams.entries())

    const urlParams = "?" + new URLSearchParams(params)

    if (locale === i18n.defaultLocale) {
      return NextResponse.rewrite(
        new URL(`/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}${urlParams}`, req.url)
      )
    }

    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}${urlParams}`, req.url)
    )
  }

  const res = NextResponse.next()

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession()

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
     */
    "/((?!share|api|_next/static|_next/image|favicon.ico).*)",
  ],
}
