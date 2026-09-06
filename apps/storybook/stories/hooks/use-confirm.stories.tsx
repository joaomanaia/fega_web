import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Button } from "@workspace/ui/components/button"
import { Spinner } from "@workspace/ui/components/spinner"
import { toast } from "@workspace/ui/components/toast"
import { cn } from "@workspace/ui/lib/utils"
import {
  AlertTriangleIcon,
  HelpCircleIcon,
  InfoIcon,
  LogOutIcon,
  ShieldAlertIcon,
  Trash2Icon,
  type LucideIcon,
} from "lucide-react"
import { action } from "storybook/actions"
import { expect, userEvent, within } from "storybook/test"
import { useConfirm } from "@/hooks/use-confirm"

const iconOptions: Record<string, LucideIcon | undefined> = {
  None: undefined,
  AlertTriangle: AlertTriangleIcon,
  Trash2: Trash2Icon,
  LogOut: LogOutIcon,
  Info: InfoIcon,
  ShieldAlert: ShieldAlertIcon,
  HelpCircle: HelpCircleIcon,
}

interface ConfirmStoryArgs {
  title: string
  message: string
  inputTextToConfirm?: string
  confirmButtonContent?: string
  cancelButtonContent?: string
  hideCancelButton?: boolean
  variant?: "default" | "error"
  icon?: LucideIcon
  className?: string
  triggerButtonText?: string
  triggerVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost"
}

function ConfirmStoryWrapper(args: ConfirmStoryArgs) {
  const [ConfirmationDialog, confirm] = useConfirm()
  const [status, setStatus] = useState<"idle" | "awaiting" | "confirmed" | "canceled">("idle")

  const handleOpen = async () => {
    setStatus("awaiting")
    const result = await confirm()
    action("confirm:resolved")(result)

    if (result) {
      setStatus("confirmed")
      toast.add({
        type: "success",
        title: "Action Confirmed",
        description: "The confirmation promise resolved to true.",
      })
    } else {
      setStatus("canceled")
      toast.add({
        type: "info",
        title: "Action Canceled",
        description: "The confirmation promise resolved to false.",
      })
    }
  }

  return (
    <div className="border-border bg-card text-card-foreground flex w-full max-w-md flex-col items-center gap-4 rounded-xl border p-6 shadow-sm">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-base font-semibold">useConfirm Hook Demo</h3>
        <p className="text-muted-foreground text-xs">
          Click the trigger button below to launch the confirmation dialog and observe the promise
          resolution.
        </p>
      </div>

      <Button
        variant={args.variant === "error" ? "destructive" : (args.triggerVariant ?? "default")}
        onClick={handleOpen}
      >
        {args.triggerButtonText ??
          (args.variant === "error" ? "Perform Destructive Action" : "Open Confirmation")}
      </Button>

      <div className="border-border flex w-full items-center justify-between border-t pt-3 text-xs">
        <span className="text-muted-foreground">Resolution State:</span>
        <span
          data-testid="status-badge"
          className={cn(
            "rounded-md px-2 py-0.5 font-mono font-medium",
            status === "idle" && "bg-muted text-muted-foreground",
            status === "awaiting" && "bg-amber-500/15 text-amber-600 dark:text-amber-400",
            status === "confirmed" && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
            status === "canceled" && "bg-rose-500/15 text-rose-600 dark:text-rose-400",
          )}
        >
          {status === "idle" && "Idle (not triggered)"}
          {status === "awaiting" && "Awaiting dialog decision..."}
          {status === "confirmed" && "Resolved: true (Confirmed)"}
          {status === "canceled" && "Resolved: false (Canceled)"}
        </span>
      </div>

      <ConfirmationDialog
        title={args.title}
        message={args.message}
        inputTextToConfirm={args.inputTextToConfirm}
        confirmButtonContent={args.confirmButtonContent}
        cancelButtonContent={args.cancelButtonContent}
        hideCancelButton={args.hideCancelButton}
        variant={args.variant}
        className={args.className}
        icon={args.icon}
      />
    </div>
  )
}

