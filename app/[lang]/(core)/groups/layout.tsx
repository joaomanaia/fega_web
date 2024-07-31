import { getLocalUser } from "@/utils/user-utils"
import GroupList from "./components/GroupList"
import { redirect } from "next/navigation"
import { BaseGroupList } from "./base-group-list"
import { type Locale } from "@/i18n-config"
import { getDictionary } from "@/get-dictionary"

type GroupLayoutProps = {
  children: React.ReactNode
  params: {
    lang: Locale
  }
}

export const dynamic = "force-dynamic"

export default async function GroupLayout({ children, params }: GroupLayoutProps) {
  const localUser = await getLocalUser()
  if (!localUser) return redirect("/auth")

  const dictionary = await getDictionary(params.lang)

  return (
    <div className="w-full h-full flex gap-3 xl:flex-row overflow-hidden">
      {/* This is to make sure that the group list is only rendered when the breakpoint is xl */}
      <BaseGroupList isLayout>
        <GroupList className="hidden xl:block xl:w-2/6 flex-grow" dictionary={dictionary} />
      </BaseGroupList>
      {children}
    </div>
  )
}
