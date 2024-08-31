import type { Meta, StoryObj } from "@storybook/react"

import { SocialShareButton, socialValues } from "../share/social-share-button"

const meta = {
  title: "Components/Share/SocialShareButton",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    social: {
      options: socialValues,
      control: { type: "select" },
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
  component: SocialShareButton,
} satisfies Meta<typeof SocialShareButton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    social: "facebook",
    url: "https://fega.vercel.app",
    text: "See this cool thing!",
  },
}
