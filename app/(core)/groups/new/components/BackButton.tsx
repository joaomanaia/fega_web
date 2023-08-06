"use client"

import { Button } from "@mui/material"
import { useRouter } from "next/navigation"

const BackButton: React.FC = () => {
  const router = useRouter()

  return (
    <Button onClick={() => router.back()} variant="text">
      Cancel
    </Button>
  )
}

export default BackButton
