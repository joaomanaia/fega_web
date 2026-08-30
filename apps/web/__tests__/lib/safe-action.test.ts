import { beforeEach, describe, expect, it, mock, type Mock } from "bun:test"
import { DEFAULT_SERVER_ERROR_MESSAGE } from "next-safe-action"
import * as z from "zod"
import { actionClient, authActionClient, isAdminActionClient, returnAppError } from "@/lib/safe-action"
import type { AppServerError } from "@/lib/safe-action"
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

    it("returns validation errors for invalid input", async () => {
      const action = actionClient
        .metadata({ actionName: "testValidation" })
        .inputSchema(z.object({ email: z.string().email() }))
        .action(async ({ parsedInput }) => {
          return { email: parsedInput.email }
        })

      const result = await action({ email: "not-an-email" })
      expect(result?.data).toBeUndefined()
      expect(result?.validationErrors).toBeDefined()
    })

    it("returns typed INTERNAL AppServerError for unexpected errors", async () => {
      const errorAction = actionClient
        .metadata({ actionName: "testErrorAction" })
        .inputSchema(z.object({}))
        .action(async () => {
          throw new Error("Internal DB connection failed: secret_db_url")
        })

      const result = await errorAction({})
      const serverError = result?.serverError as AppServerError
      expect(serverError.code).toBe("INTERNAL")
      expect(serverError.message).toBe(DEFAULT_SERVER_ERROR_MESSAGE)
    })

    it("never leaks raw error messages to the client", async () => {
      const errorAction = actionClient
        .metadata({ actionName: "testLeakAction" })
        .inputSchema(z.object({}))
        .action(async () => {
          throw new Error("password=secret123 host=db.internal")
        })

      const result = await errorAction({})
      const serverError = result?.serverError as AppServerError
      expect(serverError.message).not.toContain("secret123")
      expect(serverError.message).not.toContain("db.internal")
      expect(serverError.message).toBe(DEFAULT_SERVER_ERROR_MESSAGE)
    })

    it("surfaces typed AppServerError from returnAppError", async () => {
      const action = actionClient
        .metadata({ actionName: "testReturnAppError" })
        .inputSchema(z.object({}))
        .action(async () => {
          returnAppError({ code: "DUPLICATE", message: "Username is already taken" })
        })

      const result = await action({})
      const serverError = result?.serverError as AppServerError
      expect(serverError.code).toBe("DUPLICATE")
      expect(serverError.message).toBe("Username is already taken")
    })

    it("surfaces OPERATION_FAILED from returnAppError", async () => {
      const action = actionClient
        .metadata({ actionName: "testOperationFailed" })
        .inputSchema(z.object({}))
        .action(async () => {
          returnAppError({ code: "OPERATION_FAILED", message: "Failed to create group" })
        })

      const result = await action({})
      const serverError = result?.serverError as AppServerError
      expect(serverError.code).toBe("OPERATION_FAILED")
      expect(serverError.message).toBe("Failed to create group")
    })

    it("surfaces RATE_LIMITED from returnAppError", async () => {
      const action = actionClient
        .metadata({ actionName: "testRateLimited" })
        .inputSchema(z.object({}))
        .action(async () => {
          returnAppError({ code: "RATE_LIMITED", message: "Please wait before posting again" })
        })

      const result = await action({})
      const serverError = result?.serverError as AppServerError
      expect(serverError.code).toBe("RATE_LIMITED")
      expect(serverError.message).toBe("Please wait before posting again")
    })

    it("surfaces LIMIT_REACHED from returnAppError", async () => {
      const action = actionClient
        .metadata({ actionName: "testLimitReached" })
        .inputSchema(z.object({}))
        .action(async () => {
          returnAppError({ code: "LIMIT_REACHED", message: "Group has reached the limit of participants" })
        })

      const result = await action({})
      const serverError = result?.serverError as AppServerError
      expect(serverError.code).toBe("LIMIT_REACHED")
      expect(serverError.message).toBe("Group has reached the limit of participants")
    })

    it("surfaces NOT_FOUND from returnAppError", async () => {
      const action = actionClient
        .metadata({ actionName: "testNotFound" })
        .inputSchema(z.object({}))
        .action(async () => {
          returnAppError({ code: "NOT_FOUND", message: "Resource not found" })
        })

      const result = await action({})
      const serverError = result?.serverError as AppServerError
      expect(serverError.code).toBe("NOT_FOUND")
      expect(serverError.message).toBe("Resource not found")
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

    it("returns UNAUTHORIZED AppServerError when session is not found", async () => {
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
      const serverError = result?.serverError as AppServerError
      expect(serverError.code).toBe("UNAUTHORIZED")
      expect(serverError.message).toBe("Unauthorized")
    })
  })

  describe("isAdminActionClient (admin tier)", () => {
    it("allows execution when user has admin role", async () => {
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

    it("returns FORBIDDEN AppServerError when user is not admin", async () => {
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
      const serverError = result?.serverError as AppServerError
      expect(serverError.code).toBe("FORBIDDEN")
      expect(serverError.message).toBe("Forbidden")
    })

    it("returns UNAUTHORIZED when unauthenticated user attempts admin action", async () => {
      fakeSupabase.auth.getClaims.mockResolvedValue({
        data: { claims: null },
        error: null,
      })

      const adminAction = isAdminActionClient
        .metadata({ actionName: "testAdminAction" })
        .inputSchema(z.object({}))
        .action(async () => {
          return { success: true }
        })

      const result = await adminAction({})
      const serverError = result?.serverError as AppServerError
      expect(serverError.code).toBe("UNAUTHORIZED")
    })

    it("returns FORBIDDEN when user has no user_role field", async () => {
      const noRoleUser = { sub: "user-2", id: "user-2" }
      fakeSupabase.auth.getClaims.mockResolvedValue({
        data: { claims: noRoleUser },
        error: null,
      })

      const adminAction = isAdminActionClient
        .metadata({ actionName: "testAdminAction" })
        .inputSchema(z.object({}))
        .action(async () => {
          return { success: true }
        })

      const result = await adminAction({})
      const serverError = result?.serverError as AppServerError
      expect(serverError.code).toBe("FORBIDDEN")
    })
  })
})
