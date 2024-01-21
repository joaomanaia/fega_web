"use client"

import { searchNoParticipants } from "@/app/actions/groupActions"
import UserType from "@/types/UserType"
import { useFormState, useFormStatus } from "react-dom"
import { ParticipantUser } from "./participants/ParticipantUser"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface AddGroupParticipantsProps {
  localUid: string
}

const initialState: {
  searchUsers: UserType[]
} = {
  searchUsers: [],
}

export const AddGroupParticipants: React.FC<AddGroupParticipantsProps> = ({ localUid }) => {
  const [state, formAction] = useFormState(searchNoParticipants, initialState)

  return (
    <div className="flex flex-col h-full">
      <Input
        className="mt-2"
        type="text"
        name="search"
        id="search"
        placeholder="Search user name"
      />
      <SearchButton formAction={formAction} />
      <div className="overflow-y-scroll">
        {state.searchUsers.map((user) => (
          <div key={user.id} className="flex w-full items-center my-2">
            <ParticipantUser
              uid={user.id ?? ""}
              full_name={user.full_name ?? ""}
              avatar_url={user.avatar_url ?? ""}
              type="add"
              formType="edit"
              localUid={localUid}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

interface SearchButtonProps {
  formAction: (payload: FormData) => void
}

const SearchButton: React.FC<SearchButtonProps> = ({ formAction }) => {
  const { pending } = useFormStatus()

  return (
    <button
      formAction={formAction}
      disabled={pending}
      className="w-full p-0 outline-none bg-transparent border-0"
    >
      <Button className="w-full my-2" disabled={pending} variant="accent">
        Search
      </Button>
    </button>
  )
}
