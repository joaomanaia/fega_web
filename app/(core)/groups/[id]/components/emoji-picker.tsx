import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Theme } from "emoji-picker-react"
import { SmileIcon } from "lucide-react"
import { useTheme } from "next-themes"
import dynamic from "next/dynamic"

interface EmojiPickerPopupProps {
  onEmojiClick: (emoji: string) => void
}

const Picker = dynamic(() => import("emoji-picker-react"), {
  loading: () => <div>Loading emoji picker...</div>,
})

export const EmojiPicker: React.FC<EmojiPickerPopupProps> = ({ onEmojiClick }) => {
  const { resolvedTheme } = useTheme()

  const emojiTheme = resolvedTheme === "dark" ? Theme.DARK : Theme.LIGHT

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="text-secondary rounded-2xl aria-expanded:bg-secondary aria-expanded:text-secondary-foreground aspect-square">
          <SmileIcon className="w-6 h-6" aria-label="Open emoji picker" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 border-none ml-4 mb-2">
        <Picker
          onEmojiClick={(emoji, event) => {
            onEmojiClick(emoji.emoji)
          }}
          theme={emojiTheme}
        />
      </PopoverContent>
    </Popover>
  )
}
