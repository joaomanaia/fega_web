"use client"

import { uuidSchema } from "@/lib/schemas/primitive-schemas"
import { createClient } from "@/lib/supabase/client"
import { useQuery } from "@tanstack/react-query"

/**
 * Get a user by their ID or username
 *
 * @param id - The user's ID or username
 */
export const useGetUser = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    retry: 1,
    queryFn: async () => {
      const supabase = createClient()

      let query = supabase.from("users").select("*")

      // Check if the input is a UUID or a username
      if (uuidSchema.safeParse(id).success) {
        query = query.eq("id", id)
      } else {
        query = query.eq("username", id)
      }

      const { data, error } = await query.single()

      if (error) {
        throw new Error("Failed to get user")
      }

      return data
    },
  })
}
