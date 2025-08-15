import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "../avatar"

type AvatarProps = React.ComponentProps<typeof Avatar> & {
  imgSrc?: string
  alt?: string
}

const meta = {
  title: "Components/ui/Avatar",
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      description: "Avatar size",
      options: ["default", "large"],
    },
    imgSrc: {
      control: "text",
      description: "Image source URL",
    },
    alt: {
      control: "text",
      description: "Alternative text for the image",
    },
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src={args.imgSrc} alt={args.alt} />
      <AvatarFallback>{args.alt || "?"}</AvatarFallback>
    </Avatar>
  ),
} satisfies Meta<AvatarProps>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    size: "default",
    imgSrc: "/icon.svg",
  },
}

export const AvatarWithFallback: Story = {
  args: {
    size: "default",
    imgSrc: undefined,
  },
}
