import "server-only"
import { PostgrestError } from "@supabase/supabase-js"
import { createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE } from "next-safe-action"
import z from "zod"
import { getSession } from "@/lib/dal"
import { logger } from "@/lib/logging"

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

    if (error instanceof ActionError || error instanceof PostgrestError) {
      return error.message
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
      throw new Error("Session not found!")
    }

    return next({
      ctx: {
        user: session.user,
        uid: session.uid,
      },
    })
  })

export const isAdminActionClient = authActionClient.use(async ({ next, ctx }) => {
  if (ctx.user.role !== "admin") {
    throw new Error("User not authorized")
  }

  return next()
})
