"use client"

import dynamic from "next/dynamic"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import { toast } from "@workspace/ui/components/toast"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createLocation } from "@/app/actions/locationActions"
import { SubmitButton } from "@/components/submit-button"
import { useModal } from "@/hooks/use-modal-store"

export const CreateLocationModal: React.FC = () => {
  const { isOpen, onClose, data } = useModal("create-location")

  const { locationName } = data
  if (!locationName) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">Create Location</DialogTitle>
        </DialogHeader>
        <CreateLocationForm locationName={locationName} onClose={onClose} />
      </DialogContent>
    </Dialog>
  )
}

type Position = {
  lat: number
  lng: number
}

const formSchema = z.object({
  locationName: z.string().min(1, "Location name is required").max(50, "Location name is too long"),
  address: z.string().min(1, "Address is required").max(100, "Address is too long"),
  position: z.custom<Position>(),
})

interface CreateLocationFormProps {
  locationName: string
  onClose: () => void
}

const DynamicDraggableMarkerMap = dynamic(() => import("../map/draggable-marker-map"), {
  loading: () => <div>Loading map...</div>,
  ssr: false,
})

const CreateLocationForm: React.FC<CreateLocationFormProps> = ({ locationName, onClose }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      locationName: locationName,
      address: "",
      // Initial location in Condeixa
      position: { lat: 40.1180759, lng: -8.5093333 },
    },
  })

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (values) => {
            try {
              const point = `POINT(${values.position.lng} ${values.position.lat})`
              const result = await createLocation({
                locationName: values.locationName,
                address: values.address,
                point,
              })

              if (result?.serverError) {
                toast.add({ type: "error", description: result.serverError })
                return
              }

              toast.add({ type: "success", description: "Location created" })
              onClose()
            } catch {
              toast.add({ type: "error", description: "Failed to create location" })
            }
          })}
          className="flex w-full flex-col gap-4 py-4"
        >
          <FormField
            control={form.control}
            name="locationName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location name</FormLabel>
                <FormControl>
                  <Input placeholder="Location name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <DynamicDraggableMarkerMap
                    className="h-96"
                    center={field.value}
                    onPositionChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <SubmitButton>Create Location</SubmitButton>
        </form>
      </Form>
    </>
  )
}
