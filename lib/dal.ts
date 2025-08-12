import "server-only"
import { cache } from "react"
import { getLocale } from "next-intl/server"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "@/src/i18n/navigation"
import type { Enums } from "@/types/database.types"

// Data Access Layer (DAL) for user-related operations

/**
 * Fetches the current user session.
 */
export const getSession = cache(async () => {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()

  if (error) {
    console.error("Error getting session:", error.message)
    return null
  }

  const user = data?.claims

  if (!user) {
    return null
  }

  return {
    user: user,
    uid: user.sub,
  }
})

/**
 * Verifies the user session and redirects if not authenticated.
 */
export const verifySession = cache(async () => {
  const session = await getSession()

  if (!session) {
    console.log("User is not authenticated, redirecting to login")
    return redirect({ href: "/auth/login", locale: await getLocale() })
  }

  return { authenticated: true, user: session.user, uid: session.uid }
})

type UserRole = Enums<"app_role">

export const verifyUserRole = cache(async (requiredRole: UserRole) => {
  const session = await verifySession()

  if (!session?.user) {
    console.log("User is not authenticated, redirecting to login")
    return redirect({ href: "/auth/login", locale: await getLocale() })
  }

  if (session.user.user_role !== requiredRole) {
    console.warn(
      `Access denied: user role "${session.user.user_role}" does not match required role "${requiredRole}"`
    )
    return redirect({ href: "/", locale: await getLocale() })
  }

  return { authorized: true, user: session.user, uid: session.uid }
})
