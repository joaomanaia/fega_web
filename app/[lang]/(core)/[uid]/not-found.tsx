import { BaseNotFound } from "@/app/components/base-not-found"

export default function UserNotFound() {
  return (
    <BaseNotFound
      title="User not found"
      description="We couldn't find the user you were looking for. Please check the URL or try again later."
    />
  )
}
