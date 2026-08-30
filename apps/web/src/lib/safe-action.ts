import "server-only"
import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
  returnServerError,
} from "next-safe-action"
import * as z from "zod"
import { getSession } from "@/lib/dal"
import { logger } from "@/lib/logging"
import { createClient } from "@/lib/supabase/server"

export type ErrorCode =
  | "INTERNAL"
  | "OPERATION_FAILED"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "DUPLICATE"
  | "RATE_LIMITED"
  | "LIMIT_REACHED"

/**
 * Typed error payload returned to the client as `result.serverError`.
 * Discriminate on `code` to handle each case.
 */
export type AppServerError = {
  code: ErrorCode
  message: string
}

/**
 * Typed alias for `returnServerError` that enforces `AppServerError` at the call site.
 * Bypasses `handleServerError` — the payload is set as `result.serverError` directly.
 *
 * Use for anticipated domain/operational errors. Never returns (throws internally).
 */
export const returnAppError: (e: AppServerError) => never = returnServerError

export const actionClient = createSafeActionClient({
  defineMetadataSchema: () =>
    z.object({
      actionName: z.string().trim().nonempty(),
    }),

  handleServerError(error, { metadata }): AppServerError {
    logger.error(
      { err: error, cause: error.cause },
      `Unexpected error in action: ${metadata.actionName}`,
    )

    return { code: "INTERNAL", message: DEFAULT_SERVER_ERROR_MESSAGE }
  },
})

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await getSession()
  if (!session) {
    returnAppError({ code: "UNAUTHORIZED", message: "Unauthorized" })
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
  if (ctx.user?.user_role !== "admin") {
    returnAppError({ code: "FORBIDDEN", message: "Forbidden" })
  }

  return next({ ctx })
})
