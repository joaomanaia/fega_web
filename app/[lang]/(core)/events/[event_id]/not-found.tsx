import { BaseNotFound } from "@/app/components/base-not-found"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Event not found",
}

export default function EventNotFound() {
  return (
    <BaseNotFound
      title="Event not found"
      description="The event you are looking for does not exist."
    />
  )
}
