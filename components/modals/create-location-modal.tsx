"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useModal } from "@/hooks/use-modal-store"
import { SubmitButton } from "@/components/submit-button"
import { toast } from "sonner"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import dynamic from "next/dynamic"
import { createLocation } from "@/app/actions/locationActions"

export const CreateLocationModal: React.FC = () => {
  const { isOpen, onClose, data } = useModal("create-location")
  
  const { locationName } = data
  if (!locationName) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Create Location</DialogTitle>
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
          action={async () => {
            try {
              // workaround to get the position from the map, because it was
              // not getting from the fromData
              const { locationName, address, position } = form.getValues()

              const point = `POINT(${position.lng} ${position.lat})`
              await createLocation(locationName, address, point)

              toast.success("Location created")
              onClose()
            } catch (error) {
              toast.error("Failed to create location")
            }
          }}
          className="flex flex-col w-full gap-4 py-4"
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
