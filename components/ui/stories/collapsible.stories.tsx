import type { Meta, StoryObj } from "@storybook/nextjs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const meta = {
  title: "Components/ui/Collapsible",
  component: Collapsible,
  parameters: {
    layout: "centered",
  },
  render: (args) => (
    <Collapsible {...args}>
      <CollapsibleTrigger className="hover:bg-accent/10 rounded p-2">
        Toggle Content
      </CollapsibleTrigger>
      <CollapsibleContent className="p-2">This is the collapsible content.</CollapsibleContent>
    </Collapsible>
  ),
} satisfies Meta<typeof Collapsible>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
