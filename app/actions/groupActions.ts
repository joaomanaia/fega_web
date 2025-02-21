"use server"

import { createClient } from "@/lib/supabase/server"
// TODO: Change the this actions to the new folder

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import * as z from "zod"

const editGroupSchema = z.object({
  groupName: z.string().min(1, "Group name is required").max(50, "Group name is too long"),
  iconUrl: z.string().url(),
})

export async function editGroup(groupId: string, formData: FormData) {
  if (!groupId) {
    console.log("Group ID not found")
    throw new Error("Group ID not found")
  }

  const parsed = editGroupSchema.parse({
    groupName: formData.get("groupName"),
    iconUrl: formData.get("iconUrl"),
  })

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    console.log("User not found")
    throw new Error("User not found")
  }

  const { error } = await supabase
    .from("groups")
    .update({
      name: parsed.groupName,
      icon_url: parsed.iconUrl,
    })
    .eq("id", groupId)

  if (error) {
    console.log(error)
    throw new Error(error.message)
  }

  revalidatePath("/groups")
}

export async function exitGroup(groupId: string) {
  if (!groupId) {
    console.log("Group ID not found")
    throw new Error("Group ID not found")
  }

  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    console.log("Session not found")
    throw new Error("Session not found")
  }

  const { error } = await supabase
    .from("group_participants")
    .delete()
    .eq("uid", session.user.id)
    .eq("group_id", groupId)

  if (error) {
    console.log(error)
    throw new Error(error.message)
  }

  redirect("/")
}

export async function removeParticipant(uid: string, groupId: string) {
  if (!groupId) {
    console.log("Group ID not found")
    throw new Error("Group ID not found")
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from("group_participants")
    .delete()
    .eq("uid", uid)
    .eq("group_id", groupId)

  if (error) {
    console.log(error)
    throw new Error(error.message)
  }

  return revalidatePath(`/group/${groupId}/info`)
}

const GROUP_PARTICIPANTS_LIMIT = 16

export async function addParticipant(uid: string, groupId: string) {
  if (!groupId) {
    console.log("Group ID not found")
    throw new Error("Group ID not found")
  }

  const supabase = await createClient()

  // Check if the group has reached the limit of participants
  const { count, error: groupParticipantsError } = await supabase
    .from("group_participants")
    .select("uid", { count: "exact", head: true })
    .eq("group_id", groupId)

  if (groupParticipantsError) {
    throw new Error(groupParticipantsError.message)
  }

  if (count === null) {
    throw new Error("Failed to count group participants")
  }

  if (count >= GROUP_PARTICIPANTS_LIMIT) {
    throw new Error("Group has reached the limit of participants")
  }

  const { error } = await supabase.from("group_participants").upsert({
    uid: uid,
    group_id: groupId,
  })

  if (error) {
    console.log(error)
    throw new Error(error.message)
  }

  return revalidatePath(`/group/${groupId}/info`)
}

export async function searchNoParticipants(prevState: any, formData: FormData) {
  const groupId = formData.get("group_id") as string

  if (!groupId) {
    console.log("Group ID not found")
    throw new Error("Group ID not found")
  }

  const search = formData.get("search") as string

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .filter("full_name", "ilike", `%${search}%`)
    .limit(10)

  if (error) {
    console.log(error)
    throw new Error(error.message)
  }

  return {
    searchUsers: data ?? [],
  }
}

export const deleteGroup = async (groupId: string) => {
  if (!groupId) {
    throw new Error("Group ID not found")
  }

  const supabase = await createClient()

  const { error } = await supabase.from("groups").delete().eq("id", groupId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/groups")
  revalidatePath("/groups", "layout")
  redirect("/groups")
}
