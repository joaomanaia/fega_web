"use server"

import { revalidatePath } from "next/cache"
import { getLocale } from "next-intl/server"
import { redirect } from "@/i18n/navigation"
import { ActionError, authActionClient } from "@/lib/safe-action"
import {
  addParticipantSchema,
  createGroupSchema,
  deleteGroupSchema,
  editGroupSchema,
  exitGroupSchema,
  removeParticipantSchema,
  searchNoParticipantsSchema,
} from "@/lib/schemas/group-schemas"

const GROUP_PARTICIPANTS_LIMIT = 16

export const createGroup = authActionClient
  .metadata({ actionName: "createGroup" })
  .inputSchema(createGroupSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { supabase, uid } = ctx
    const { group_name, group_avatar } = parsedInput

    const { data, error } = await supabase
      .from("groups")
      .insert({
        name: group_name,
        icon_url: group_avatar || null,
        created_by: uid,
      })
      .select("id")
      .single()

    if (error || !data) {
      throw new ActionError("Failed to create group", { cause: error })
    }

    revalidatePath("/groups")
    revalidatePath("/groups", "layout")

    return data.id
  })

export const editGroup = authActionClient
  .metadata({ actionName: "editGroup" })
  .inputSchema(editGroupSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { supabase } = ctx
    const { groupId, groupName, iconUrl } = parsedInput

    const { error } = await supabase
      .from("groups")
      .update({
        name: groupName,
        icon_url: iconUrl || null,
      })
      .eq("id", groupId)

    if (error) {
      throw new ActionError(error.message, { cause: error })
    }

    revalidatePath("/groups")
    revalidatePath(`/groups/${groupId}`)
  })

export const exitGroup = authActionClient
  .metadata({ actionName: "exitGroup" })
  .inputSchema(exitGroupSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { supabase, uid } = ctx
    const { groupId } = parsedInput

    const { error } = await supabase
      .from("group_participants")
      .delete()
      .eq("uid", uid)
      .eq("group_id", groupId)

    if (error) {
      throw new ActionError(error.message, { cause: error })
    }

    revalidatePath("/groups")
    redirect({ href: "/", locale: await getLocale() })
  })

export const removeParticipant = authActionClient
  .metadata({ actionName: "removeParticipant" })
  .inputSchema(removeParticipantSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { supabase } = ctx
    const { groupId, uid } = parsedInput

    const { error } = await supabase
      .from("group_participants")
      .delete()
      .eq("uid", uid)
      .eq("group_id", groupId)

    if (error) {
      throw new ActionError(error.message, { cause: error })
    }

    revalidatePath(`/groups/${groupId}/info`)
  })

export const addParticipant = authActionClient
  .metadata({ actionName: "addParticipant" })
  .inputSchema(addParticipantSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { supabase } = ctx
    const { groupId, uid } = parsedInput

    // Check if the group has reached the limit of participants
    const { count, error: groupParticipantsError } = await supabase
      .from("group_participants")
      .select("uid", { count: "exact", head: true })
      .eq("group_id", groupId)

    if (groupParticipantsError) {
      throw new ActionError(groupParticipantsError.message, { cause: groupParticipantsError })
    }

    if (count === null) {
      throw new ActionError("Failed to count group participants")
    }

    if (count >= GROUP_PARTICIPANTS_LIMIT) {
      throw new ActionError("Group has reached the limit of participants")
    }

    const { error } = await supabase.from("group_participants").upsert({
      uid: uid,
      group_id: groupId,
    })

    if (error) {
      throw new ActionError(error.message, { cause: error })
    }

    revalidatePath(`/groups/${groupId}/info`)
  })

export const searchNoParticipants = authActionClient
  .metadata({ actionName: "searchNoParticipants" })
  .inputSchema(searchNoParticipantsSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { supabase } = ctx
    const { search } = parsedInput

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .filter("full_name", "ilike", `%${search}%`)
      .limit(10)

    if (error) {
      throw new ActionError(error.message, { cause: error })
    }

    return {
      searchUsers: data ?? [],
    }
  })

export const deleteGroup = authActionClient
  .metadata({ actionName: "deleteGroup" })
  .inputSchema(deleteGroupSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { supabase } = ctx
    const { groupId } = parsedInput

    const { error } = await supabase.from("groups").delete().eq("id", groupId)

    if (error) {
      throw new ActionError(error.message, { cause: error })
    }

    revalidatePath("/groups")
    revalidatePath("/groups", "layout")
    redirect({ href: "/groups", locale: await getLocale() })
  })

