"use client"

import CameraType from "@/types/CameraType"
import { Avatar, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"

interface CameraItemProps {
  camera: CameraType
}

const CameraItem: React.FC<CameraItemProps> = ({ camera }) => {
  const params = useParams()
  const selected = params.id === camera.id

  return (
    <Link className="h-fit next-link" href={`/cameras/${camera.id}`}>
      <ListItemButton selected={selected}>
        <ListItemAvatar>
            <Avatar>
                <Image src={camera.image_poster} alt={camera.name} width={40} height={40} />
            </Avatar>
        </ListItemAvatar>
        <ListItemText primary={camera.name} secondary={camera.description} />
      </ListItemButton>
    </Link>
  )
}

export default CameraItem
