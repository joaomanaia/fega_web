import { Button } from "@/components/ui/button"
import { NavDrawerItem } from "./main-drawer"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface DrawerItemProps {
  item: NavDrawerItem
  selected?: boolean
  className?: string
}

export const DrawerItem: React.FC<DrawerItemProps> = ({ item, selected, className }) => {
  return (
    <Link
      href={item.pathName}
      className={cn(item.disabled && "cursor-default", className)}
      aria-disabled={item.disabled}
      passHref
    >
      <Button
        variant="ghost"
        disabled={item.disabled}
        aria-selected={selected}
        className={cn(
          "gap-2 py-6 w-full text-foreground font-normal text-[16px] justify-start",
          selected && "font-bold bg-primary/[0.25] hover:bg-primary/[0.30] text-primary"
        )}
      >
        {item.icon}
        {item.title}
      </Button>
    </Link>
  )
}
