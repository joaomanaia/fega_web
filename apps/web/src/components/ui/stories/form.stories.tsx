import type { Meta, StoryObj } from "@storybook/nextjs"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import { useForm } from "react-hook-form"

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

export const Default: Story = { args: {} as any }
