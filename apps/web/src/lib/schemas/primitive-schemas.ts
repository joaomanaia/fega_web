import * as z from "zod"

export const uuidSchema = z.uuid()

export type UuidType = z.infer<typeof uuidSchema>
