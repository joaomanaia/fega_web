"use client"

import { X } from "lucide-react"
import { UploadDropzone } from "@/lib/uploadthing"
import { cn } from "@/lib/utils"
import { OurFileRouter } from "@/app/api/uploadthing/core"

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
        <img src={value} alt="Upload Image" className="w-full h-full rounded-2xl" />
        <button
          onClick={() => onChange("")}
          className="bg-error text-error-foreground p-1 rounded-full absolute top-2 right-2 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <UploadDropzone
      className="ut-button:bg-primary ut-button:text-primary-foreground ut-label:text-primary ut-label:hover:text-primary/90 ut-allowed-content:text-foreground/70 border-dashed border-outline/30 hover:bg-surfaceVariant/[0.08]"
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url)
      }}
      onUploadError={(error: Error) => {
        console.error(error)
      }}
    />
  )
}
