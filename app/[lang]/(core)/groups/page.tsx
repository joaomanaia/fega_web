import { type Metadata } from "next"
import GroupList, { GroupListSkeleton } from "./components/GroupList"
import { BaseGroupList } from "./base-group-list"
import { MainContainer } from "@/app/components/m3/main-container"
import { MessageCircleIcon } from "lucide-react"
import { Suspense } from "react"
import { setRequestLocale } from "next-intl/server"
import { useTranslations, type Locale } from "next-intl"

export const metadata: Metadata = {
  title: "Groups",
  description: "View all your groups",
}

interface GroupPageProps {
  params: Promise<{
    lang: Locale
  }>
}

export default async function GroupPage(props: GroupPageProps) {
  const params = await props.params
  // Enable static rendering
  setRequestLocale(params.lang)

  return (
    <>
      <BaseGroupList>
        <Suspense fallback={<GroupListSkeleton className="w-full h-full" />}>
          <GroupList className="xl:hidden w-full h-full" />
        </Suspense>
      </BaseGroupList>
      {/* This is only visible on desktop */}
      <EmptyMessagesContent />
    </>
  )
}

const EmptyMessagesContent: React.FC = () => {
  const t = useTranslations("GroupsPage")

  return (
    <MainContainer className="hidden xl:flex xl:flex-col w-full h-auto items-center justify-center text-center mb-3">
      <MessageCircleIcon className="mx-auto size-16 text-foreground" />
      <h2 className="text-2xl font-bold mt-4">{t("startMessagingTitle")}</h2>
      <p className="mt-2 text-secondary/80 max-w-md">{t("startMessagingDescription")}</p>
    </MainContainer>
  )
}
