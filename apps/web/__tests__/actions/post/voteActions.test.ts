import { beforeEach, describe, expect, it, mock, type Mock } from "bun:test"
import { handleVote } from "@/app/actions/post/voteActions"
import type { AppServerError } from "@/lib/safe-action"
import { createClient } from "@/lib/supabase/server"

mock.module("@/lib/supabase/server", () => ({
  createClient: mock(),
}))

mock.module("@/lib/logging", () => ({
  logger: { error: mock(), info: mock(), warn: mock() },
}))

mock.module("next/cache", () => ({
  revalidatePath: mock(),
  updateTag: mock(),
}))

const mockedCreateClient = createClient as Mock<typeof createClient>

describe("handleVote", () => {
  const validPostId = "123e4567-e89b-12d3-a456-426614174000"
  const fakeUser = {
    sub: "user-123",
    id: "user-123",
    email: "user@example.com",
    user_metadata: { username: "alice" },
  }
  let mockSupabase: any

  beforeEach(() => {
    mockedCreateClient.mockClear()
    mockSupabase = {
      from: mock(),
      rpc: mock(),
      auth: {
        getClaims: mock().mockResolvedValue({ data: { claims: fakeUser }, error: null }),
      },
    }
    mockedCreateClient.mockResolvedValue(mockSupabase)
  })

  it("calls toggle_post_vote RPC and returns the result for upvote", async () => {
    const voteData = {
      post_id: validPostId,
      vote_type: "up" as const,
      uid: "user-123",
      created_at: new Date().toISOString(),
    }
    mockSupabase.rpc.mockResolvedValue({
      data: [voteData],
      error: null,
    })

    const boundAction = handleVote.bind(null, validPostId)
    const result = await boundAction({ voteType: "up" })

    expect(mockSupabase.rpc).toHaveBeenCalledWith("toggle_post_vote", {
      p_post_id: validPostId,
      p_vote_type: "up",
    })
    expect(result?.data).toEqual(voteData)
    expect(result?.serverError).toBeUndefined()
  })

  it("calls toggle_post_vote RPC and returns the result for downvote", async () => {
    const voteData = {
      post_id: validPostId,
      vote_type: "down" as const,
      uid: "user-123",
      created_at: new Date().toISOString(),
    }
    mockSupabase.rpc.mockResolvedValue({
      data: [voteData],
      error: null,
    })

    const boundAction = handleVote.bind(null, validPostId)
    const result = await boundAction({ voteType: "down" })

    expect(mockSupabase.rpc).toHaveBeenCalledWith("toggle_post_vote", {
      p_post_id: validPostId,
      p_vote_type: "down",
    })
    expect(result?.data).toEqual(voteData)
    expect(result?.serverError).toBeUndefined()
  })

  it("returns OPERATION_FAILED when RPC returns an error", async () => {
    mockSupabase.rpc.mockResolvedValue({
      data: null,
      error: new Error("DB error"),
    })

    const boundAction = handleVote.bind(null, validPostId)
    const result = await boundAction({ voteType: "up" })
    const serverError = result?.serverError as AppServerError
    expect(serverError?.code).toBe("OPERATION_FAILED")
    expect(serverError?.message).toBe("Failed to process vote")
  })

  it("returns OPERATION_FAILED when RPC returns null data", async () => {
    mockSupabase.rpc.mockResolvedValue({
      data: null,
      error: null,
    })

    const boundAction = handleVote.bind(null, validPostId)
    const result = await boundAction({ voteType: "up" })
    const serverError = result?.serverError as AppServerError
    expect(serverError?.code).toBe("OPERATION_FAILED")
    expect(serverError?.message).toBe("Failed to process vote")
  })

  it("returns validation error for invalid voteType", async () => {
    const boundAction = handleVote.bind(null, validPostId)
    const result = await boundAction({ voteType: "invalid" as any })
    expect(result?.validationErrors).toBeDefined()
    expect(result?.data).toBeUndefined()
  })

  it("returns server error for invalid postId bind argument", async () => {
    const boundAction = handleVote.bind(null, "invalid-uuid")
    const result = await boundAction({ voteType: "up" })
    const serverError = result?.serverError as AppServerError
    expect(serverError?.code).toBe("INTERNAL")
    expect(result?.data).toBeUndefined()
  })

  it("returns server error for empty postId bind argument", async () => {
    const boundAction = handleVote.bind(null, "")
    const result = await boundAction({ voteType: "up" })
    const serverError = result?.serverError as AppServerError
    expect(serverError?.code).toBe("INTERNAL")
    expect(result?.data).toBeUndefined()
  })

  it("returns UNAUTHORIZED when not authenticated", async () => {
    mockSupabase.auth.getClaims.mockResolvedValue({ data: { claims: null }, error: null })
    const boundAction = handleVote.bind(null, validPostId)
    const result = await boundAction({ voteType: "up" })
    const serverError = result?.serverError as AppServerError
    expect(serverError?.code).toBe("UNAUTHORIZED")
  })
})
