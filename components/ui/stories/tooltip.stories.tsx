import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type Args = React.ComponentProps<typeof Tooltip> & React.ComponentProps<typeof TooltipContent>

const meta = {
  title: "Components/ui/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    delayDuration: {
      control: {
        type: "number",
        min: 0,
        step: 100,
      },
      description: "Delay before the tooltip appears in milliseconds",
    },
    side: {
      control: {
        type: "select",
      },
      options: ["top", "bottom", "left", "right"],
      description: "Position of the tooltip relative to the trigger",
    },
    align: {
      control: {
        type: "select",
      },
      options: ["start", "center", "end"],
      description: "Alignment of the tooltip content",
    },
    sideOffset: {
      control: {
        type: "number",
        min: 0,
        step: 1,
      },
      description: "Offset of the tooltip from the side",
    },
    alignOffset: {
      control: {
        type: "number",
        min: 0,
        step: 1,
      },
      description: "Offset of the tooltip from the alignment",
    },
  },
  render: (args) => (
    <Tooltip {...args}>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover</Button>
      </TooltipTrigger>
      <TooltipContent
        side={args.side}
        align={args.align}
        sideOffset={args.sideOffset}
        alignOffset={args.alignOffset}
      >
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  ),
} satisfies Meta<Args>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    delayDuration: 0,
    side: "top",
    align: "center",
    sideOffset: 0,
    alignOffset: 0,
  },
}
