import { createServerComponentClient } from "@/supabase"
import { Session, User } from "@supabase/supabase-js"

export const getPairUid = (uid1: string, uid2: string): string => {
  return uid1 < uid2 ? uid1 + uid2 : uid2 + uid1
}

export const getPairUids = (uids: string[]): string => {
  return uids.sort().join("")
}

export const getLocalUser = async (): Promise<User | null> => {
  const supabase = createServerComponentClient()

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
  const supabase = createServerComponentClient()

  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.log("Error getting session:", error.message)
    return null
  }

  return data.session ?? null
}
