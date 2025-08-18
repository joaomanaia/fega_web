import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const meta = {
  title: "Components/ui/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    disabled: {
      control: {
        type: "boolean",
      },
      description: "Disables the switch",
    },
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" {...args} />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    disabled: false,
  },
}
