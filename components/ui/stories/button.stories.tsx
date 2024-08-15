import type { Meta, StoryObj } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import { Button } from "../button"

const meta = {
  title: "Components/ui/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      description: "Button variant",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "tonal",
        "surfaceVariant",
        "ghost",
        "link",
      ],
    },
    size: {
      control: "select",
      description: "Button size",
      options: ["default", "sm", "lg", "icon"],
    },
    disabled: {
      control: "boolean",
    },
    onClick: {
      action: "clicked",
      description: "Function to call on button click",
    },
    children: {
      control: "text",
      description: "Content of the button",
    },
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: "default",
    size: "default",
    disabled: false,
    onClick: action("default click"),
    children: "Default button",
  },
}

export const Destructive: Story = {
  args: {
    variant: "destructive",
    size: "default",
    disabled: false,
    onClick: action("destructive click"),
    children: "Destructive button",
  },
}

export const Outline: Story = {
  args: {
    variant: "outline",
    size: "default",
    disabled: false,
    onClick: action("outline click"),
    children: "Outline button",
  },
}

export const Secondary: Story = {
  args: {
    variant: "secondary",
    size: "default",
    disabled: false,
    onClick: action("secondary click"),
    children: "Secondary button",
  },
}

export const Tonal: Story = {
  args: {
    variant: "tonal",
    size: "default",
    disabled: false,
    onClick: action("tonal click"),
    children: "Tonal button",
  },
}

export const SurfaceVariant: Story = {
  args: {
    variant: "surfaceVariant",
    size: "default",
    disabled: false,
    onClick: action("surfaceVariant click"),
    children: "SurfaceVariant button",
  },
}

export const Ghost: Story = {
  args: {
    variant: "ghost",
    size: "default",
    disabled: false,
    onClick: action("ghost click"),
    children: "Ghost button",
  },
}

export const Link: Story = {
  args: {
    variant: "link",
    size: "default",
    disabled: false,
    onClick: action("link click"),
    children: "Link button",
  },
}
