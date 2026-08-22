"use server"

import * as z from "zod"
import { ActionError, authActionClient } from "@/lib/safe-action"

export const createLocationSchema = z.object({
  locationName: z.string().min(1, "Location name is required").max(50, "Location name is too long"),
  address: z.string().min(1, "Address is required").max(100, "Address is too long"),
  point: z.string().min(1),
})

export type CreateLocationSchemaValues = z.infer<typeof createLocationSchema>

export const createLocation = authActionClient
  .metadata({ actionName: "createLocation" })
  .inputSchema(createLocationSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { supabase } = ctx

    const { error } = await supabase.from("locations").insert({
      name: parsedInput.locationName,
      address: parsedInput.address,
      point: parsedInput.point,
    })

    if (error) {
      throw new ActionError("Failed to create location", { cause: error })
    }
  })

