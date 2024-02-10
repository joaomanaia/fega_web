"use server"

import { createServerActionClient } from "@/supabase"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import * as z from "zod"

const saveGroupSchema = z.object({
  groupName: z.string().min(1).max(50),
  iconUrl: z.string().url(),
})

export async function saveGroup(formData: FormData) {
  const groupId = formData.get("group_id")

  if (!groupId) {
    console.log("Group ID not found")
    throw new Error("Group ID not found")
  }

  const parsed = saveGroupSchema.parse({
    groupName: formData.get("group_name"),
    iconUrl: formData.get("icon_url"),
  })

  const supabase = createServerActionClient()

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
  return redirect(`/groups/${groupId}`)
}

export async function exitGroup(formData: FormData) {
  const groupId = formData.get("group_id")

  if (!groupId) {
    console.log("Group ID not found")
    throw new Error("Group ID not found")
  }

  const supabase = createServerActionClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    console.log("User not found")
    throw new Error("User not found")
  }

  const { error } = await supabase
    .from("group_participants")
    .delete()
    .eq("uid", user.id)
    .eq("group_id", groupId)

  if (error) {
    console.log(error)
    throw new Error(error.message)
  }

  return redirect("/")
}

export async function removeParticipant(uid: string, groupId: string) {
  if (!groupId) {
    console.log("Group ID not found")
    throw new Error("Group ID not found")
  }

  const supabase = createServerActionClient()

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

export async function addParticipant(uid: string, groupId: string) {
  if (!groupId) {
    console.log("Group ID not found")
    throw new Error("Group ID not found")
  }

  const supabase = createServerActionClient()

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

  const supabase = createServerActionClient()

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

const createGroupFormSchema = z.object({
  group_name: z
    .string()
    .min(1, "Group name must be at least 1 characters long")
    .max(255, "Group name must be at most 255 characters long"),
  group_avatar: z.string().url().optional().or(z.literal("")),
})

export const createGroup = async (formData: FormData) => {
  console.log("Creating group")

  try {
    console.log("Parsing data")

    const parsed = createGroupFormSchema.parse({
      group_name: formData.get("group_name"),
      group_avatar: formData.get("group_avatar"),
    })

    const supabase = createServerActionClient()

    const { error } = await supabase.from("groups").insert({
      name: parsed.group_name,
      icon_url: parsed.group_avatar,
    })

    if (error) {
      console.error(error)
      return
    }

    revalidatePath("/groups")
    redirect("/groups")
  } catch (err) {
    if (err instanceof z.ZodError) {
      if (err.isEmpty) {
        return {
          errorMessage: "Something went wrong",
        }
      }
    } else if (err instanceof Error) {
      return {
        errorMessage: err.message,
      }
    } else {
      return {
        errorMessage: "Something went wrong",
      }
    }
  }
}
