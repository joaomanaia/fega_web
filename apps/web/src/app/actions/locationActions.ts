"use server"

import { createClient } from "@/lib/supabase/server"

export const createLocation = async (locationName: string, address: string, point: string) => {
  const supabase = await createClient()

  const { error } = await supabase.from("locations").insert({
    name: locationName,
    address: address,
    point: point,
  })

  if (error) {
    throw new Error("Failed to create location")
  }
}
