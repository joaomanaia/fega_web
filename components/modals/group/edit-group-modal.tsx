"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useModal } from "@/hooks/use-modal-store"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { editGroup } from "@/app/actions/groupActions"
import { SubmitButton } from "@/components/submit-button"
import { toast } from "sonner"

export const EditGroupModal: React.FC = () => {
  const { isOpen, onClose, type, data } = useModal()

  const isModalOpen = isOpen && type === "edit-group"
  const { group } = data

  if (!group || !group.id) return null

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Edit Group</DialogTitle>
        </DialogHeader>
        <EditGroupForm groupId={group.id} groupName={group.name} iconUrl={group.icon_url} />
      </DialogContent>
    </Dialog>
  )
}

interface EditGroupFormProps {
  groupId: string
  groupName?: string | null
  iconUrl?: string | null
}

const formSchema = z.object({
  groupName: z.string().min(1, "Group name is required").max(50, "Group name is too long"),
  iconUrl: z.string().url(),
})

const EditGroupForm: React.FC<EditGroupFormProps> = ({ groupId, groupName, iconUrl }) => {
  const editGroupWithId = editGroup.bind(null, groupId)

  const { onClose } = useModal()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupName: groupName ?? "",
      iconUrl: iconUrl ?? "",
    },
  })

  return (
    <>
      <Form {...form}>
        <form
          action={async (formData: FormData) => {
            // Check if the fields are the same as the current group
            if (form.getValues().groupName === groupName && form.getValues().iconUrl === iconUrl) {
              toast.error("No changes made")
              return
            }

            try {
              await editGroupWithId(formData)
            } catch (error) {
              toast.error("Failed to edit group")
            } finally {
              onClose()
              toast.success("Group edited")
            }
          }}
          className="flex flex-col w-full gap-4 py-4"
        >
          <FormField
            control={form.control}
            name="groupName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group name</FormLabel>
                <FormControl>
                  <Input placeholder="Group name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Avatar className="mt-8">
              <AvatarImage src={form.watch("iconUrl")} />
            </Avatar>

            <FormField
              control={form.control}
              name="iconUrl"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Icon URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Icon URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <SubmitButton>Submit</SubmitButton>
        </form>
      </Form>
    </>
  )
}
