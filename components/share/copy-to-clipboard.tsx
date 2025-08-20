"use client"

import { sendGTMEvent } from "@next/third-parties/google"
import { CopyIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Hint } from "@/components/hint"
import { cn } from "@/lib/utils"

interface CopyToClipboardProps {
  text: string
  onCopied?: () => void
  className?: string
}

export const CopyToClipboard: React.FC<CopyToClipboardProps> = ({ text, onCopied, className }) => {
  const t = useTranslations("Share")

  const copyText = () => {
    try {
      navigator.clipboard.writeText(text)
      toast.success(t("copiedToClipboard"))
      sendGTMEvent({
        event: "share",
        method: "copy",
      })
      onCopied?.()
    } catch {
      toast.error(t("failedToCopyToClipboard"))
    }
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="grid flex-1 gap-2">
        <Label htmlFor="link" className="sr-only">
          Link
        </Label>
        <Input id="link" className="border-none" defaultValue={text} readOnly />
      </div>
      <Hint label={t("copy")}>
        <Button type="submit" size="sm" className="rounded-sm px-3" onClick={copyText}>
          <span className="sr-only">{t("copy")}</span>
          <CopyIcon className="size-4" />
        </Button>
      </Hint>
    </div>
  )
}
