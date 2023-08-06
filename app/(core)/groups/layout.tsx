import GroupList from "./components/GroupList"

type GroupLayoutProps = {
  children: React.ReactNode
}

export const dynamic = "force-dynamic"

export default async function GroupLayout({ children }: GroupLayoutProps) {
  return (
    <div className="flex xl:flex-row w-full h-full overflow-none">
      <GroupList className="hidden xl:block xl:w-2/6 flex-grow" />
      {children}
    </div>
  )
}
