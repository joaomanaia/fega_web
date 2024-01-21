import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EditGroupFormType } from "../../page"
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
      <Avatar>
        <AvatarImage src={avatar_url} />
        <AvatarFallback>{full_name}</AvatarFallback>
      </Avatar>

      <span className="font-semibold mx-4">{full_name}</span>
      {formType === "edit" && uid !== localUid && (
        <AddRemoveParticipantButton uid={uid ?? ""} type={type} />
      )}
    </>
  )
}
