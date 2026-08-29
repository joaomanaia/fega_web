import "server-only"
import { PostgrestError } from "@supabase/supabase-js"
import { createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE } from "next-safe-action"
import * as z from "zod"
import { getSession } from "@/lib/dal"
import { logger } from "@/lib/logging"
import { createClient } from "@/lib/supabase/server"

export class ActionError extends Error {}

const isUniqueViolation = (err: unknown): err is { message: string; code: string } =>
  err instanceof PostgrestError ||
  (err instanceof Error && "code" in err && (err as { code: unknown }).code === "23505")

export const actionClient = createSafeActionClient({
  defineMetadataSchema: () =>
    z.object({
      actionName: z.string().trim().nonempty(),
    }),

  handleServerError(error, { metadata }) {
    if (error instanceof ActionError) {
      logger.warn({ message: error.message }, `Expected error in action: ${metadata.actionName}`)
      return error.message
    }

    if (isUniqueViolation(error)) {
      logger.warn(
        { message: error.message, code: error.code },
        `Unique constraint violation in action: ${metadata.actionName}`,
      )
      return "A record with this information already exists."
    }

    logger.error(
      { err: error, cause: error.cause },
      `Unexpected error in action: ${metadata.actionName}`,
    )

    return DEFAULT_SERVER_ERROR_MESSAGE
  },
})

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await getSession()
  if (!session) throw new ActionError("Unauthorized")

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
  if (ctx.user?.user_role !== "admin") {
    throw new ActionError("Forbidden")
  }

  return next({ ctx })
})
