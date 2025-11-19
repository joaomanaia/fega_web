"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"

const MAX_RESULTS = 10
const MAX_SEARCH_LEN = 64
const MIN_SEARCH_LEN = 2

export type SearchUserResult = {
  id: string
  username: string
  full_name: string
  avatar_url: string
  relevance_score: number
}

function sanitizeSearch(input: string): string {
  const normalized = (input ?? "").trim().replace(/\s+/g, " ").normalize("NFC")

  if (!normalized) {
    return ""
  }

  // Remove @ prefix if present
  const withoutAt = normalized.startsWith("@") ? normalized.slice(1) : normalized

  // Allow letters, numbers, spaces, and common punctuation
  const sanitized = withoutAt.replace(/[^ \p{L}\p{N}_''.-]/gu, "").slice(0, MAX_SEARCH_LEN)

  return sanitized.length >= MIN_SEARCH_LEN ? sanitized : ""
}

/**
 * Search for users by username or full name, excluding users already in a specific group.
 *
 * @param rawSearch - The raw search input
 * @param groupId - The group ID to exclude members from
 * @returns Query result with user data
 */
export const useSearchUserExcludeGroup = (rawSearch: string, groupId: string) => {
  const term = sanitizeSearch(rawSearch)

  return useQuery({
    queryKey: ["search-users-exclude-group", term, groupId] as const,
    enabled: term !== "" && !!groupId,
    placeholderData: keepPreviousData,
    staleTime: 15_000, // 15 seconds
    gcTime: 60_000, // 60 seconds
    retry: 1,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const supabase = createClient()

      // @ts-expect-error - Function exists in database but types not yet regenerated
      const { data, error } = await supabase.rpc("search_users_exclude_group", {
        search_query: term,
        group_id_param: groupId,
        limit_count: MAX_RESULTS,
        offset_count: 0,
      })

      if (error) {
        throw error
      }

      return (data ?? []) as SearchUserResult[]
    },
  })
}
