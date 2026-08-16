import { BaseNotFound } from "@/app/components/base-not-found"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Camera not found",
}

export default function CameraNotFound() {
  return (
    <BaseNotFound
      title="Camera not found"
      description="We couldn't find the camera you were looking for. Please check the URL or try again later."
    />
  )
}
