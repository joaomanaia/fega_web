import { beforeEach, describe, expect, it, mock, type Mock } from "bun:test"
import {
  forgotPasswordAction,
  resetPasswordAction,
  signInAction,
  signUpAction,
} from "@/app/[lang]/auth/actions"
import { createEvent } from "@/app/actions/calendarEventActions"
import { deleteMessage, editMessage } from "@/app/actions/group/messageActions"
import {
  addParticipant,
  createGroup,
  deleteGroup,
  editGroup,
  exitGroup,
  removeParticipant,
  searchNoParticipants,
} from "@/app/actions/groupActions"
import { createLocation } from "@/app/actions/locationActions"
import { createNews } from "@/app/actions/news/newsActions"
import { removeUserAvatar, updateProfileAction, updateUserEmail } from "@/app/actions/userActions"
import { createPost, deletePost } from "@/core/actions/postActions"
import type { AppServerError } from "@/lib/safe-action"
import { createClient } from "@/lib/supabase/server"

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

mock.module("next/cache", () => ({
  revalidatePath: mock(),
  updateTag: mock(),
}))

mock.module("next-intl/server", () => ({
  getLocale: mock().mockResolvedValue("en"),
  getTranslations: mock().mockResolvedValue((key: string) => key),
}))

mock.module("@/i18n/navigation", () => ({
  redirect: mock(),
}))

mock.module("next/navigation", () => ({
  redirect: mock(),
}))

mock.module("@/app/api/uploadthing/core", () => ({
  deleteAvatarIfFromUploadthing: mock().mockResolvedValue(true),
}))

const mockedCreateClient = createClient as Mock<typeof createClient>

