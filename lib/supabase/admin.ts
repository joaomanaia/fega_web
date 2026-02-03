import "server-only"
import { cache } from "react"
import { createClient } from "@supabase/supabase-js"
import { env } from "@/env"
import type { Database } from "@/types/database.types"

export const createAdminClient = cache(async () => {
  return createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
})
