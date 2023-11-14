import { EditGroupFormType } from "../../page"
import Avatar from "@/app/(core)/components/m3/avatar"
import { AddRemoveParticipantButton } from "../AddRemoveParticipantButton"

interface ParticipantUserProps {
  uid: string
  full_name: string
  avatar_url: string
  type: "add" | "remove"
  formType: EditGroupFormType
  localUid: string
}

export const ParticipantUser: React.FC<ParticipantUserProps> = ({
  uid,
  full_name,
  avatar_url,
  type,
  formType,
  localUid,
}) => {
  return (
    <>
      <Avatar photoUrl={avatar_url} name={full_name} size={35} />
      <span className="font-semibold mx-4">{full_name}</span>
      {formType === "edit" && uid !== localUid && (
        <AddRemoveParticipantButton uid={uid ?? ""} type={type} />
      )}
    </>
  )
}
