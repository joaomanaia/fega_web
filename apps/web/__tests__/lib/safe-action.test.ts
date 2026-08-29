import { beforeEach, describe, expect, it, mock, type Mock } from "bun:test"
import * as z from "zod"
import { actionClient, ActionError, authActionClient, isAdminActionClient } from "@/lib/safe-action"
import { createClient } from "@/lib/supabase/server"

mock.module("server-only", () => ({}))

mock.module("@/lib/supabase/server", () => ({
  createClient: mock(),
}))

mock.module("@/lib/logging", () => ({
  logger: {
    error: mock(),
    info: mock(),
    warn: mock(),
  },
}))

const mockedCreateClient = createClient as Mock<typeof createClient>

describe("Safe Action Pipeline", () => {
  const fakeSupabase = {
    from: mock(),
    auth: {
      getClaims: mock(),
    },
  }

  beforeEach(() => {
    mockedCreateClient.mockClear()
    fakeSupabase.auth.getClaims.mockReset()
    mockedCreateClient.mockResolvedValue(fakeSupabase as any)
  })

  describe("actionClient (public tier)", () => {
    it("executes public action successfully with parsed input", async () => {
      const publicAction = actionClient
        .metadata({ actionName: "testPublicAction" })
        .inputSchema(z.object({ name: z.string() }))
        .action(async ({ parsedInput }) => {
          return { greeting: `Hello, ${parsedInput.name}!` }
        })

      const result = await publicAction({ name: "Alice" })
      expect(result?.data).toEqual({ greeting: "Hello, Alice!" })
      expect(result?.serverError).toBeUndefined()
    })

    it("handles ActionError and passes through the message", async () => {
      const failingAction = actionClient
        .metadata({ actionName: "testFailingAction" })
        .inputSchema(z.object({}))
        .action(async () => {
          throw new ActionError("Custom domain error")
        })

      const result = await failingAction({})
      expect(result?.serverError).toBe("Custom domain error")
    })

    it("masks unexpected errors with generic message", async () => {
      const errorAction = actionClient
        .metadata({ actionName: "testErrorAction" })
        .inputSchema(z.object({}))
        .action(async () => {
          throw new Error("Internal DB connection failed: secret_db_url")
        })

      const result = await errorAction({})
      expect(result?.serverError).toBe("Something went wrong while executing the operation.")
    })

    it("maps 23505 unique constraint error code in PostgrestError", async () => {
      const conflictAction = actionClient
        .metadata({ actionName: "testConflictAction" })
        .inputSchema(z.object({}))
        .action(async () => {
          const pgError: any = new Error("duplicate key value violates unique constraint")
          pgError.code = "23505"
          pgError.details = "Key (username)=(john) already exists."
          throw pgError
        })

      const result = await conflictAction({})
      expect(result?.serverError).toBe("A record with this information already exists.")
    })
  })

  describe("authActionClient (authenticated tier)", () => {
    it("injects session user, uid, and supabase client into context when authenticated", async () => {
      const fakeUser = {
        sub: "user-123",
        id: "user-123",
        email: "user@example.com",
        user_metadata: { username: "johndoe" },
      }
      fakeSupabase.auth.getClaims.mockResolvedValue({
        data: { claims: fakeUser },
        error: null,
      })

      const authAction = authActionClient
        .metadata({ actionName: "testAuthAction" })
        .inputSchema(z.object({ value: z.number() }))
        .action(async ({ parsedInput, ctx }) => {
          return {
            uid: ctx.uid,
            user: ctx.user,
            hasSupabase: Boolean(ctx.supabase),
            doubled: parsedInput.value * 2,
          }
        })

      const result = await authAction({ value: 21 })
      expect(result?.data).toEqual({
        uid: "user-123",
        user: fakeUser as any,
        hasSupabase: true,
        doubled: 42,
      })
      expect(result?.serverError).toBeUndefined()
    })

    it("returns error when session is not found", async () => {
      fakeSupabase.auth.getClaims.mockResolvedValue({
        data: { claims: null },
        error: null,
      })

      const authAction = authActionClient
        .metadata({ actionName: "testAuthAction" })
        .inputSchema(z.object({}))
        .action(async () => {
          return { success: true }
        })

      const result = await authAction({})
      expect(result?.serverError).toBe("Unauthorized")
    })
  })

  describe("isAdminActionClient (admin tier)", () => {
    it("allows execution when user has admin role in user_role", async () => {
      const adminUser = { sub: "admin-1", id: "admin-1", user_role: "admin" }
      fakeSupabase.auth.getClaims.mockResolvedValue({
        data: { claims: adminUser },
        error: null,
      })

      const adminAction = isAdminActionClient
        .metadata({ actionName: "testAdminAction" })
        .inputSchema(z.object({}))
        .action(async ({ ctx }) => {
          return { adminUid: ctx.uid }
        })

      const result = await adminAction({})
      expect(result?.data).toEqual({ adminUid: "admin-1" })
      expect(result?.serverError).toBeUndefined()
    })

    it("rejects execution when user is not admin", async () => {
      const regularUser = { sub: "user-1", id: "user-1", user_role: "user" }
      fakeSupabase.auth.getClaims.mockResolvedValue({
        data: { claims: regularUser },
        error: null,
      })

      const adminAction = isAdminActionClient
        .metadata({ actionName: "testAdminAction" })
        .inputSchema(z.object({}))
        .action(async () => {
          return { success: true }
        })

      const result = await adminAction({})
      expect(result?.serverError).toBe("Forbidden")
    })
  })
})
