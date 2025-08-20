import type { Meta, StoryObj } from "@storybook/nextjs"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const meta = {
  title: "Components/ui/Form",
  component: Form,
  parameters: {
    layout: "centered",
  },

  render: (args) => {
    const form = useForm()

    return (
      <Form {...args} {...form}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="fega" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    )
  },
} satisfies Meta<typeof Form>

export default meta

type Story = StoryObj<typeof meta>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Default: Story = { args: {} as any }
