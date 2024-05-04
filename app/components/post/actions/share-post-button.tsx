"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type Dictionary } from "@/get-dictionary"
import { sendGAEvent } from "@next/third-parties/google"
import { Copy, Share } from "lucide-react"
import { toast } from "sonner"

interface SharePostButtonProps {
  postId: string
  dictionary: Dictionary["sharePostButton"]
}

export const SharePostButton: React.FC<SharePostButtonProps> = ({ postId, dictionary }) => {
  const copyUrl = () => {
    const postUrl = `${location.origin}/post/${postId}`
    navigator.clipboard.writeText(postUrl)

    sendGAEvent("event", "share", {
      method: "copy",
      content_type: "post",
      item_id: postId,
    })

    toast.success("Copied to clipboard!")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="surfaceVariant">
          <Share size={20} className="mr-2" />
          {dictionary.button}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dictionary.header}</DialogTitle>
          <DialogDescription>{dictionary.description}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              className="border-none"
              defaultValue={`https://newquiz-app.vercel.app/post/${postId}`}
              readOnly
            />
          </div>
          <DialogClose asChild>
            <Button type="submit" size="sm" className="px-3 rounded-sm" onClick={copyUrl}>
              <span className="sr-only">{dictionary.copy}</span>
              <Copy className="h-4 w-4" />
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
