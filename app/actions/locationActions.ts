"use server"

import { createServerActionClient } from "@/supabase"

export const createLocation = async (locationName: string, address: string, point: string) => {
  const supabase = createServerActionClient()

  const { error } = await supabase.from("locations").insert({
    name: locationName,
    address: address,
    point: point,
  })

  if (error) {
    throw new Error("Failed to create location")
  }
}
