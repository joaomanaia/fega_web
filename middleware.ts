import { NextResponse } from "next/server"
import Negotiator from "negotiator"
import { match as matchLocale } from "@formatjs/intl-localematcher"
import type { NextRequest } from "next/server"
import { type Locale, i18n } from "./i18n-config"
import { cookies } from "next/headers"
import { updateSession } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  const response = await handleI18nRouting(request)
  return await updateSession(request, response)
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

function isPathnameMissingLocale(path: string): boolean {
  return i18n.locales.every((locale) => !path.startsWith(`/${locale}/`) && path !== `/${locale}`)
}

async function handleI18nRouting(request: NextRequest) {
  const fullPathname = request.nextUrl.pathname

  if (isPathnameMissingLocale(fullPathname) && !fullPathname.startsWith("/auth/callback")) {
    return await handleMissingLocale(request, fullPathname)
  }

  return NextResponse.next({ request })
}

async function handleMissingLocale(req: NextRequest, fullPathname: string) {
  const locale = await getLocale(req)
  const urlParams = getUrlParams(req)

  const newUrl = new URL(
    `/${locale}${fullPathname.startsWith("/") ? "" : "/"}${fullPathname}${urlParams}`,
    req.url
  )

  if (locale === i18n.defaultLocale) {
    return NextResponse.rewrite(newUrl, { request: req })
  }
  return NextResponse.redirect(newUrl)
}

function getUrlParams(req: NextRequest): string {
  const { search } = req.nextUrl
  const urlSearchParams = new URLSearchParams(search)
  const params = Object.fromEntries(urlSearchParams.entries())
  return "?" + new URLSearchParams(params)
}

async function getLocale(request: NextRequest): Promise<Locale | undefined> {
  // Check if locale is stored in cookie, if so use it
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get("NEXT_LOCALE")
  if (cookieLocale) return cookieLocale.value as Locale

  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  // @ts-ignore locales are readonly
  const locales: Locale[] = i18n.locales

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales)

  return matchLocale(languages, locales, i18n.defaultLocale) as Locale
}
