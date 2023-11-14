"use client"

import { GroupViewType } from "@/types/group/GroupType"
import { AvatarInput } from "./AvatarInput"
import { Input } from "@/app/(core)/components/CreatePostInput"
import { SubmitButton } from "@/app/(core)/components/SubmitButton"
import { EditGroupFormType } from "../page"
import { GroupParticipantsContainer } from "./GroupParticipantsContainer"
import { AddGroupParticipants } from "./AddGroupParticipants"
import { saveGroup } from "@/app/actions/groupActions"

interface EditGroupFormProps {
  group: GroupViewType
  localUid: string
  formType: EditGroupFormType
  children?: React.ReactNode
}

export const EditGroupForm: React.FC<EditGroupFormProps> = ({
  group,
  localUid,
  formType,
  children,
}) => {
  if (!group) return null
  if (!group.id) return null

  return (
    <form action={saveGroup} className="flex flex-col h-full w-full xl:w-1/2 2xl:w-1/3">
      <input type="text" value={group.id} name="group_id" hidden />
      <label htmlFor="name" className="my-2">
        Icon Url
      </label>
      <div className="flex items-center justify-center space-x-4">
        <AvatarInput
          defaultValue={group.icon_url ?? ""}
          name={group.name}
          inputInvisible={formType === "info"}
        />
      </div>
      <label htmlFor="group_name" className="mt-8 mb-2">
        Group Name
      </label>
      <Input
        defaultValue={group.name ?? ""}
        required
        type="text"
        name="group_name"
        id="group_name"
        placeholder="Group Name"
        readOnly={formType === "info"}
      />

      <GroupParticipantsContainer
        isGroupOwner={group.is_owner ?? false}
        addParticipantChildren={<AddGroupParticipants localUid={localUid} />}
        initialMode="view"
      >
        {children}
      </GroupParticipantsContainer>

      {formType === "edit" && <SubmitButton className="mt-8" text="Save"></SubmitButton>}
      {!group.is_owner && <SubmitButton className="mt-8" text="Leave Group" />}
    </form>
  )
}
