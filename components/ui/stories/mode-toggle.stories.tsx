import type { Meta, StoryObj } from "@storybook/nextjs"
import { ModeToggle } from "@/components/ui/mode-toggle"

const meta = {
  title: "Components/ui/ModeToggle",
  component: ModeToggle,
  parameters: {
    layout: "centered",
  },
  render: () => <ModeToggle />,
} satisfies Meta<typeof ModeToggle>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
