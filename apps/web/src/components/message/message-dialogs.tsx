"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { toast } from "@workspace/ui/components/toast"
import { Controller } from "react-hook-form"
import * as z from "zod"
import { editMessage } from "@/app/actions/group/messageActions"
import { SubmitButton } from "@/components/submit-button"
import { useMessageOptionsStore } from "@/hooks/use-message-options"

export function MessageActionDialogs() {
  const { dialog, closeDialog } = useMessageOptionsStore()

  return (
    <>
      {dialog?.type === "edit" && (
        <EditMessageDialog
          key={dialog.messageId}
          messageId={dialog.messageId}
          currentContent={dialog.content}
          open={true}
          onOpenChange={(open) => {
            if (!open) closeDialog()
          }}
        />
      )}
    </>
  )
}

const editSchema = z.object({
  message: z.string().trim().min(1).max(500),
})

type EditMessageDialogProps = {
  messageId: string
  currentContent: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

function EditMessageDialog({
  messageId,
  currentContent,
  open,
  onOpenChange,
}: EditMessageDialogProps) {
  const bindEditMessage = editMessage.bind(null, messageId)
  const { form, action, handleSubmitWithAction, resetFormAndAction } = useHookFormAction(
    bindEditMessage,
    zodResolver(editSchema),
    {
      formProps: {
        defaultValues: {
          message: currentContent,
        },
      },
      actionProps: {
        onSuccess: () => {
          toast.add({ type: "success", description: "Message updated" })
          resetFormAndAction()
          onOpenChange(false)
        },
        onError: ({ error }) => {
          toast.add({ type: "error", description: error.serverError?.message })
        },
      },
    },
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Message</DialogTitle>
        </DialogHeader>

        <form id="edit-message-form" onSubmit={handleSubmitWithAction}>
          <FieldGroup>
            <Controller
              name="message"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="message">Message</FieldLabel>
                  <Input
                    required
                    maxLength={500}
                    id="message"
                    className="border-none"
                    placeholder="Message"
                    {...field}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose disabled={action.isExecuting} render={<Button variant="ghost" />}>
            Cancel
          </DialogClose>
          <SubmitButton
            disabled={!form.formState.isDirty || action.isExecuting}
            variant="ghost"
            form="edit-message-form"
          >
            Save
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
