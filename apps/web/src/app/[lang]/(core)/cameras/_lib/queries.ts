import "server-only"
import { cache } from "react"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import type { Tables } from "@/types/database.types"

type CameraType = Tables<"cameras">

export const getAllCameras = cache(async (): Promise<CameraType[]> => {
  const supabase = await createAdminClient()

  const { data, error } = await supabase.from("cameras").select("*")

  if (error) {
    throw new Error(`Failed to fetch cameras: ${error.message}`)
  }

  return data ?? []
})

export const getCameraById = cache(async (id: string): Promise<CameraType | null> => {
  const supabase = await createClient()

  const { data, error } = await supabase.from("cameras").select("*").eq("id", id).single()

  if (error) return null
  return data
})
