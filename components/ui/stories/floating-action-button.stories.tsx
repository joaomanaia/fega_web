import type { Meta, StoryObj } from "@storybook/nextjs"
import { TestTubeIcon } from "lucide-react"
import { ExtendedFAB } from "@/components/ui/floating-action-button"

const meta = {
  title: "Components/ui/ExtendedFAB",
  component: ExtendedFAB,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disables the FAB",
    },
    children: {
      control: "object",
      description: "Content inside the FAB",
    },
  },
  render: (args) => <ExtendedFAB {...args}>{args.children}</ExtendedFAB>,
} satisfies Meta<typeof ExtendedFAB>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    disabled: false,
    children: (
      <>
        <TestTubeIcon />
        Extended FAB
      </>
    ),
  },
}

export const IconOnly: Story = {
  args: {
    disabled: false,
    children: <TestTubeIcon />,
  },
}
