import type { Meta, StoryObj } from "@storybook/nextjs"
import { LargeButton } from "@/components/large-button"

const meta = {
  title: "Components/LargeButton",
  component: LargeButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["outline", "destructive"],
    },
    disabled: {
      control: "boolean",
    },
    onClick: {
      action: "clicked",
      description: "Function to call on button click",
    },
  },
} satisfies Meta<typeof LargeButton>

export default meta

type Story = StoryObj<typeof meta>

export const Outline: Story = {
  args: {
    title: "Large button",
    description: "Content of the button",
    variant: "outline",
    disabled: false,
  },
}

export const Destructive: Story = {
  args: {
    title: "Large button",
    description: "Content of the button",
    variant: "destructive",
    disabled: false,
  },
}
