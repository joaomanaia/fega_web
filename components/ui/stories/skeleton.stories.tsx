import type { Meta, StoryObj } from "@storybook/nextjs"
import { Skeleton } from "@/components/ui/skeleton"

const meta = {
  title: "Components/ui/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "centered",
  },
  render: () => (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ),
} satisfies Meta<typeof Skeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