const meta = {
  title: "Hooks/useConfirm",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A Promise-based confirmation dialog hook for asynchronous user confirmation flows.

### API Signature
\`\`\`tsx
const [ConfirmationDialog, confirm] = useConfirm()
\`\`\`

- **\`ConfirmationDialog\`**: A React component that must be rendered in your component tree. Takes dialog configuration props like \`title\`, \`message\`, \`variant\`, \`inputTextToConfirm\`, \`icon\`, etc.
- **\`confirm()\`**: An async function returning \`Promise<boolean>\`. Resolves to \`true\` if the user clicked confirm, or \`false\` if canceled or dismissed.
        `,
      },
    },
  },
  render: (args: ConfirmStoryArgs) => <ConfirmStoryWrapper {...args} />,
  argTypes: {
    title: {
      control: "text",
      description: "Dialog title heading",
    },
    message: {
      control: "text",
      description: "Dialog description body message",
    },
    variant: {
      control: "select",
      options: ["default", "error"],
      description: "Styling variant for standard or destructive / dangerous actions",
    },
    icon: {
      control: "select",
      options: Object.keys(iconOptions),
      mapping: iconOptions,
      description: "Header icon displayed centered above the dialog title",
    },
    inputTextToConfirm: {
      control: "text",
      description: "Required string the user must type exactly before the confirm button enables",
    },
    confirmButtonContent: {
      control: "text",
      description: "Custom label or element for the confirm button (defaults to 'Confirm')",
    },
    cancelButtonContent: {
      control: "text",
      description: "Custom label or element for the cancel button (defaults to 'Cancel')",
    },
    hideCancelButton: {
      control: "boolean",
      description: "Whether to hide the cancel button (forces confirmation or backdrop dismiss)",
    },
    triggerButtonText: {
      control: "text",
      description: "Label for the demo trigger button that invokes confirm()",
    },
    triggerVariant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost"],
      description: "Button variant for the demo trigger button",
    },
    className: {
      control: "text",
      description: "Custom CSS classes forwarded to DialogContent",
    },
  },
} satisfies Meta<ConfirmStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Standard confirmation dialog with default theme and affirmative/negative choices.
 */
export const Default: Story = {
  args: {
    title: "Confirm changes",
    message: "Are you sure you want to save these preferences to your account?",
    triggerButtonText: "Save Preferences",
    variant: "default",
  },
}

/**
 * Destructive confirmation dialog styled with the error theme and trash icon.
 */
export const Destructive: Story = {
  args: {
    title: "Delete Project",
    message:
      "This will permanently delete the project, all environments, and historical logs. This action cannot be undone.",
    confirmButtonContent: "Delete Project",
    cancelButtonContent: "Cancel",
    variant: "error",
    icon: Trash2Icon,
    triggerButtonText: "Delete Project",
  },
}

/**
 * Security-sensitive confirmation requiring the user to type an exact string before the confirm button is enabled.
 */
export const WithInputConfirmation: Story = {
  args: {
    title: "Delete Production Database",
    message:
      "This action is irreversible. All table schemas and rows will be permanently destroyed.",
    inputTextToConfirm: "delete-prod-db",
    confirmButtonContent: "Drop Database",
    variant: "error",
    icon: ShieldAlertIcon,
    triggerButtonText: "Delete Production Database",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const triggerBtn = canvas.getByRole("button", { name: /Delete Production Database/i })
    await userEvent.click(triggerBtn)

    // Base UI / Radix Dialog renders into a portal in document.body
    const body = within(document.body)
    const dialogTitle = await body.findByText("Delete Production Database")
    expect(dialogTitle).toBeInTheDocument()

    const confirmBtn = body.getByRole("button", { name: /Drop Database/i })
    // Disabled while input does not match
    expect(confirmBtn).toBeDisabled()

    const input = body.getByPlaceholderText("Type here")
    // Type partial string - should still be disabled
    await userEvent.type(input, "delete-prod")
    expect(confirmBtn).toBeDisabled()

    // Complete the exact string - should enable
    await userEvent.type(input, "-db")
    expect(confirmBtn).toBeEnabled()
  },
}

/**
 * Dialog with customized button labels for non-standard confirmation flows.
 */
export const CustomButtonLabels: Story = {
  args: {
    title: "Discard changes?",
    message:
      "You have uncommitted modifications in your current draft. Do you want to discard them?",
    confirmButtonContent: "Discard Draft",
    cancelButtonContent: "Keep Editing",
    variant: "default",
    icon: AlertTriangleIcon,
    triggerButtonText: "Navigate Away",
    triggerVariant: "outline",
  },
}

