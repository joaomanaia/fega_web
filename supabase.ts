import { 
  createServerComponentClient as _createServerComponentClient,
  createServerActionClient as _createServerActionClient,
  createRouteHandlerClient as _createRouteHandlerClient
} from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { cache } from "react"
import { Database } from "./types/database.types"

export const createServerComponentClient = cache(() => {
  const cookieStore = cookies()
  return _createServerComponentClient<Database>({ cookies: () => cookieStore })
})

export const createServerActionClient = cache(() => {
  const cookieStore = cookies()
  return _createServerActionClient<Database>({ cookies: () => cookieStore })
})

export const createRouteHandlerClient = cache(() => {
  const cookieStore = cookies()
  return _createRouteHandlerClient<Database>({ cookies: () => cookieStore })
})

