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
import { Copy, Share } from "lucide-react"
import { toast } from "sonner"

interface SharePostDialogProps {
  postId: string
}

export const SharePostDialog: React.FC<SharePostDialogProps> = ({ postId }) => {
  const copyUrl = () => {
    const postUrl = `${location.origin}/post/${postId}`
    navigator.clipboard.writeText(postUrl)

    toast.success("Copied to clipboard!")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="surfaceVariant">
          <Share size={20} className="mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>Copy the link below and share it with your friends!</DialogDescription>
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
              <span className="sr-only">Copy</span>
              <Copy className="h-4 w-4" />
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
