import { type Metadata } from "next"
import GroupList from "./components/GroupList"
import { BaseGroupList } from "./base-group-list"
import { type Dictionary, getDictionary } from "@/get-dictionary"
import { type Locale } from "@/i18n-config"
import { MainContainer } from "@/app/components/m3/main-container"
import { MessageCircleIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "Groups",
  description: "View all your groups",
}

interface GroupPageProps {
  params: {
    lang: Locale
  }
}

export default async function GroupPage({ params }: GroupPageProps) {
  const dictionary = await getDictionary(params.lang)

  return (
    <>
      <BaseGroupList>
        <GroupList className="xl:hidden w-full h-full" dictionary={dictionary} />
      </BaseGroupList>
      {/* This is only visible on desktop */}
      <EmptyMessagesContent dictionary={dictionary} />
    </>
  )
}

interface EmptyMessagesContentProps {
  dictionary: Dictionary
}

const EmptyMessagesContent: React.FC<EmptyMessagesContentProps> = ({ dictionary }) => {
  return (
    <MainContainer className="hidden xl:flex xl:flex-col xl:w-4/6 h-auto items-center justify-center text-center mb-3">
      <MessageCircleIcon className="mx-auto size-16 text-foreground" />
      <h2 className="text-2xl font-bold mt-4">{dictionary.groups.startMessagingTitle}</h2>
      <p className="mt-2 text-secondary/80 max-w-md">
        {dictionary.groups.startMessagingDescription}
      </p>
    </MainContainer>
  )
}
