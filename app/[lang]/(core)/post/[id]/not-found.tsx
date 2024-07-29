import { BaseNotFound } from "@/app/components/base-not-found"

export default function PostNotFound() {
  return (
    <BaseNotFound
      title="Post not found"
      description="We couldn't find the post you were looking for. Please check the URL or try again later."
    />
  )
}
