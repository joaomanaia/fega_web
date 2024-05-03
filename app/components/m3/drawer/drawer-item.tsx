import { Button } from "@/components/ui/button"
import { NavDrawerItem } from "./main-drawer"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { SheetClose } from "@/components/ui/sheet"

interface DrawerItemProps {
  item: NavDrawerItem
  selected?: boolean
  usingSheet?: boolean
  className?: string
}

export const DrawerItem: React.FC<DrawerItemProps> = ({
  item,
  selected,
  usingSheet,
  className,
}) => {
  if (item.disabled) {
    return (
      <DrawerButton item={item} selected={selected} usingSheet={usingSheet} className={className} />
    )
  }

  return (
    <Link
      href={item.pathName}
      className={cn(item.disabled && "cursor-default", className)}
      aria-disabled={item.disabled}
      passHref
    >
      <DrawerButton item={item} selected={selected} usingSheet={usingSheet} />
    </Link>
  )
}

const DrawerButton: React.FC<DrawerItemProps> = ({ item, selected, usingSheet, className }) => {
  return (
    <DrawerButtonContainer usingSheet={usingSheet}>
      <Button
        variant="ghost"
        disabled={item.disabled}
        aria-selected={selected}
        className={cn(
          "gap-2 py-6 w-full text-foreground font-normal text-[16px] justify-start",
          selected && "font-bold bg-primary/[0.25] hover:bg-primary/[0.30] text-primary",
          className
        )}
      >
        <item.Icon fill={selected ? "currentColor" : "none"} fillOpacity={selected ? 0.28 : 0} />
        {item.title}
      </Button>
    </DrawerButtonContainer>
  )
}

interface DrawerButtonContainerProps {
  usingSheet?: boolean
  children: React.ReactNode
}

const DrawerButtonContainer: React.FC<DrawerButtonContainerProps> = ({ usingSheet, children }) => {
  return usingSheet ? <SheetClose asChild>{children}</SheetClose> : <>{children}</>
}
