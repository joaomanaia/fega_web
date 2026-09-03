"use server"

import * as z from "zod"
import { logger } from "@/lib/logging"
import { authActionClient, returnAppError } from "@/lib/safe-action"
import { votePostSchema } from "@/lib/schemas/post-schemas"

export const handleVote = authActionClient
  .metadata({ actionName: "handleVote" })
  .inputSchema(votePostSchema)
  .bindArgsSchemas<[postId: z.ZodUUID]>([z.uuid()])
  .action(async ({ parsedInput, bindArgsParsedInputs: [postId], ctx }) => {
    const { voteType } = parsedInput

    const { data, error } = await ctx.supabase.rpc("toggle_post_vote", {
      p_post_id: postId,
      p_vote_type: voteType,
    })

    if (error || !data) {
      logger.error(error)
      returnAppError({ code: "OPERATION_FAILED", message: "Failed to process vote" })
    }

    return data[0]
  })
