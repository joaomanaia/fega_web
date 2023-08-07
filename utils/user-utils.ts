import { createServerComponentClient } from "@/supabase"
import { User } from "@supabase/supabase-js"

export const getPairUid = (uid1: string, uid2: string): string => {
  return uid1 < uid2 ? uid1 + uid2 : uid2 + uid1
}

export const getPairUids = (uids: string[]): string => {
    return uids.sort().join("")
}

export const getLocalUser = async (): Promise<User | null> => {
  const supabase = createServerComponentClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user ?? null
}

export const getLocalUserUid = async (): Promise<string | null> => {
  const user = await getLocalUser()

  return user?.id ?? null
}