describe("Domain Mutation Modules", () => {
  const fakeUser = {
    sub: "user-123",
    id: "user-123",
    email: "user@example.com",
    user_metadata: { username: "alice", avatar_url: "https://utfs.io/f/test.png" },
  }

  let mockSupabase: any

  beforeEach(() => {
    mockedCreateClient.mockClear()

    mockSupabase = {
      from: mock(),
      rpc: mock(),
      auth: {
        getClaims: mock().mockResolvedValue({ data: { claims: fakeUser }, error: null }),
        updateUser: mock().mockResolvedValue({ data: { user: fakeUser }, error: null }),
        refreshSession: mock().mockResolvedValue({}),
        signInWithPassword: mock().mockResolvedValue({ data: {}, error: null }),
        signUp: mock().mockResolvedValue({ data: {}, error: null }),
        resetPasswordForEmail: mock().mockResolvedValue({ data: {}, error: null }),
      },
    }

    mockedCreateClient.mockResolvedValue(mockSupabase)
  })

  describe("User mutations", () => {
    it("updateProfileAction updates user in database and auth metadata", async () => {
      const updateMock = mock().mockReturnValue({
        eq: mock().mockResolvedValue({ error: null }),
      })
      mockSupabase.from.mockReturnValue({ update: updateMock })

      const result = await updateProfileAction({
        username: "new_username",
        full_name: "New Name",
        bio: "Bio here",
        avatar: "https://example.com/avatar.png",
      })

      expect(result?.serverError).toBeUndefined()
      expect(mockSupabase.from).toHaveBeenCalledWith("users")
      expect(updateMock).toHaveBeenCalledWith({
        username: "new_username",
        full_name: "New Name",
        bio: "Bio here",
        avatar_url: "https://example.com/avatar.png",
      })
      expect(mockSupabase.auth.updateUser).toHaveBeenCalled()
    })

    it("updateProfileAction returns validation error on duplicate username (23505)", async () => {
      mockSupabase.from.mockReturnValue({
        update: mock().mockReturnValue({
          eq: mock().mockResolvedValue({
            error: { code: "23505", message: "duplicate key value violates unique constraint" },
          }),
        }),
      })

      const result = await updateProfileAction({
        username: "taken_user",
        full_name: "Test Name",
        bio: "",
        avatar: null,
      })

      expect(result?.serverError).toBeUndefined()
      expect(result?.validationErrors?.username?._errors).toContain("Username is already taken")
    })

    it("updateProfileAction returns OPERATION_FAILED on other database errors", async () => {
      mockSupabase.from.mockReturnValue({
        update: mock().mockReturnValue({
          eq: mock().mockResolvedValue({
            error: { code: "42P01", message: "relation does not exist" },
          }),
        }),
      })

      const result = await updateProfileAction({
        username: "user_fail",
        full_name: "Test Name",
        bio: "",
        avatar: null,
      })

      const serverError = result?.serverError as AppServerError
      expect(serverError?.code).toBe("OPERATION_FAILED")
      expect(serverError?.message).toBe("Failed to update profile")
    })

    it("removeUserAvatar clears avatar_url and cleans up uploadthing", async () => {
      mockSupabase.from.mockReturnValue({
        update: mock().mockReturnValue({
          eq: mock().mockResolvedValue({ error: null }),
        }),
      })

      const result = await removeUserAvatar()
      expect(result?.serverError).toBeUndefined()
      expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({
        data: { avatar_url: null },
      })
    })

    it("removeUserAvatar returns OPERATION_FAILED on failure", async () => {
      mockSupabase.from.mockReturnValue({
        update: mock().mockReturnValue({
          eq: mock().mockResolvedValue({ error: new Error("DB error") }),
        }),
      })

      const result = await removeUserAvatar()
      const serverError = result?.serverError as AppServerError
      expect(serverError?.code).toBe("OPERATION_FAILED")
      expect(serverError?.message).toBe("Failed to remove avatar")
    })

    it("updateUserEmail validates email change and rejects matching current email with validationErrors", async () => {
      const result = await updateUserEmail({
        email: "user@example.com",
        confirmEmail: "user@example.com",
      })

      expect(result?.serverError).toBeUndefined()
      expect(result?.validationErrors?.email?._errors).toContain(
        "Email is the same as the current email",
      )
    })

    it("updateUserEmail successfully initiates email change", async () => {
      mockSupabase.auth.updateUser.mockResolvedValue({
        data: { user: { ...fakeUser, email: "new@example.com" } },
        error: null,
      })

      const result = await updateUserEmail({
        email: "new@example.com",
        confirmEmail: "new@example.com",
      })

      expect(result?.serverError).toBeUndefined()
      expect(result?.data?.email).toBe("new@example.com")
    })
  })

  describe("Group mutations", () => {
    it("createGroup inserts group with created_by uid and returns group ID", async () => {
      mockSupabase.from.mockReturnValue({
        insert: mock().mockReturnValue({
          select: mock().mockReturnValue({
            single: mock().mockResolvedValue({ data: { id: "group-999" }, error: null }),
          }),
        }),
      })

      const result = await createGroup({
        group_name: "My New Group",
        group_avatar: "https://example.com/group.png",
      })

      expect(result?.data).toBe("group-999")
      expect(result?.serverError).toBeUndefined()
    })

    it("createGroup returns OPERATION_FAILED when insert fails", async () => {
      mockSupabase.from.mockReturnValue({
        insert: mock().mockReturnValue({
          select: mock().mockReturnValue({
            single: mock().mockResolvedValue({ data: null, error: new Error("DB Error") }),
          }),
        }),
      })

      const result = await createGroup({
        group_name: "My New Group",
        group_avatar: "https://example.com/group.png",
      })

      const serverError = result?.serverError as AppServerError
      expect(serverError?.code).toBe("OPERATION_FAILED")
      expect(serverError?.message).toBe("Failed to create group")
    })

    it("editGroup updates group name and icon_url", async () => {
      mockSupabase.from.mockReturnValue({
        update: mock().mockReturnValue({
          eq: mock().mockResolvedValue({ error: null }),
        }),
      })

      const result = await editGroup({
        groupId: "group-999",
        groupName: "Updated Group Name",
        iconUrl: "https://example.com/new.png",
      })

      expect(result?.serverError).toBeUndefined()
    })

    it("exitGroup removes current participant from group", async () => {
      const eqMock2 = mock().mockResolvedValue({ error: null })
      const eqMock1 = mock().mockReturnValue({ eq: eqMock2 })
      mockSupabase.from.mockReturnValue({
        delete: mock().mockReturnValue({ eq: eqMock1 }),
      })

      const result = await exitGroup({ groupId: "group-999" })
      expect(result?.serverError).toBeUndefined()
      expect(eqMock1).toHaveBeenCalledWith("uid", "user-123")
      expect(eqMock2).toHaveBeenCalledWith("group_id", "group-999")
    })

    it("deleteGroup removes group by ID", async () => {
      const eqMock = mock().mockResolvedValue({ error: null })
      mockSupabase.from.mockReturnValue({
        delete: mock().mockReturnValue({ eq: eqMock }),
      })

      const result = await deleteGroup({ groupId: "group-999" })
      expect(result?.serverError).toBeUndefined()
      expect(eqMock).toHaveBeenCalledWith("id", "group-999")
    })

    it("addParticipant adds participant when within member limit", async () => {
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === "group_participants") {
          return {
            select: mock().mockReturnValue({
              eq: mock().mockResolvedValue({ count: 5, error: null }),
            }),
            upsert: mock().mockResolvedValue({ error: null }),
          }
        }
        return {}
      })

      const result = await addParticipant({ groupId: "group-999", uid: "user-456" })
      expect(result?.serverError).toBeUndefined()
    })

    it("addParticipant returns LIMIT_REACHED when group has 16 or more participants", async () => {
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === "group_participants") {
          return {
            select: mock().mockReturnValue({
              eq: mock().mockResolvedValue({ count: 16, error: null }),
            }),
          }
        }
        return {}
      })

      const result = await addParticipant({ groupId: "group-999", uid: "user-456" })
      const serverError = result?.serverError as AppServerError
      expect(serverError?.code).toBe("LIMIT_REACHED")
      expect(serverError?.message).toBe("Group has reached the limit of participants")
    })

    it("removeParticipant removes user from group participants", async () => {
      const eqMock2 = mock().mockResolvedValue({ error: null })
      const eqMock1 = mock().mockReturnValue({ eq: eqMock2 })
      mockSupabase.from.mockReturnValue({
        delete: mock().mockReturnValue({ eq: eqMock1 }),
      })

      const result = await removeParticipant({ groupId: "group-999", uid: "user-456" })
      expect(result?.serverError).toBeUndefined()
      expect(eqMock1).toHaveBeenCalledWith("uid", "user-456")
      expect(eqMock2).toHaveBeenCalledWith("group_id", "group-999")
    })

    it("searchNoParticipants searches users matching search filter", async () => {
      const sampleUsers = [{ id: "u1", full_name: "Alice Bob" }]
      mockSupabase.from.mockReturnValue({
        select: mock().mockReturnValue({
          filter: mock().mockReturnValue({
            limit: mock().mockResolvedValue({ data: sampleUsers, error: null }),
          }),
        }),
      })

      const result = await searchNoParticipants({ groupId: "group-123", search: "Alice" })
      expect(result?.data?.searchUsers).toEqual(sampleUsers as any)
      expect(result?.serverError).toBeUndefined()
    })
  })

  describe("Group Message mutations", () => {
    it("deleteMessage removes message authored by user", async () => {
      const messageId = "123e4567-e89b-12d3-a456-426614174000"
      const eqMock2 = mock().mockResolvedValue({ error: null })
      const eqMock1 = mock().mockReturnValue({ eq: eqMock2 })
      mockSupabase.from.mockReturnValue({
        delete: mock().mockReturnValue({ eq: eqMock1 }),
      })

      const result = await deleteMessage({ messageId })
      expect(result?.serverError).toBeUndefined()
      expect(eqMock1).toHaveBeenCalledWith("id", messageId)
      expect(eqMock2).toHaveBeenCalledWith("uid", "user-123")
    })

    it("editMessage updates message authored by user", async () => {
      const messageId = "123e4567-e89b-12d3-a456-426614174000"
      const eqMock2 = mock().mockResolvedValue({ error: null })
      const eqMock1 = mock().mockReturnValue({ eq: eqMock2 })
      mockSupabase.from.mockReturnValue({
        update: mock().mockReturnValue({ eq: eqMock1 }),
      })

      const boundEditMessage = editMessage.bind(null, messageId)
      const result = await boundEditMessage({
        message: "Updated content",
      })

      expect(result?.serverError).toBeUndefined()
      expect(eqMock1).toHaveBeenCalledWith("id", messageId)
      expect(eqMock2).toHaveBeenCalledWith("uid", "user-123")
    })
  })

  describe("Post mutations", () => {
    it("createPost creates post when user is allowed to post", async () => {
      mockSupabase.rpc.mockReturnValue({
        throwOnError: mock().mockResolvedValue({ data: true }),
      })
      mockSupabase.from.mockReturnValue({
        insert: mock().mockReturnValue({
          throwOnError: mock().mockResolvedValue({ error: null }),
        }),
      })

      const result = await createPost({ description: "Hello world post" })
      expect(result?.serverError).toBeUndefined()
    })

    it("createPost returns RATE_LIMITED when user cannot post due to cooldown", async () => {
      mockSupabase.rpc.mockReturnValue({
        throwOnError: mock().mockResolvedValue({ data: false }),
      })

      const result = await createPost({ description: "Spam post" })
      const serverError = result?.serverError as AppServerError
      expect(serverError?.code).toBe("RATE_LIMITED")
    })

    it("deletePost deletes post by ID", async () => {
      mockSupabase.from.mockReturnValue({
        delete: mock().mockReturnValue({
          eq: mock().mockReturnValue({
            throwOnError: mock().mockResolvedValue({ error: null }),
          }),
        }),
      })

      const result = await deletePost({ id: "post-1" })
      expect(result?.serverError).toBeUndefined()
    })
  })

  describe("Event mutations", () => {
    it("createEvent inserts calendar event with parsed payload", async () => {
      mockSupabase.from.mockReturnValue({
        insert: mock().mockResolvedValue({ error: null }),
      })

      const fromDate = new Date("2026-09-01T10:00:00Z")
      const toDate = new Date("2026-09-01T12:00:00Z")

      const result = await createEvent({
        title: "Community Meetup",
        description: "Great event",
        coverImage: "https://example.com/event.png",
        content: "# Description",
        fromDate,
        toDate,
        locationId: "42",
        otherData: [],
      })

      expect(result?.serverError).toBeUndefined()
      expect(mockSupabase.from).toHaveBeenCalledWith("calendar_events")
    })

    it("createEvent returns OPERATION_FAILED on DB error", async () => {
      mockSupabase.from.mockReturnValue({
        insert: mock().mockResolvedValue({ error: new Error("Insert failed") }),
      })

      const fromDate = new Date("2026-09-01T10:00:00Z")
      const toDate = new Date("2026-09-01T12:00:00Z")

      const result = await createEvent({
        title: "Community Meetup",
        description: "Great event",
        coverImage: "https://example.com/event.png",
        content: "# Description",
        fromDate,
        toDate,
        locationId: "42",
        otherData: [],
      })

      const serverError = result?.serverError as AppServerError
      expect(serverError?.code).toBe("OPERATION_FAILED")
      expect(serverError?.message).toBe("Failed to create event")
    })
  })

  describe("News mutations", () => {
    it("createNews creates article and returns ID", async () => {
      mockSupabase.from.mockReturnValue({
        insert: mock().mockReturnValue({
          select: mock().mockReturnValue({
            single: mock().mockResolvedValue({ data: { id: "news-101" }, error: null }),
          }),
        }),
      })

      const result = await createNews({
        title: "Community News",
        description: "Important update",
        imageUrl: "https://example.com/news.png",
        content: "Here is the full story...",
      })

      expect(result?.serverError).toBeUndefined()
    })
  })

  describe("Location mutations", () => {
    it("createLocation creates location record", async () => {
      mockSupabase.from.mockReturnValue({
        insert: mock().mockResolvedValue({ error: null }),
      })

      const result = await createLocation({
        locationName: "Town Hall",
        address: "Main Square 1",
        point: "POINT(0 0)",
      })

      expect(result?.serverError).toBeUndefined()
    })
  })

  describe("Auth actions", () => {
    it("signInAction signs in user with credentials", async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: fakeUser },
        error: null,
      })

      const result = await signInAction({
        email: "user@example.com",
        password: "securepassword123",
      })

      expect(result?.serverError).toBeUndefined()
    })

    it("signInAction returns OPERATION_FAILED on invalid credentials", async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: {},
        error: new Error("Invalid login credentials"),
      })

      const result = await signInAction({
        email: "user@example.com",
        password: "wrongpassword",
      })

      const serverError = result?.serverError as AppServerError
      expect(serverError?.code).toBe("OPERATION_FAILED")
      expect(serverError?.message).toBe("Invalid email or password")
    })

    it("signUpAction returns validation error if username already exists", async () => {
      mockSupabase.from.mockReturnValue({
        select: mock().mockReturnValue({
          eq: mock().mockReturnValue({
            single: mock().mockResolvedValue({ data: { id: "existing-user" }, error: null }),
          }),
        }),
      })

      const result = await signUpAction({
        username: "existing_user",
        fullname: "Existing User",
        email: "new@example.com",
        password: "password123",
      })

      expect(result?.serverError).toBeUndefined()
      expect(result?.validationErrors?.username?._errors).toContain("Username already exists")
    })

    it("forgotPasswordAction sends reset email", async () => {
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
        data: {},
        error: null,
      })

      const result = await forgotPasswordAction({
        email: "user@example.com",
      })

      expect(result?.serverError).toBeUndefined()
    })

    it("resetPasswordAction updates user password", async () => {
      mockSupabase.auth.updateUser.mockResolvedValue({
        data: { user: fakeUser },
        error: null,
      })

      const result = await resetPasswordAction({
        password: "newsecurepassword123",
        confirmPassword: "newsecurepassword123",
      })

      expect(result?.serverError).toBeUndefined()
    })
  })
})
