"use client"

import { sendGTMEvent } from "@next/third-parties/google"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { toast } from "@workspace/ui/components/toast"
import { cn } from "@workspace/ui/lib/utils"
import { CopyIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Hint } from "@/components/hint"
import { useShare } from "@/hooks/use-share"

interface CopyToClipboardProps {
  text: string
  className?: string
}

export const CopyToClipboard: React.FC<CopyToClipboardProps> = ({ text, className }) => {
  const t = useTranslations("Share")
  const { onCancel } = useShare()

  const copyText = () => {
    try {
      navigator.clipboard.writeText(text)
      toast.add({ type: "success", description: t("copiedToClipboard") })
      sendGTMEvent({
        event: "share",
        method: "copy",
      })
      onCancel()
    } catch {
      toast.add({ type: "error", description: t("failedToCopyToClipboard") })
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
      <Hint label={t("copy")} render={<Button type="submit" size="icon" onClick={copyText} />}>
        <span className="sr-only">{t("copy")}</span>
        <CopyIcon />
      </Hint>
    </div>
  )
}
