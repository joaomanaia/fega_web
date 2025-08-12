import { env } from "@/env"
import type { Database } from "@/types/database.types"
import { createBrowserClient } from "@supabase/ssr"

export const createClient = () =>
  createBrowserClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
