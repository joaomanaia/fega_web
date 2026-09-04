import dynamic from "next/dynamic"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { cn } from "@workspace/ui/lib/utils"
import { Theme } from "emoji-picker-react"
import { SmileIcon } from "lucide-react"
import { useTheme } from "next-themes"

interface EmojiPickerPopupProps {
  className?: string
  onEmojiClick: (emoji: string) => void
}

const Picker = dynamic(() => import("emoji-picker-react"), {
  loading: () => <div>Loading emoji picker...</div>,
})

export const EmojiPicker: React.FC<EmojiPickerPopupProps> = ({ className, onEmojiClick }) => {
  const { resolvedTheme } = useTheme()

  const emojiTheme = resolvedTheme === "dark" ? Theme.DARK : Theme.LIGHT

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "text-secondary aria-expanded:bg-secondary aria-expanded:text-secondary-foreground aspect-square rounded-2xl",
          className,
        )}
      >
        <SmileIcon aria-label="Open emoji picker" />
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 pt-1" sideOffset={8}>
        <Picker
          onEmojiClick={(emoji) => {
            onEmojiClick(emoji.emoji)
          }}
          theme={emojiTheme}
          className="rounded-3xl! border-none! bg-transparent!"
        />
      </PopoverContent>
    </Popover>
  )
}
