import { getLocalUser } from "@/utils/user-utils"
import GroupList, { GroupListSkeleton } from "./components/GroupList"
import { redirect } from "next/navigation"
import { BaseGroupList } from "./base-group-list"
import { type Locale } from "@/i18n-config"
import { getDictionary } from "@/get-dictionary"
import { Suspense } from "react"

type GroupLayoutProps = Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
  params: {
    lang: Locale
  }
}>

export const dynamic = "force-dynamic"

export default async function GroupLayout({ children, modal, params }: GroupLayoutProps) {
  const localUser = await getLocalUser()
  if (!localUser) return redirect("/auth")

  const dictionary = await getDictionary(params.lang)

  return (
    <>
      {modal}
      <div className="w-full h-full flex gap-3 xl:flex-row overflow-hidden">
        {/* This is to make sure that the group list is only rendered when the breakpoint is xl */}
        <BaseGroupList isLayout>
          <Suspense fallback={<GroupListSkeleton className="w-full max-w-md" />}>
            <GroupList
              className="hidden xl:block flex-grow w-full max-w-md"
              lang={params.lang}
              dictionary={dictionary}
            />
          </Suspense>
        </BaseGroupList>
        {children}
      </div>
    </>
  )
}
