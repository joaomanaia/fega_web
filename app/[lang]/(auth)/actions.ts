"use server"

import { BASE_URL } from "@/core/common"
import { actionClient } from "@/lib/safe-action"
import { forgotPasswordSchema, signInSchema, signUpSchema } from "@/lib/schemas/auth-schemas"
import { resetPasswordSchema } from "@/lib/schemas/user-schemas"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export const signInAction = actionClient.schema(signInSchema).action(async ({ parsedInput }) => {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: parsedInput.email,
    password: parsedInput.password,
  })

  if (error) {
    throw error.message
  }

  revalidatePath("/", "layout")
  redirect("/")
})

export const signUpAction = actionClient.schema(signUpSchema).action(async ({ parsedInput }) => {
  const supabase = await createClient()

  // Check if username is available
  const { data: usernameExists } = await supabase
    .from("users")
    .select("id")
    .eq("username", parsedInput.username)
    .single()

  if (usernameExists) {
    throw new Error("Username already exists")
  }

  const { error } = await supabase.auth.signUp({
    email: parsedInput.email,
    password: parsedInput.password,
    options: {
      data: {
        username: parsedInput.username,
        full_name: parsedInput.fullname,
      },
    },
  })

  if (error) {
    throw error.message
  }

  revalidatePath("/", "layout")
  redirect("/")
})

export const forgotPasswordAction = actionClient
  .schema(forgotPasswordSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(parsedInput.email, {
      redirectTo: `${BASE_URL}/reset-password`,
    })

    if (error) {
      throw error.message
    }
  })

export const resetPasswordAction = actionClient
  .schema(resetPasswordSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
      password: parsedInput.password,
    })

    if (error) {
      throw error.message
    }

    redirect("/")
  })
