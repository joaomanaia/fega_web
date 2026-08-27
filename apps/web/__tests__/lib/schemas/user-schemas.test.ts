import { describe, expect, test } from "bun:test"
import { usernameSchema } from "@/lib/schemas/user-schemas"

describe("usernameSchema", () => {
  test.each(["john", "john_doe", "john_doe_123", "john_doe_123_abc"])(
    "accepts valid username: %s",
    (username) => {
      const result = usernameSchema.safeParse(username)
      expect(result.success).toBe(true)
    },
  )

  test.each([
    "",
    "admin",
    "john doe",
    "john-doe",
    "johndoe_.___w",
    "john_.doe",
    "john@doe",
    "aaa#",
    "aaaA",
  ])("rejects invalid username: %s", (username) => {
    const result = usernameSchema.safeParse(username)
    expect(result.success).toBe(false)
  })
})
