import type { Meta, StoryObj } from "@storybook/nextjs"
import { within } from "@storybook/test"
import { action } from "storybook/internal/actions"
import { Calendar } from "@/components/ui/calendar"

const meta = {
  title: "Components/ui/Calendar",
  component: Calendar,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    mode: {
      control: { type: "select" },
      options: ["single", "multiple", "range"],
      description: "Mode of the calendar",
    },
    numberOfMonths: {
      control: { type: "number", min: 1, max: 6 },
      description: "Number of months to display in the calendar",
    },
    defaultMonth: {
      control: { type: "date" },
    },
    showOutsideDays: {
      control: { type: "boolean" },
      description: "Whether to show days outside the current month",
    },
    captionLayout: {
      control: { type: "select" },
      options: ["label", "dropdown", "dropdown-months", "dropdown-years"],
      description: "Layout of the caption",
    },
    buttonVariant: {
      control: { type: "select" },
      options: [
        "default",
        "destructive",
        "destructiveContainer",
        "outline",
        "secondary",
        "tonal",
        "surfaceVariant",
        "ghost",
        "link",
      ],
      description: "Variant of the navigation buttons",
    },
    onDayClick: {
      action: "date selected",
      description: "Function to call when a date is selected",
    },
  },
  render: (args) => <Calendar {...args} />,
} satisfies Meta<typeof Calendar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    mode: "single",
    numberOfMonths: 1,
    defaultMonth: new Date(),
    showOutsideDays: true,
    captionLayout: "label",
    buttonVariant: "ghost",
    onDayClick: action("date selected"),
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByText("11")
    await userEvent.click(btn)
  },
}
