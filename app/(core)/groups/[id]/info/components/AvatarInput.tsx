"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface AvatarInputProps {
  defaultValue: string
  name: string | null
  inputInvisible?: boolean
}

export const AvatarInput: React.FC<AvatarInputProps> = ({ defaultValue, name, inputInvisible }) => {
  const [photoUrl, setPhotoUrl] = useState(defaultValue)

  return (
    <>
      <Avatar className="h-12 w-12">
        <AvatarImage src={photoUrl} />
        <AvatarFallback>{name}</AvatarFallback>
      </Avatar>
      {!inputInvisible && (
        <Input
          type="url"
          placeholder="https://example.com/icon.png"
          defaultValue={defaultValue}
          name="icon_url"
          id="icon_url"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          required
        />
      )}
    </>
  )
}
