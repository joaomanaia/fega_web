import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "@/src/i18n/navigation"
import type {
  CalendarEventOtherDataType,
  CalendarEventOtherData,
  CalendarEventOtherDataItem,
} from "@/types/CalendarEvent"
import { DollarSignIcon, InfoIcon, LinkIcon, MailIcon, PhoneIcon } from "lucide-react"
import React from "react"

interface MoreInfoProps {
  data: CalendarEventOtherData
  itemPrefixContent?: (data: CalendarEventOtherDataItem) => React.ReactNode
  className?: string
}

export const MoreInfo: React.FC<MoreInfoProps> = ({ data, itemPrefixContent, className }) => {
  return (
    <div className="w-full xl:w-3/4 2xl:w-1/2 flex flex-col space-y-2 mt-4">
      <h2 className="text-lg font-bold">More Info</h2>
      <li className="flex flex-col space-y-2">
        {data.map((item, index) => (
          <MoreInfoItem
            key={index}
            type={item.type}
            label={item.value}
            itemPrefixContent={itemPrefixContent && itemPrefixContent(item)}
            className={className}
          />
        ))}
      </li>
    </div>
  )
}

interface MoreInfoItemProps {
  label: string
  type: CalendarEventOtherDataType
  itemPrefixContent?: React.ReactNode
  className?: string
}

const MoreInfoItem: React.FC<MoreInfoItemProps> = ({
  label,
  type,
  itemPrefixContent,
  className,
}) => {
  const Icon =
    type === "website"
      ? LinkIcon
      : type === "email"
      ? MailIcon
      : type === "phone"
      ? PhoneIcon
      : type === "price"
      ? DollarSignIcon
      : InfoIcon

  return (
    <ul className={cn("flex items-center space-x-2", className)}>
      {itemPrefixContent}
      <Button
        variant="link"
        className="w-full justify-start gap-2 text-surface-foreground hover:bg-surfaceVariant/20"
      >
        <Icon className="size-5" />
        <MoreInfoItemText label={label} type={type} className="truncate" />
      </Button>
    </ul>
  )
}

interface MoreInfoItemTextProps {
  label: string
  type: CalendarEventOtherDataType
  className?: string
}

const MoreInfoItemText: React.FC<MoreInfoItemTextProps> = ({ label, type, className }) => {
  if (type === "website") {
    return (
      <Link className={className} href={label}>
        {label}
      </Link>
    )
  }

  if (type === "email") {
    return (
      <Link className={className} href={`mailto:${label}`}>
        {label}
      </Link>
    )
  }

  if (type === "phone") {
    return (
      <Link className={className} href={`tel:${label}`}>
        {label}
      </Link>
    )
  }

  return <span className={className}>{label}</span>
}
