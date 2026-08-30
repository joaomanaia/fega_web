"use server"

import { redirect } from "next/navigation"
import { returnValidationErrors } from "next-safe-action"
import { BASE_URL } from "@/core/common"
import { actionClient, returnAppError } from "@/lib/safe-action"
import { forgotPasswordSchema, signInSchema, signUpSchema } from "@/lib/schemas/auth-schemas"
import { resetPasswordSchema } from "@/lib/schemas/user-schemas"
import { createClient } from "@/lib/supabase/server"

export const signInAction = actionClient
  .metadata({ actionName: "signIn" })
  .inputSchema(signInSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: parsedInput.email,
      password: parsedInput.password,
    })

    if (error) {
      returnAppError({ code: "OPERATION_FAILED", message: "Invalid email or password" })
    }

    redirect("/")
  })

export const signUpAction = actionClient
  .metadata({ actionName: "signUp" })
  .inputSchema(signUpSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient()

    // Check if username is available
    const { data: usernameExists } = await supabase
      .from("users")
      .select("id")
      .eq("username", parsedInput.username)
      .single()

    if (usernameExists) {
      returnValidationErrors(signUpSchema, {
        username: {
          _errors: ["Username already exists"],
        },
      })
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
      returnAppError({ code: "OPERATION_FAILED", message: "Failed to create account" })
    }

    redirect("/")
  })

export const forgotPasswordAction = actionClient
  .metadata({ actionName: "forgotPassword" })
  .inputSchema(forgotPasswordSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(parsedInput.email, {
      redirectTo: `${BASE_URL}/reset-password`,
    })

    if (error) {
      returnAppError({ code: "OPERATION_FAILED", message: "Failed to send password reset email" })
    }
  })

export const resetPasswordAction = actionClient
  .metadata({ actionName: "resetPassword" })
  .inputSchema(resetPasswordSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
      password: parsedInput.password,
    })

    if (error) {
      returnAppError({ code: "OPERATION_FAILED", message: "Failed to reset password" })
    }

    redirect("/")
  })
