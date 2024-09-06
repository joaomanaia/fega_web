"use client"

import { uuidSchema } from "@/lib/schemas/primitive-schemas"
import type { Database } from "@/types/database.types"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useQuery } from "@tanstack/react-query"

export const useGetUser = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const supabase = createClientComponentClient<Database>()

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
