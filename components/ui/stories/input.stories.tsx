import type { Meta, StoryObj } from "@storybook/react"
import { Input } from "../input"

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
    startAdornment: {
      control: "object",
    },
    endAdornment: {
      control: "object",
    },
  },
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: "",
    placeholder: "Default input",
    disabled: false,
  },
}

export const WithStartAdornment: Story = {
  args: {
    value: "",
    placeholder: "Input with start adornment",
    disabled: false,
    startAdornment: <>@</>,
  },
}

export const WithEndAdornment: Story = {
  args: {
    value: "",
    placeholder: "Input with end adornment",
    disabled: false,
    endAdornment: <>$</>,
  },
}

export const WithStartAndEndAdornment: Story = {
  args: {
    value: "",
    placeholder: "Input with start and end adornment",
    disabled: false,
    startAdornment: <>@</>,
    endAdornment: <>$</>,
  },
}

export const WithStartAndEndAdornmentVariant: Story = {
  args: {
    value: "",
    placeholder: "Input with start and end adornment",
    disabled: false,
    startAdornment: <div className="size-10 rounded-l-md flex justify-center items-center bg-secondary text-secondary-foreground">@</div>,
    endAdornment: <>$</>,
  },
  render: (args) => <Input className="p-0 pr-3" {...args} />,
}
