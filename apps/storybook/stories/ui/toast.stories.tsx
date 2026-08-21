import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@workspace/ui/components/button"
import { toast, Toaster } from "@workspace/ui/components/toast"

const toastTypes = [
  "default",
  "success",
  "info",
  "warning",
  "error",
  "loading",
  "action",
  "promise",
] as const

type Args = React.ComponentProps<typeof Toaster> & {
  toastType: (typeof toastTypes)[number]
}

const meta = {
  title: "Components/ui/Toast",
  component: Toaster,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    toastType: {
      control: {
        type: "select",
      },
      options: toastTypes,
    },
  },
  render: (args) => (
    <>
      <Button variant="outline" onClick={() => showToastForType(args.toastType)}>
        Show Toast
      </Button>
    </>
  ),
} satisfies Meta<Args>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    toastType: "default",
  },
}

function showToastForType(type: Args["toastType"]) {
  switch (type) {
    case "success":
      return toast.add({ type, title: "Success Toast" })
    case "info":
      return toast.add({ type, title: "Info Toast" })
    case "warning":
      return toast.add({ type, title: "Warning Toast" })
    case "error":
      return toast.add({ type, title: "Error Toast" })
    case "action":
      const id = toast.add({
        title: "Event created",
        actionProps: {
          children: "Undo",
          onClick() {
            toast.close(id)
          },
        },
      })
      return
    case "promise":
      return toast.promise(
        new Promise<{ name: string }>((resolve) => {
          window.setTimeout(() => resolve({ name: "Event" }), 2000)
        }),
        {
          loading: "Creating event…",
          success: (data) => `${data.name} created.`,
          error: "Could not create event.",
        },
      )
    default:
      return toast.add({
        title: "Event has been created",
        description: "Sunday, December 03, 2023 at 9:00 AM",
      })
  }
}
