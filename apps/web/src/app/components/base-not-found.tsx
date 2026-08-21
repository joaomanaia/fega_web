import { Button, buttonVariants } from "@workspace/ui/components/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty"
import { cn } from "@workspace/ui/lib/utils"
import { NewspaperIcon, type LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"

interface BaseNotFoundProps {
  title: string
  description: string
  Icon?: LucideIcon
}

export const BaseNotFound: React.FC<BaseNotFoundProps> = ({ title, description, Icon }) => {
  const t = useTranslations("General")

  return (
    <Empty className="h-full w-full rounded-[30px] rounded-b-none bg-[#fbf8fd] px-4 py-4 text-[#1b1b1f] md:mb-3 md:rounded-b-3xl md:px-6 md:py-6 dark:bg-[#131316] dark:text-[#e4e2e6]">
      <EmptyHeader>
        <EmptyMedia variant="icon">{Icon ? <Icon /> : <NewspaperIcon />}</EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          {t("goToHomepage")}
        </Link>
      </EmptyContent>
    </Empty>
  )
}
