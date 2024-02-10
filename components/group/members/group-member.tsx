import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVerticalIcon } from "lucide-react"
import Link from "next/link"
import { RemoveMemberButton } from "./remove-member-button"

interface GroupMemberProps {
  groupId: string
  uid: string
  full_name: string
  avatar_url: string
  type: "add" | "view"
  localUid: string
}

export const GroupMember: React.FC<GroupMemberProps> = ({
  groupId,
  uid,
  full_name,
  avatar_url,
  localUid,
}) => {
  return (
    <li className="group flex w-full items-center py-4 first:pt-0 last:pb-0">
      <Avatar>
        <AvatarImage src={avatar_url} />
        <AvatarFallback>{full_name}</AvatarFallback>
      </Avatar>

      <span className="font-semibold mx-4 flex-1">{full_name}</span>

      <MemberOptionsMenu
        groupId={groupId}
        uid={uid}
        userName={full_name}
        localUid={localUid}
        isLocalAdmin
      />
    </li>
  )
}

interface MemberOptionsMenuProps {
  groupId: string
  uid: string
  userName: string
  localUid: string
  isLocalAdmin: boolean
}

const MemberOptionsMenu: React.FC<MemberOptionsMenuProps> = ({
  groupId,
  uid,
  userName,
  localUid,
  isLocalAdmin,
}) => {
  const isLocalUser = uid === localUid

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-inherit">
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/${uid}`}>View Profile</Link>
        </DropdownMenuItem>
        {!isLocalUser && <DropdownMenuItem disabled>Message</DropdownMenuItem>}
        {isLocalAdmin && !isLocalUser && (
          <>
            <DropdownMenuSeparator />
            <RemoveMemberButton uid={uid} userName={userName} groupId={groupId} />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
