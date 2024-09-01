import type { Meta, StoryObj } from "@storybook/react"

import { OGPreview } from "./og-preview"

const meta = {
  title: "Components/Post/OGPreview",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  component: OGPreview,
} satisfies Meta<typeof OGPreview>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    url: "https://example.com/article",
    title: "10 Best Hiking Trails in the Rocky Mountains",
    description:
      "Discover breathtaking views and challenging terrains in our guide to the top hiking trails in the Rocky Mountains. Perfect for nature enthusiasts and adventure seekers.",
    image: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
  },
}
