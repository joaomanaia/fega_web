import { LargeButton } from "@/components/large-button"
import type { Meta, StoryObj } from "@storybook/nextjs"

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
      options: ["default", "error"],
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

export const Default: Story = {
  args: {
    title: "Large button",
    description: "Content of the button",
  },
}

export const Error: Story = {
  args: {
    title: "Large button",
    description: "Content of the button",
    variant: "error",
  },
}
