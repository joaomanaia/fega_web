import { uuidSchema, type UuidType } from "@/lib/schemas/primitive-schemas"
import { createClient } from "@/lib/supabase/server"
import type UserType from "@/types/UserType"
import { type Session, type User } from "@supabase/supabase-js"
import { cache } from "react"

export const getPairUid = (uid1: string, uid2: string): string => {
  return uid1 < uid2 ? uid1 + uid2 : uid2 + uid1
}

export const getPairUids = (uids: string[]): string => {
  return uids.sort().join("")
}

export const getLocalUser = async (): Promise<User | null> => {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return session?.user ?? null
}

export const getLocalUserUid = async (): Promise<string | null> => {
  const user = await getLocalUser()

  return user?.id ?? null
}

export const isUserAuthenticated = async (): Promise<boolean> => {
  const user = await getLocalUser()

  return user !== null
}

export const getSession = async (): Promise<Session | null> => {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.log("Error getting session:", error.message)
    return null
  }

  return data.session ?? null
}

export const getUserByUid = cache(async (uid: UuidType): Promise<UserType | null> => {
  // Validate the uid
  const result = uuidSchema.safeParse(uid)
  if (!result.success) {
    return null
  }

  const supabase = await createClient()

  const { data, error } = await supabase.from("users").select("*").eq("id", uid).single()

  if (error) {
    console.log(error)
    return null
  }

  return data
})

export const getUserByUsername = cache(async (username: string): Promise<UserType | null> => {
  const supabase = await createClient()

  const { data, error } = await supabase.from("users").select("*").eq("username", username).single()

  if (error) {
    console.log(error)
    return null
  }

  return data
})
