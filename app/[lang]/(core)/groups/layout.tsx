import GroupList, { GroupListSkeleton } from "./components/GroupList"
import { BaseGroupList } from "./base-group-list"
import { Suspense } from "react"

type GroupLayoutProps = Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>

export default async function GroupLayout({ children, modal }: GroupLayoutProps) {
  return (
    <>
      {modal}
      <div className="w-full h-full flex gap-3 xl:flex-row overflow-hidden">
        {/* This is to make sure that the group list is only rendered when the breakpoint is xl */}
        <div className="hidden xl:block flex-grow w-full max-w-md">
          <BaseGroupList isLayout>
            <Suspense fallback={<GroupListSkeleton className="w-full max-w-md" />}>
              <GroupList className="hidden xl:block flex-grow w-full max-w-md" />
            </Suspense>
          </BaseGroupList>
        </div>
        {children}
      </div>
    </>
  )
}
