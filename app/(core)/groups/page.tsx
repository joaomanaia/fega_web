import { Metadata } from "next"
import GroupList from "./components/GroupList"

export const metadata: Metadata = {
  title: "Groups",
  description: "View all your groups",
}

export default function GroupPage() {
  return <GroupList className="xl:hidden w-full h-full" />
}
