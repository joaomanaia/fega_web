import { getLocalUser } from "@/utils/user-utils"
import GroupList from "./components/GroupList"
import { redirect } from "next/navigation"
import { BaseGroupList } from "./base-group-list"

type GroupLayoutProps = {
  children: React.ReactNode
}

export const dynamic = "force-dynamic"

export default async function GroupLayout({ children }: GroupLayoutProps) {
  const localUser = await getLocalUser()
  if (!localUser) return redirect("/auth")

  return (
    <div className="flex gap-3 xl:flex-row w-full h-full overflow-hidden">
      {/* This is to make sure that the group list is only rendered when the breakpoint is xl */}
      <BaseGroupList isLayout>
        <GroupList className="hidden xl:block xl:w-2/6 flex-grow" />
      </BaseGroupList>
      {children}
    </div>
  )
}
