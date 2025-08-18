import type { Meta, StoryObj } from "@storybook/nextjs"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

const meta = {
  title: "Components/ui/HoverCard",
  component: HoverCard,
  parameters: {
    layout: "centered",
  },
  render: () => (
    <HoverCard>
      <HoverCardTrigger>Hover</HoverCardTrigger>
      <HoverCardContent>
        This is the content of the hover card. It appears when you hover over the trigger.
      </HoverCardContent>
    </HoverCard>
  ),
} satisfies Meta<typeof HoverCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
