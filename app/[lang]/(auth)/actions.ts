"use server"

import { BASE_URL } from "@/core/common"
import { forgotPasswordSchema, signInSchema, signUpSchema } from "@/lib/schemas/auth-schemas"
import { resetPasswordSchema } from "@/lib/schemas/user-schemas"
import { createServerActionClient } from "@/supabase"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerAction, ZSAError } from "zsa"

export const signInAction = createServerAction()
  .input(signInSchema)
  .handler(async ({ input }) => {
    const supabase = await createServerActionClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    })

    if (error) {
      throw error.message
    }

    revalidatePath("/", "layout")
    redirect("/")
  })

export const signUpAction = createServerAction()
  .input(signUpSchema)
  .handler(async ({ input }) => {
    const supabase = await createServerActionClient()

    // Check if username is available
    const { data: usernameExists } = await supabase
      .from("users")
      .select("id")
      .eq("username", input.username)
      .single()

    if (usernameExists) {
      throw new ZSAError("CONFLICT", "Username already exists")
    }

    const { error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          username: input.username,
          full_name: input.fullname,
        },
      },
    })

    if (error) {
      throw error.message
    }

    revalidatePath("/", "layout")
    redirect("/")
  })

export const forgotPasswordAction = createServerAction()
  .input(forgotPasswordSchema)
  .handler(async ({ input }) => {
    const supabase = await createServerActionClient()

    const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
      redirectTo: `${BASE_URL}/reset-password`,
    })

    if (error) {
      throw error.message
    }
  })

export const resetPasswordAction = createServerAction()
  .input(resetPasswordSchema)
  .handler(async ({ input }) => {
    const supabase = await createServerActionClient()

    const { error } = await supabase.auth.updateUser({
      password: input.password,
    })

    if (error) {
      throw error.message
    }

    redirect("/")
  })
