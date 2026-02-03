import "server-only"
import { cache } from "react"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { env } from "@/env"
import type { Database } from "@/types/database.types"

export const createClient = cache(async () => {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            console.error("Failed to set cookies", error)
          }
        },
      },
    }
  )
})
