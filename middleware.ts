import type { NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"
import { routing } from "@/src/i18n/routing"
import createMiddleware from "next-intl/middleware"

const handleI18nRouting = createMiddleware(routing)

export async function middleware(request: NextRequest) {
  const response = handleI18nRouting(request)
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
