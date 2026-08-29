import { beforeEach, describe, expect, it, mock, type Mock } from "bun:test"
import { createEvent } from "@/app/actions/calendarEventActions"
import { createGroup, editGroup, exitGroup } from "@/app/actions/groupActions"
import { handleVote } from "@/app/actions/post/voteActions"
import { removeUserAvatar, updateProfileAction, updateUserEmail } from "@/app/actions/userActions"
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
      auth: {
        getClaims: mock().mockResolvedValue({ data: { claims: fakeUser }, error: null }),
        updateUser: mock().mockResolvedValue({ data: { user: fakeUser }, error: null }),
        refreshSession: mock().mockResolvedValue({}),
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

    it("updateProfileAction returns friendly error on unique constraint conflict (23505)", async () => {
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

      expect(result?.serverError).toBe("Username is already taken")
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

    it("updateUserEmail validates email change and rejects matching current email", async () => {
      const result = await updateUserEmail({
        email: "user@example.com",
        confirmEmail: "user@example.com",
      })

      expect(result?.serverError).toBe("Email is the same as the current email")
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
  })

  describe("Post vote mutations", () => {
    it("handleVote registers upvote when user has not voted yet", async () => {
      mockSupabase.from.mockReturnValue({
        select: mock().mockReturnValue({
          eq: mock().mockReturnValue({
            eq: mock().mockReturnValue({
              single: mock().mockResolvedValue({ data: null, error: null }),
            }),
          }),
        }),
        upsert: mock().mockReturnValue({
          select: mock().mockReturnValue({
            single: mock().mockResolvedValue({
              data: { post_id: "post-1", vote_type: "up", uid: "user-123", created_at: new Date().toISOString() },
              error: null,
            }),
          }),
        }),
      })

      const result = await handleVote({
        postId: "post-1",
        voteType: "up",
      })

      expect(result?.data).toEqual({
        created_at: expect.any(String),
        post_id: "post-1",
        vote_type: "up",
        uid: "user-123",
      })
      expect(result?.serverError).toBeUndefined()
    })

    it("handleVote toggles vote off (sets null) when voting same type again", async () => {
      let upsertPayload: any = null
      mockSupabase.from.mockReturnValue({
        select: mock().mockReturnValue({
          eq: mock().mockReturnValue({
            eq: mock().mockReturnValue({
              single: mock().mockResolvedValue({ data: { vote_type: "up" }, error: null }),
            }),
          }),
        }),
        upsert: mock().mockImplementation((payload) => {
          upsertPayload = payload
          return {
            select: mock().mockReturnValue({
              single: mock().mockResolvedValue({
                data: { post_id: "post-1", vote_type: null, uid: "user-123" },
                error: null,
              }),
            }),
          }
        }),
      })

      const result = await handleVote({
        postId: "post-1",
        voteType: "up",
      })

      expect(upsertPayload.vote_type).toBeNull()
      expect(result?.data?.vote_type).toBeNull()
    })
  })
})
