import { Button } from "@/components/ui/button"
import { NavDrawerItem } from "./main-drawer"
import { cn } from "@/lib/utils"
import { SheetClose } from "@/components/ui/sheet"
import { Link } from "@/components/link"
import { type Locale } from "@/i18n-config"

interface DrawerItemProps {
  item: NavDrawerItem
  selected?: boolean
  usingSheet?: boolean
  className?: string
  lang: Locale
}

export const DrawerItem: React.FC<DrawerItemProps> = ({
  item,
  selected,
  usingSheet,
  className,
  lang,
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
      lang={lang}
      itemProp="url"
      passHref
    >
      <DrawerButton item={item} selected={selected} usingSheet={usingSheet} />
    </Link>
  )
}

interface DrawerButtonProps {
  item: NavDrawerItem
  selected?: boolean
  usingSheet?: boolean
  className?: string
}

const DrawerButton: React.FC<DrawerButtonProps> = ({ item, selected, usingSheet, className }) => {
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
