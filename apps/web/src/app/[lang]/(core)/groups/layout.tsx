import { Suspense } from "react"
import { BaseGroupList } from "./base-group-list"
import GroupList, { GroupListSkeleton } from "./components/GroupList"

export default async function GroupLayout({ children, modal }: LayoutProps<"/[lang]/groups">) {
  return (
    <>
      {modal}
      <div className="flex h-full w-full gap-3 overflow-hidden xl:flex-row">
        {/* This is to make sure that the group list is only rendered when the breakpoint is xl */}
        <div className="hidden w-full max-w-md grow xl:block">
          <BaseGroupList isLayout>
            <Suspense fallback={<GroupListSkeleton className="w-full max-w-md" />}>
              <GroupList className="hidden w-full max-w-md grow xl:block" />
            </Suspense>
          </BaseGroupList>
        </div>
        {children}
      </div>
    </>
  )
}
