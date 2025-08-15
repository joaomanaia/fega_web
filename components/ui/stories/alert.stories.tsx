import type { Meta, StoryObj } from "@storybook/nextjs"
import { TestTubeIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type StoryArgs = React.ComponentProps<typeof Alert> & {
  title: string
  description: string
}

const meta = {
  title: "Components/ui/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    title: {
      control: "text",
      description: "Title of the alert",
    },
    description: {
      control: "text",
      description: "Description of the alert",
    },
    variant: {
      control: "select",
      options: ["default", "destructive"],
      description: "Alert variant",
    },
  },
  render: (args) => (
    <Alert variant={args.variant}>
      <TestTubeIcon />
      <AlertTitle>{args.title}</AlertTitle>
      <AlertDescription>{args.description}</AlertDescription>
    </Alert>
  ),
} satisfies Meta<StoryArgs>

export default meta

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  args: {
    title: "Default Alert",
    description: "This is a default alert message.",
    variant: "default",
  },
}

export const Destructive: Story = {
  args: {
    title: "Destructive Alert",
    description: "This is a destructive alert message.",
    variant: "destructive",
  },
}

export const OnlyTitle: Story = {
  args: {
    title: "Alert with Title Only",
    description: "",
    variant: "default",
  },
}