/**
 * Dialog without a cancel button, requiring explicit confirmation or backdrop dismiss.
 */
export const HideCancelButton: Story = {
  args: {
    title: "Session Expired",
    message:
      "Your session has timed out due to inactivity. Please log in again to continue your work.",
    confirmButtonContent: "Log In Again",
    hideCancelButton: true,
    variant: "default",
    icon: LogOutIcon,
    triggerButtonText: "Simulate Expiry",
  },
}

/**
 * Demonstrates an asynchronous workflow where triggering confirmation guards an async operation with loading state.
 */
export const AsyncWorkflow: Story = {
  render: () => {
    const [ConfirmDialog, confirm] = useConfirm()
    const [isLoading, setIsLoading] = useState(false)
    const [itemCount, setItemCount] = useState(5)

    const handleClearAll = async () => {
      const confirmed = await confirm()
      action("confirm:resolved")(confirmed)

      if (!confirmed) {
        toast.add({
          type: "info",
          title: "Aborted",
          description: "Cache clear operation was cancelled by user.",
        })
        return
      }

      setIsLoading(true)
      try {
        // Simulate async operation
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setItemCount(0)
        toast.add({
          type: "success",
          title: "Cache Cleared",
          description: "All 5 cached entries have been successfully purged.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    return (
      <div className="border-border bg-card text-card-foreground flex w-full max-w-md flex-col gap-4 rounded-xl border p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold">Application Cache</h4>
            <p className="text-muted-foreground text-xs">Items in memory: {itemCount}</p>
          </div>
          {itemCount === 0 && (
            <Button size="xs" variant="outline" onClick={() => setItemCount(5)}>
              Reset count
            </Button>
          )}
        </div>

        <Button
          variant="destructive"
          disabled={isLoading || itemCount === 0}
          onClick={handleClearAll}
        >
          {isLoading ? (
            <>
              <Spinner className="mr-2" />
              Purging cache...
            </>
          ) : (
            "Purge Cache"
          )}
        </Button>

        <ConfirmDialog
          title="Purge Application Cache?"
          message="This will force all connected clients to refetch data from origin servers. Latency may temporarily increase."
          confirmButtonContent="Purge Now"
          variant="error"
          icon={Trash2Icon}
        />
      </div>
    )
  },
}

/**
 * Demonstrates multiple independent confirmation dialogs in the same parent component without state collisions.
 */
export const MultipleDialogs: Story = {
  render: () => {
    const [SignOutDialog, confirmSignOut] = useConfirm()
    const [DeleteAccountDialog, confirmDeleteAccount] = useConfirm()

    const handleSignOut = async () => {
      const ok = await confirmSignOut()
      action("signOut:resolved")(ok)
      if (ok) {
        toast.add({
          type: "success",
          title: "Signed Out",
          description: "User session terminated.",
        })
      }
    }

    const handleDelete = async () => {
      const ok = await confirmDeleteAccount()
      action("deleteAccount:resolved")(ok)
      if (ok) {
        toast.add({
          type: "error",
          title: "Account Deleted",
          description: "Your account has been scheduled for permanent removal.",
        })
      }
    }

    return (
      <div className="border-border bg-card text-card-foreground flex w-full max-w-md flex-col gap-4 rounded-xl border p-6 shadow-sm">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">Account Security</h4>
          <p className="text-muted-foreground text-xs">
            Demonstrates multiple isolated useConfirm hooks within the same parent component.
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button variant="outline" onClick={handleSignOut}>
            <LogOutIcon className="mr-2 size-4" />
            Sign Out
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2Icon className="mr-2 size-4" />
            Delete Account
          </Button>
        </div>

        <SignOutDialog
          title="Sign Out"
          message="Are you sure you want to sign out of your account on this device?"
          confirmButtonContent="Sign Out"
          icon={LogOutIcon}
        />

        <DeleteAccountDialog
          title="Delete Account"
          message="This action is irreversible and will delete all personal data."
          inputTextToConfirm="DELETE"
          confirmButtonContent="Permanently Delete"
          variant="error"
          icon={ShieldAlertIcon}
        />
      </div>
    )
  },
}
