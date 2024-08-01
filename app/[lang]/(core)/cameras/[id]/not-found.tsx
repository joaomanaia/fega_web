import { BaseNotFound } from "@/app/components/base-not-found"

export default function CameraNotFound() {
  return (
    <BaseNotFound
      title="Camera not found"
      description="We couldn't find the camera you were looking for. Please check the URL or try again later."
    />
  )
}
