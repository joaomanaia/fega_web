import { LargeButtonCollapsible } from "@/components/large-button"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Components/LargeButton/Colapsible",
  render: (args) => (
    <LargeButtonCollapsible className="min-w-96" {...args}>
      {args.children}
    </LargeButtonCollapsible>
  ),
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "error"],
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof LargeButtonCollapsible>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: "Large button",
    description: "Content of the button",
    children: "Content of the collapsible",
  },
}

export const Error: Story = {
  args: {
    title: "Large button",
    description: "Content of the button",
    variant: "error",
    children: "Content of the error collapsible",
  },
}
