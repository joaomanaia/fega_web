"use client"

import { cn } from "@workspace/ui/lib/utils"
import { X } from "lucide-react"
import { OurFileRouter } from "@/app/api/uploadthing/core"
import { UploadDropzone } from "@/lib/uploadthing"

type TEndpoint = keyof OurFileRouter

interface FileUploadProps {
  endpoint: TEndpoint
  value: string
  onChange: (url?: string) => void
  className?: string
}

export const FileUpload: React.FC<FileUploadProps> = ({ endpoint, value, onChange, className }) => {
  const fileType = value?.split(".").pop()

  // If the file is uploaded and it's not a pdf, show the image
  if (value && fileType !== "pdf") {
    return (
      <div className={cn("relative", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={value} alt="Upload Image" className="h-full w-full rounded-2xl" />
        <button
          onClick={() => onChange("")}
          className="bg-error text-error-foreground absolute top-2 right-2 rounded-full p-1 shadow-xs"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <UploadDropzone
      className="ut-button:bg-primary ut-button:text-primary-foreground ut-label:text-primary ut-label:hover:text-primary/90 ut-allowed-content:text-foreground/70 border-outline/30 hover:bg-surface-variant/8 border-dashed"
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0]?.url)
      }}
      onUploadError={(error: Error) => {
        console.error(error)
      }}
    />
  )
}
