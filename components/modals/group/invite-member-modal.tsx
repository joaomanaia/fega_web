"use client"

import { useModal } from "@/hooks/use-modal-store"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import React, { useState } from "react"
import UserType from "@/types/UserType"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/types/database.types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { addParticipant } from "@/app/actions/groupActions"
import { toast } from "sonner"
import { SubmitButton } from "@/app/(core)/components/SubmitButton"

export const InviteMemberModal: React.FC = () => {
  const { isOpen, onClose, type, data } = useModal()

  const isModalOpen = isOpen && type === "group-invite"
  const { group } = data

  if (!group || !group.id) return null

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Invite Member</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col w-full gap-4 py-4">
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

const formSchema = z.object({
  name: z.string().min(1).max(255),
})

export const SearchMemberForm: React.FC<SearchMemberFormProps> = ({ groupId, groupName }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  const [isSearched, setIsSearched] = useState(false)
  const [searchedUsers, setSearchedUsers] = useState<UserType[]>([])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const parsed = formSchema.parse(values)

      const supabase = createClientComponentClient<Database>()

      const { data: currentParticipants, error: currentParticipantsError } = await supabase
        .from("group_participants")
        .select("uid")
        .eq("group_id", groupId)

      if (currentParticipantsError) {
        toast.error("Failed to search for users")
        throw currentParticipantsError
      }

      const currentParticipantsIds = currentParticipants?.map((participant) => participant.uid)

      const { data: users, error } = await supabase
        .from("users")
        .select("*")
        .textSearch("full_name", parsed.name)
        .not("id", "in", `(${currentParticipantsIds?.join(",")})`)
        .limit(5)

      if (error) {
        toast.error("Failed to search for users")
        throw error
      }

      setSearchedUsers(users)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSearched(true)
    }
  }

  return (
    <>
      <p>
        Search for a user to invite to <span className="font-bold">{groupName}</span>
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="User name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button variant="default" type="submit" className="mt-8">
            Search
          </Button>
        </form>
      </Form>

      {isSearched && (
        <>
          {searchedUsers.length > 0 ? (
            <>
              <p className="mt-2">Users found:</p>
              <ul className="flex flex-col w-full divide-y divide-surfaceVariant bg-surfaceVariant/[0.28] rounded-2xl p-4">
                {searchedUsers.map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center gap-4 w-full py-4 first:pt-0 last:pb-0"
                  >
                    <InviteUser groupId={groupId} user={user} />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-2">No users found</p>
          )}
        </>
      )}
    </>
  )
}

interface InviteUserProps {
  groupId: string
  user: UserType
}

export const InviteUser: React.FC<InviteUserProps> = ({ groupId, user }) => {
  const addParticipantWithUid = addParticipant.bind(null, user.id, groupId)

  const { onClose } = useModal()

  return (
    <>
      <Avatar>
        <AvatarImage src={user.avatar_url ?? undefined} alt={user.full_name ?? "Unknown"} />
        <AvatarFallback>{user.full_name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <p>{user.full_name}</p>
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
