import type { Meta, StoryObj } from "@storybook/nextjs"
import { DatePicker } from "@/components/ui/date-picker"

const meta = {
  title: "Components/ui/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
  },
  render: () => <DatePicker />,
} satisfies Meta<typeof DatePicker>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
