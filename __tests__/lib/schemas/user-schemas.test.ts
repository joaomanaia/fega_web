import { usernameSchema } from "@/lib/schemas/user-schemas"

it.each(["john", "john_doe", "john_doe_123", "john_doe_123", "john_doe_123_abc"])(
  "should be valid when username is %s",
  (username) => {
    expect(() => usernameSchema.parse(username)).not.toThrow()
  }
)

it.each([
  "",
  "admin",
  "john doe",
  "john-doe",
  "johndoe_.___w",
  "john_.doe",
  "john@doe",
  "aaa#",
  "aaaA",
])("should throw an error when username is %s", (username) => {
  expect(() => usernameSchema.parse(username)).toThrow()
})
