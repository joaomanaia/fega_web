import { Button } from "@/components/ui/button"
import { NavDrawerItem } from "./main-drawer"
import { cn } from "@/lib/utils"
import { SheetClose } from "@/components/ui/sheet"
import { Link } from "@/src/i18n/navigation"
import type { LucideIcon } from "lucide-react"

interface DrawerItemProps {
  title: string
  Icon: LucideIcon
  pathName: string
  disabled?: boolean
  selected?: boolean
  usingSheet?: boolean
  className?: string
}

export const DrawerItem: React.FC<DrawerItemProps> = ({
  title,
  Icon,
  pathName,
  disabled,
  selected,
  usingSheet,
  className,
}) => {
  if (disabled) {
    return (
      <DrawerButton
        title={title}
        Icon={Icon}
        disabled={disabled}
        selected={selected}
        usingSheet={usingSheet}
        className={className}
      />
    )
  }

  return (
    <Link
      href={pathName}
      className={cn(disabled && "cursor-default", className)}
      aria-disabled={disabled}
      itemProp="url"
      passHref
    >
      <DrawerButton
        title={title}
        Icon={Icon}
        disabled={disabled}
        selected={selected}
        usingSheet={usingSheet}
      />
    </Link>
  )
}

interface DrawerButtonProps {
  title: string
  Icon: LucideIcon
  disabled?: boolean
  selected?: boolean
  usingSheet?: boolean
  className?: string
}

const DrawerButton: React.FC<DrawerButtonProps> = ({
  title,
  Icon,
  disabled,
  selected,
  usingSheet,
  className,
}) => {
  return (
    <DrawerButtonContainer usingSheet={usingSheet}>
      <Button
        variant="ghost"
        disabled={disabled}
        aria-selected={selected}
        className={cn(
          "gap-2 py-6 w-full text-foreground font-normal text-[16px] justify-start",
          selected && "font-bold bg-primary/[0.25] hover:bg-primary/[0.30] text-primary",
          className
        )}
      >
        <Icon fill={selected ? "currentColor" : "none"} fillOpacity={selected ? 0.28 : 0} />
        {title}
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
