import { Suspense } from "react"
import { MessageCircleIcon } from "lucide-react"
import { type Metadata } from "next"
import { useTranslations } from "next-intl"
import { MainContainer } from "@/app/components/m3/main-container"
import { BaseGroupList } from "./base-group-list"
import GroupList, { GroupListSkeleton } from "./components/GroupList"

export const metadata: Metadata = {
  title: "Groups",
  description: "View all your groups",
}

export default async function GroupPage() {
  return (
    <>
      <BaseGroupList>
        <Suspense fallback={<GroupListSkeleton className="h-full w-full" />}>
          <GroupList className="h-full w-full xl:hidden" />
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
    <MainContainer className="mb-3 hidden h-auto w-full items-center justify-center text-center xl:flex xl:flex-col">
      <MessageCircleIcon className="text-foreground mx-auto size-16" />
      <h2 className="mt-4 text-2xl font-bold">{t("startMessagingTitle")}</h2>
      <p className="text-secondary/80 mt-2 max-w-md">{t("startMessagingDescription")}</p>
    </MainContainer>
  )
}
