import dynamic from "next/dynamic"
import { Theme } from "emoji-picker-react"
import { SmileIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

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
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "text-secondary aria-expanded:bg-secondary aria-expanded:text-secondary-foreground aspect-square rounded-2xl",
            className
          )}
        >
          <SmileIcon className="h-6 w-6" aria-label="Open emoji picker" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mb-2 ml-4 w-full border-none p-0">
        <Picker
          onEmojiClick={(emoji) => {
            onEmojiClick(emoji.emoji)
          }}
          theme={emojiTheme}
        />
      </PopoverContent>
    </Popover>
  )
}
