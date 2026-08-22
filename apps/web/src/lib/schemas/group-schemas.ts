import * as z from "zod"

export const createGroupSchema = z.object({
  group_name: z.string().min(1, "Group name is required").max(50, "Group name is too long"),
  group_avatar: z.url().optional().or(z.literal("")),
})

export type CreateGroupSchemaValues = z.infer<typeof createGroupSchema>

export const editGroupSchema = z.object({
  groupId: z.string().min(1),
  groupName: z.string().min(1, "Group name is required").max(50, "Group name is too long"),
  iconUrl: z.url().optional().or(z.literal("")),
})

export type EditGroupSchemaValues = z.infer<typeof editGroupSchema>

export const exitGroupSchema = z.object({
  groupId: z.string().min(1),
})

export type ExitGroupSchemaValues = z.infer<typeof exitGroupSchema>

export const deleteGroupSchema = z.object({
  groupId: z.string().min(1),
})

export type DeleteGroupSchemaValues = z.infer<typeof deleteGroupSchema>

export const addParticipantSchema = z.object({
  groupId: z.string().min(1),
  uid: z.string().min(1),
})

export type AddParticipantSchemaValues = z.infer<typeof addParticipantSchema>

export const removeParticipantSchema = z.object({
  groupId: z.string().min(1),
  uid: z.string().min(1),
})

export type RemoveParticipantSchemaValues = z.infer<typeof removeParticipantSchema>

export const searchNoParticipantsSchema = z.object({
  groupId: z.string().min(1),
  search: z.string().default(""),
})

export type SearchNoParticipantsSchemaValues = z.infer<typeof searchNoParticipantsSchema>

