import type { Meta, StoryObj } from "@storybook/nextjs"
import { Input } from "@workspace/ui/components/input"

const meta = {
  title: "Components/ui/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    value: {
      control: "text",
      description: "Input value",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    defaultValue: "",
    placeholder: "Default input",
    disabled: false,
  },
}
