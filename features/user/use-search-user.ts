"use client"

import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/types/database.types"
import { SupabaseClient } from "@supabase/supabase-js"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

/**
 * Search for a user by username
 *
 * @param search - The search query
 * @returns The user data
 */
export const useSearchUser = (search: string) => {
  return useQuery({
    queryKey: ["search", search],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      if (!search || search == "@") return []

      const supabase = createClient()

      const { data, error } = await getSearchQuery(supabase, search).limit(10)

      if (error) {
        throw new Error("Failed to search for user")
      }

      return data
    },
  })
}

const getSearchQuery = (supabase: SupabaseClient<Database>, search: string) => {
  if (search.startsWith("@")) {
    return supabase.rpc("search_users_by_username", {
      search: search.slice(1),
    })
  } else {
    return supabase.rpc("search_users_by_fullname", {
      search,
    })
  }
}
