"use client"

import React from "react"
import { SearchIcon } from "lucide-react"
import { toast } from "sonner"
import { useDebounceValue } from "usehooks-ts"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { addParticipant } from "@/app/actions/groupActions"
import { UserAvatar } from "@/app/components/user/user-avatar"
import { SubmitButton } from "@/components/submit-button"
import {
  useSearchUserExcludeGroup,
  type SearchUserResult,
} from "@/features/user/use-search-user-exclude-group"
import { useModal } from "@/hooks/use-modal-store"

export const InviteMemberModal: React.FC = () => {
  const { isOpen, onClose, data } = useModal("group-invite")

  const { group } = data

  if (!group || !group.id) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">Invite Member</DialogTitle>
        </DialogHeader>
        <div className="flex w-full flex-col gap-4 py-4">
          <SearchMemberForm groupId={group.id} groupName={group.name ?? "Unknown"} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface SearchMemberFormProps {
  groupId: string
  groupName: string
}

export const SearchMemberForm: React.FC<SearchMemberFormProps> = ({ groupId, groupName }) => {
  const [debouncedValue, setValue] = useDebounceValue("", 500)
  const {
    data: users,
    isLoading,
    isFetched,
  } = useSearchUserExcludeGroup(debouncedValue.trim(), groupId)

  const hasResults = Array.isArray(users) && users.length > 0
  const shouldSearch = debouncedValue.trim().length >= 2

  return (
    <>
      <p>
        Search for a user to invite to <span className="font-bold">{groupName}</span>
      </p>
      <div className="relative w-full">
        <div className="relative flex items-center gap-2">
          <SearchIcon className="text-muted-foreground absolute left-3 h-5 w-5" />
          <Input
            placeholder="Search by name or username..."
            defaultValue=""
            onChange={(e) => setValue(e.target.value)}
            className="pr-10 pl-10"
          />
          {isLoading && (
            <div className="absolute right-3">
              <Spinner className="h-4 w-4" />
            </div>
          )}
        </div>

        {isFetched && (
          <div className="mt-4">
            {!shouldSearch ? (
              <p className="text-muted-foreground text-sm">Type at least 2 characters to search</p>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Spinner className="h-8 w-8" />
              </div>
            ) : hasResults ? (
              <>
                <p className="text-muted-foreground mb-2 text-sm">Users found:</p>
                <ul className="divide-surface-variant bg-surface-variant/[0.28] flex w-full flex-col divide-y rounded-2xl p-4">
                  {users?.map((user) => (
                    <li
                      key={user.id}
                      className="flex w-full items-center gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <InviteUser groupId={groupId} user={user} />
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">No users found</p>
            )}
          </div>
        )}
      </div>
    </>
  )
}

interface InviteUserProps {
  groupId: string
  user: SearchUserResult
}

export const InviteUser: React.FC<InviteUserProps> = ({ groupId, user }) => {
  const addParticipantWithUid = addParticipant.bind(null, user.id, groupId)

  const { onClose } = useModal("group-invite")

  return (
    <>
      <UserAvatar src={user.avatar_url} alt={user.username} />
      <div>
        <p className="font-medium">{user.full_name}</p>
        <p className="text-muted-foreground text-sm">@{user.username}</p>
      </div>
      <SubmitButton
        onClick={async () => {
          try {
            await addParticipantWithUid()
            toast.success(`Invited ${user.full_name} to the group`)
          } catch (error) {
            if (error instanceof Error) {
              toast.error(error.message)
            } else {
              toast.error("Failed to invite user")
            }
          } finally {
            onClose()
          }
        }}
        variant="tonal"
        className="ml-auto"
      >
        Invite
      </SubmitButton>
    </>
  )
}
