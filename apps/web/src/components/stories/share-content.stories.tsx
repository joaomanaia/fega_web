import type { Meta, StoryObj } from "@storybook/nextjs"
import { ShareContent } from "../share/share-content"

const meta = {
  title: "Components/Share/ShareContent",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    url: {
      control: {
        type: "text",
      },
    },
    text: {
      control: {
        type: "text",
      },
    },
    hideSocials: {
      description: "Hide social media share buttons",
      control: "boolean",
    },
  },
  component: ShareContent,
  render: (args) => <ShareContent {...args} />,
} satisfies Meta<typeof ShareContent>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    url: "https://example.com",
    text: "Example text",
    hideSocials: false,
    hideCopyUrl: false,
  },
}

export const OnlyCopyUrl: Story = {
  args: {
    url: "https://example.com",
    text: "Example text",
    hideSocials: true,
  },
}

export const OnlySocials: Story = {
  args: {
    url: "https://example.com",
    text: "Example text",
    hideCopyUrl: true,
  },
}
