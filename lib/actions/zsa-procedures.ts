import { createServerActionClient } from "@/supabase"
import { createServerActionProcedure, ZSAError } from "zsa"

export const authenticatedProcedure = createServerActionProcedure().handler(async () => {
  const supabase = createServerActionClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new ZSAError(
      "NOT_AUTHORIZED",
      "You are not authorized to perform this action. Please log in and try again."
    )
  }

  return { user, supabase }
})
