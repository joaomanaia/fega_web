import GroupList from "./components/GroupList"

export default async function GroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex xl:flex-row w-full h-full overflow-none">
      <GroupList className="hidden xl:block xl:w-2/6 flex-grow" />
      {children}
    </div>
  )
}
