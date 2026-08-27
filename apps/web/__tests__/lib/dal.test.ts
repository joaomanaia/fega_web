import { beforeEach, describe, expect, it, Mock, mock } from "bun:test"
import { getLocale } from "next-intl/server"
import { redirect } from "@/i18n/navigation"
import { getSession, verifySession, verifyUserRole } from "@/lib/dal"
import { createClient } from "@/lib/supabase/server"

mock.module("@/lib/supabase/server", () => ({
  createClient: mock(),
}))
mock.module("next-intl/server", () => ({
  getLocale: mock(),
}))
mock.module("@/i18n/navigation", () => ({
  redirect: mock(),
}))


const mockedGetLocale = getLocale as Mock<typeof getLocale>
const mockedCreateClient = createClient as Mock<typeof createClient>

function mockSupabaseGetClaims(getClaimsResponse: unknown = { data: null, error: null }) {
  mockedCreateClient.mockResolvedValue({
    auth: {
      getClaims: mock().mockResolvedValue(getClaimsResponse),
    },
  } as any)
}

describe("DAL", () => {
  beforeEach(() => {
    mockedGetLocale.mockClear()
    mockedCreateClient.mockClear()
    ;(redirect as Mock<typeof redirect>).mockClear()
  })

  describe("getSession", () => {
    it("returns session with user and uid if claims exist", async () => {
      mockSupabaseGetClaims({
        data: { claims: { sub: "123", name: "Test User" } },
      })

      const session = await getSession()
      expect(session).toEqual({
        user: { sub: "123", name: "Test User" } as any,
        uid: "123",
      })
    })

    it("returns null if error occurs", async () => {
      mockSupabaseGetClaims({
        error: { message: "Some error" },
      })

      const session = await getSession()
      expect(session).toBeNull()
    })

    it("returns null if no user claims", async () => {
      mockSupabaseGetClaims({
        data: { claims: null },
        error: null,
      })

      const session = await getSession()
      expect(session).toBeNull()
    })
  })

  describe("verifySession", () => {
    it("redirects if session is null", async () => {
      mockSupabaseGetClaims({ data: null, error: null })
      mockedGetLocale.mockResolvedValue("en")
      await verifySession()
      expect(redirect).toHaveBeenCalledWith({ href: "/auth/login", locale: "en" })
    })

    it("returns authenticated object if session exists", async () => {
      const fakeSession = { user: { sub: "123" }, uid: "123" }
      mockSupabaseGetClaims({ data: { claims: fakeSession.user }, error: null })
      const result = await verifySession()
      expect(result).toEqual({
        authenticated: true,
        user: fakeSession.user as any,
        uid: fakeSession.uid,
      })
    })
  })

  describe("verifyUserRole", () => {
    it("redirects if user role does not match required role", async () => {
      const fakeSession = {
        authenticated: true,
        user: { user_role: "user" },
        uid: "123",
      }
      mockSupabaseGetClaims({ data: { claims: fakeSession.user }, error: null })
      mockedGetLocale.mockResolvedValue("en")
      await verifyUserRole("admin")
      expect(redirect).toHaveBeenCalledWith({ href: "/", locale: "en" })
    })

    it("does not redirect if user role matches required role", async () => {
      const fakeSession = {
        authenticated: true,
        user: { user_role: "admin" },
        uid: "123",
      }
      mockSupabaseGetClaims({ data: { claims: fakeSession.user }, error: null })
      const result = await verifyUserRole("admin")
      expect(redirect).not.toHaveBeenCalled()
      expect(result).not.toBeNull()
    })

    it("handles missing user_role in claims gracefully", async () => {
      const fakeSession = {
        authenticated: true,
        user: {},
        uid: "123",
      }
      mockSupabaseGetClaims({ data: { claims: fakeSession.user }, error: null })
      mockedGetLocale.mockResolvedValue("en")
      await verifyUserRole("admin")
      expect(redirect).toHaveBeenCalledWith({ href: "/", locale: "en" })
    })

    it("redirects if session is null (user not authenticated)", async () => {
      mockSupabaseGetClaims({ data: null, error: null })
      mockedGetLocale.mockResolvedValue("en")
      await verifyUserRole("admin")
      expect(redirect).toHaveBeenCalledWith({ href: "/auth/login", locale: "en" })
    })
  })
})
