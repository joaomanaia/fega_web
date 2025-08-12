import { getLocale } from "next-intl/server"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "@/src/i18n/navigation"
import { getSession, verifySession, verifyUserRole } from "../../lib/dal"

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}))
jest.mock("next-intl/server", () => ({
  getLocale: jest.fn(),
}))
jest.mock("@/src/i18n/navigation", () => ({
  redirect: jest.fn(),
}))
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  cache: (fn: any) => fn,
}))

const mockedGetLocale = getLocale as jest.Mock
const mockedCreateClient = createClient as jest.Mock

function mockSupabaseGetClaims(getClaimsResponse: any = { data: null, error: null }) {
  mockedCreateClient.mockResolvedValue({
    auth: {
      getClaims: jest.fn().mockResolvedValue(getClaimsResponse),
    },
  })
}

describe("DAL", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("getSession", () => {
    it("returns session with user and uid if claims exist", async () => {
      mockSupabaseGetClaims({
        data: { claims: { sub: "123", name: "Test User" } },
      })

      const session = await getSession()
      expect(session).toEqual({
        user: { sub: "123", name: "Test User" },
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

    it("handles missing sub in claims gracefully", async () => {
      mockSupabaseGetClaims({
        data: { claims: { name: "NoSubUser" } },
        error: null,
      })

      const session = await getSession()
      expect(session).toEqual({
        user: { name: "NoSubUser" },
        uid: undefined,
      })
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
        user: fakeSession.user,
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
