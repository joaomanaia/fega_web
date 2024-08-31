"use client"

import { ShareContent } from "@/components/share/share-content"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDictionary } from "@/hooks/use-get-dictionary"
import { useShare } from "@/hooks/use-share"

export const ShareDialogProvider: React.FC = () => {
  const { data, onCancel } = useShare()
  const dictionary = useDictionary()

  return (
    <Dialog open={data !== null} onOpenChange={onCancel}>
      <DialogContent className="gap-4 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{data?.dialogTitle ?? ""}</DialogTitle>
          {data?.dialogDescription && (
            <DialogDescription>{data.dialogDescription}</DialogDescription>
          )}
        </DialogHeader>
        <ShareContent
          url={data?.url ?? ""}
          text={data?.text ?? ""}
          hideSocials={data?.hideSocials}
          hideCopyUrl={data?.hideCopyUrl}
          dictionary={dictionary}
        />
      </DialogContent>
    </Dialog>
  )
}
