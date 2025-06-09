import type { Meta, StoryObj } from "@storybook/nextjs"

import { Avatar, AvatarFallback, AvatarImage } from "../avatar"

const meta = {
  title: "Components/ui/Avatar",
  render: (args) => (
    <Avatar>
      <AvatarImage src="/fega_round.svg" alt="fega" />
      <AvatarFallback>F</AvatarFallback>
    </Avatar>
  ),
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Avatar>

export default meta

type Story = StoryObj<typeof meta>

export const AvatarWithImage: Story = {
  args: {},
  render: (args) => (
    <Avatar>
      <AvatarImage src="/fega_round.svg" alt="@fega" />
      <AvatarFallback>F</AvatarFallback>
    </Avatar>
  ),
}
export const AvatarWithFallback: Story = {
  args: {},
  render: (args) => (
    <Avatar>
      <AvatarImage src="" alt="@fega" />
      <AvatarFallback>F</AvatarFallback>
    </Avatar>
  ),
}
