import "server-only"
import { PostgrestError } from "@supabase/supabase-js"
import { createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE } from "next-safe-action"
import * as z from "zod"
import { getSession } from "@/lib/dal"
import { logger } from "@/lib/logging"
import { createClient } from "@/lib/supabase/server"

export class ActionError extends Error {}

export const actionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({
      actionName: z.string().nonempty(),
    })
  },
  // Define a custom error handler for the action client.
  handleServerError(error, utils) {
    // You can access these properties inside the `utils` object.
    const { metadata } = utils

    logger.error(
      {
        message: error.message,
        cause: error.cause,
      },
      `Error in action: ${metadata.actionName}`
    )

    if (error instanceof ActionError) {
      return error.message
    }

    if (error instanceof PostgrestError || (error && typeof error === "object" && "code" in error)) {
      const code = (error as { code?: string }).code
      if (code === "23505") {
        return "A record with this information already exists."
      }
      if (error instanceof PostgrestError) {
        return error.message
      }
    }

    // Return generic message
    return DEFAULT_SERVER_ERROR_MESSAGE
  },
})

export const authActionClient = actionClient
  // Define authorization middleware.
  .use(async ({ next }) => {
    const session = await getSession()

    if (!session) {
      throw new ActionError("Session not found!")
    }

    const supabase = await createClient()

    return next({
      ctx: {
        user: session.user,
        uid: session.uid,
        supabase,
      },
    })
  })

export const isAdminActionClient = authActionClient.use(async ({ next, ctx }) => {
  const role = (ctx.user as { user_role?: string; role?: string }).user_role ?? (ctx.user as { role?: string }).role
  if (role !== "admin") {
    throw new ActionError("User not authorized")
  }

  return next()
})
