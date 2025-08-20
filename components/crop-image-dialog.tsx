"use client"

import { useCallback, useState } from "react"
import { RotateCw, ZoomIn } from "lucide-react"
import Cropper, { type Area } from "react-easy-crop"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { MAX_IMAGE_SIZE_FOR_TYPE, type ImageType } from "@/features/post/constants"
import { getCroppedImg } from "@/lib/crop-image"

interface ImageEditDialogProps {
  isOpen: boolean
  imageUrl: string
  type: ImageType
  shape?: "rect" | "round"
  aspect?: number
  onClose: () => void
  onSave: (croppedImage: Blob) => void
}

export const CropImageDialog: React.FC<ImageEditDialogProps> = ({
  isOpen,
  imageUrl,
  type,
  shape = "rect",
  aspect = 1,
  onClose,
  onSave,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [cropping, setCropping] = useState(false)

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const createCroppedImage = useCallback(async () => {
    try {
      if (croppedAreaPixels) {
        setCropping(true)

        const croppedImage = await getCroppedImg(
          imageUrl,
          croppedAreaPixels,
          MAX_IMAGE_SIZE_FOR_TYPE[type],
          rotation
        )
        onSave(croppedImage)

        // Reset the crop state
        onClose()
        setCrop({ x: 0, y: 0 })
        setZoom(1)
        setRotation(0)
        setCroppedAreaPixels(null)
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("An error occurred while cropping the image")
      }
    } finally {
      setCropping(false)
    }
  }, [croppedAreaPixels, imageUrl, rotation, onSave, onClose, type])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Image</DialogTitle>
        </DialogHeader>
        <div className="relative mt-4 h-64 w-full">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={shape}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            rotation={rotation}
            classes={{
              containerClassName: "rounded-xl",
            }}
          />
        </div>
        <div className="mt-4 flex items-center">
          <ZoomIn className="mr-2 h-4 w-4" />
          <Slider
            value={[zoom]}
            onValueChange={(value) => setZoom(value[0])}
            disabled={cropping}
            min={1}
            max={3}
            step={0.1}
            className="grow"
            aria-labelledby="Zoom"
          />
        </div>
        <div className="mt-4 flex items-center">
          <RotateCw className="mr-2 h-4 w-4" />
          <Slider
            value={[rotation]}
            onValueChange={(value) => setRotation(value[0])}
            disabled={cropping}
            min={0}
            max={360}
            step={1}
            className="grow"
            aria-labelledby="Rotation"
          />
        </div>
        <DialogFooter>
          <Button disabled={cropping} onClick={createCroppedImage}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
