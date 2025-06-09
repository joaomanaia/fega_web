import type { Meta, StoryObj } from "@storybook/nextjs"

import { SocialShareRow, socialValues } from "../share/social-share-button"

const meta = {
  title: "Components/Share/SocialShareRow",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    socials: {
      options: socialValues,
      control: {
        type: "multi-select",
      },
    },
    url: {
      control: { type: "text" },
      description: "The URL to share",
    },
    text: {
      control: { type: "text" },
      description: "The text to share",
    },
  },
  component: SocialShareRow,
} satisfies Meta<typeof SocialShareRow>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    url: "https://fega.vercel.app",
    text: "See this cool thing!",
  },
}
