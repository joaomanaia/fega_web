import type { Meta, StoryObj } from "@storybook/nextjs"
import { Textarea } from "@/components/ui/textarea"

const meta = {
  title: "Components/ui/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    placeholder: {
      control: {
        type: "text",
      },
      description: "Placeholder text for the textarea",
    },
    disabled: {
      control: {
        type: "boolean",
      },
      description: "Disables the textarea",
    },
  },
  render: (args) => <Textarea {...args} />,
} satisfies Meta<typeof Textarea>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: "Type your message here.",
    disabled: false,
  },
}
