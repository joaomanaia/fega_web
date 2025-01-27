import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function wait(ms: number) {
  console.warn(
    "Warning: wait() function introduces artificial delays and should be used with caution"
  )
  return new Promise((resolve) => setTimeout(resolve, ms))
}
