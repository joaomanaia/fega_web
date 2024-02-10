"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const BackButton: React.FC = () => {
  const router = useRouter()

  return (
    <Button onClick={() => router.back()} variant="ghost">
      Cancel
    </Button>
  )
}

export default BackButton
