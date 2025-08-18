import type { Meta, StoryObj } from "@storybook/nextjs"
import { Slider } from "../slider"

const meta = {
  title: "Components/ui/Slider",
  component: Slider,
  parameters: {
    layout: "centered",
  },
  render: (args) => <Slider {...args} className="min-w-96" />,
  argTypes: {
    defaultValue: {
      control: {
        type: "object",
      },
    },
    min: {
      control: {
        type: "number",
        min: 0,
        max: 100,
        step: 1,
      },
    },
    max: {
      control: {
        type: "number",
        min: 0,
        max: 100,
        step: 1,
      },
    },
    step: {
      control: {
        type: "number",
        min: 1,
        max: 100,
        step: 1,
      },
    },
    disabled: {
      control: {
        type: "boolean",
      },
      defaultValue: false,
    },
    orientation: {
      control: {
        type: "select",
      },
      options: ["horizontal", "vertical"],
      defaultValue: "horizontal",
    },
  },
} satisfies Meta<typeof Slider>

export default meta

type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  args: {
    defaultValue: [33],
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    orientation: "horizontal",
  },
}

export const Vertical: Story = {
  args: {
    defaultValue: [33],
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    orientation: "vertical",
  },
}
