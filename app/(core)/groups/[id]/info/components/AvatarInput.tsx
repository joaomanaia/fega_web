"use client"

import Avatar from "@/app/(core)/components/m3/avatar"
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
      <Avatar photoUrl={photoUrl} name={name} className="h-12 w-12" />
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
