import { Database } from "./database.types"

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]

export type Views<T extends keyof Database["public"]["Views"]> = Database["public"]["Views"][T]["Row"]

export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T]
