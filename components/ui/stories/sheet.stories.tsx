import React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

type Args = React.ComponentProps<typeof Sheet> & React.ComponentProps<typeof SheetContent>

const meta = {
  title: "Components/ui/Sheet",
  component: Sheet,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    side: {
      control: {
        type: "select",
      },
      options: ["top", "right", "bottom", "left"],
      description: "The side from which the sheet will appear.",
    },
  },
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger>Open</SheetTrigger>
      <SheetContent side={args.side}>
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your account and remove your
            data from our servers.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button>Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
} satisfies Meta<Args>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    side: "right",
  },
}
