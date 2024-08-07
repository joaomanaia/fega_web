"use client"

import type { Database } from "@/types/database.types"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useQuery } from "@tanstack/react-query"

export const useGetUser = (uid: string) => {
  return useQuery({
    queryKey: ["user", uid],
    queryFn: async () => {
      const supabase = createClientComponentClient<Database>()

      const { data, error } = await supabase.from("users").select("*").eq("id", uid).single()

      if (error) {
        throw new Error("Failed to get user")
      }

      return data
    },
  })
}
