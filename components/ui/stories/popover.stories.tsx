import type { Meta, StoryObj } from "@storybook/nextjs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const meta = {
  title: "Components/ui/Popover",
  component: Popover,
  parameters: {
    layout: "centered",
  },
  render: () => (
    <Popover>
      <PopoverTrigger>Open Popover</PopoverTrigger>
      <PopoverContent>
        This is the content of the popover. It appears when you click the trigger.
      </PopoverContent>
    </Popover>
  ),
} satisfies Meta<typeof Popover>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
