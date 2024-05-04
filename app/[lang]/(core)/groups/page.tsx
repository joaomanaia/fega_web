import { type Metadata } from "next"
import GroupList from "./components/GroupList"
import { BaseGroupList } from "./base-group-list"
import { getDictionary } from "@/get-dictionary"
import { type Locale } from "@/i18n-config"

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
    <BaseGroupList>
      <GroupList className="xl:hidden w-full h-full" dictionary={dictionary} />
    </BaseGroupList>
  )
}
