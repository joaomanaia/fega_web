import { Metadata } from "next"
import GroupList from "./components/GroupList"
import { BaseGroupList } from "./base-group-list"

export const metadata: Metadata = {
  title: "Groups",
  description: "View all your groups",
}

export default function GroupPage() {
  return (
    <BaseGroupList>
      <GroupList className="xl:hidden w-full h-full" />
    </BaseGroupList>
  )
}
