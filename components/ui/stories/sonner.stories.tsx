import type { Meta, StoryObj } from "@storybook/nextjs"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"

const toastTypes = [
  "default",
  "success",
  "info",
  "warning",
  "error",
  "custom",
  "message",
  "promise",
  "dismiss",
  "loading",
] as const

type Args = React.ComponentProps<typeof Toaster> & {
  toastType: (typeof toastTypes)[number]
}

const meta = {
  title: "Components/ui/Sonner",
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
      return toast.success("Success Toast")
    case "info":
      return toast.info("Info Toast")
    case "warning":
      return toast.warning("Warning Toast")
    case "error":
      return toast.error("Error Toast")
    case "custom":
      return toast.custom(() => <div>Custom Toast</div>)
    case "message":
      return toast.message("Message Toast")
    case "promise":
      return toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
        loading: "Loading...",
        success: "Loaded!",
        error: "Error loading",
      })
    case "dismiss":
      return toast.dismiss()
    case "loading":
      return toast.loading("Loading...")
    default:
      return toast("Event has been created", {
        description: "Sunday, December 03, 2023 at 9:00 AM",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      })
  }
}
