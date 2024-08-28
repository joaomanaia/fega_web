import { z } from "zod";

export const uuidSchema = z.string().uuid()

export type UuidType = z.infer<typeof uuidSchema>