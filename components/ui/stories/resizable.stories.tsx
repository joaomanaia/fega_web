import React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

type Args = React.ComponentProps<typeof ResizablePanelGroup> &
  React.ComponentProps<typeof ResizableHandle>

const meta = {
  title: "Components/ui/Resizable",
  component: ResizablePanelGroup,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    direction: {
      control: { type: "select" },
      options: ["horizontal", "vertical"],
      description: "Direction of resizing",
    },
    withHandle: {
      control: { type: "boolean" },
      description: "Whether to show the resize handle",
      defaultValue: true,
      table: {
        category: "Handle",
        defaultValue: { summary: "true" },
      },
    },
  },
  render: (args) => (
    <ResizablePanelGroup
      className="min-h-[200px] max-w-md rounded-lg border md:min-w-[450px]"
      {...args}
    >
      <ResizablePanel>
        <div className="flex h-full items-center justify-center p-6">One</div>
      </ResizablePanel>
      <ResizableHandle withHandle={args.withHandle} />
      <ResizablePanel>
        <div className="flex h-full items-center justify-center p-6">Two</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
} satisfies Meta<Args>

export default meta

type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  args: {
    direction: "horizontal",
    withHandle: true,
  },
}

export const Vertical: Story = {
  args: {
    direction: "vertical",
    withHandle: true,
  },
}
