import { getLocalUser } from "@/utils/user-utils"
import GroupList from "./components/GroupList"
import { redirect } from "next/navigation"

type GroupLayoutProps = {
  children: React.ReactNode
}

export const dynamic = "force-dynamic"

export default async function GroupLayout({ children }: GroupLayoutProps) {
  const localUser = await getLocalUser()
  if (!localUser) return redirect("/auth")

  return (
    <div className="flex xl:flex-row w-full h-full overflow-hidden">
      <GroupList className="hidden xl:block xl:w-2/6 flex-grow" />
      {children}
    </div>
  )
}
