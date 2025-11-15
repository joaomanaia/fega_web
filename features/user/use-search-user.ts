"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"

const MAX_RESULTS = 10
const MAX_SEARCH_LEN = 64
const MIN_SEARCH_LEN = 2

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
 * Search for a user by username or full name.
 *
 * @param rawSearch - The raw search input
 * @returns Query result with user data
 */
export const useSearchUser = (rawSearch: string) => {
  const term = sanitizeSearch(rawSearch)

  return useQuery({
    queryKey: ["search-users", term] as const,
    enabled: term !== "",
    placeholderData: keepPreviousData,
    staleTime: 15_000, // 15 seconds
    gcTime: 60_000, // 60 seconds
    retry: 1,
    refetchOnWindowFocus: false,
    queryFn: async ({ signal }) => {
      const supabase = createClient()

      const { data } = await supabase
        .rpc("search_users", {
          search_query: term,
          limit_count: MAX_RESULTS,
          offset_count: 0,
        })
        .abortSignal(signal)
        .throwOnError()

      return data ?? []
    },
  })
}
