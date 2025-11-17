import { Suspense } from "react"
import { AvatarSkeleton } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { HeaderSearch } from "@/app/components/header/header-search"
import { HeaderUserAvatar } from "@/app/components/header/header-user-avatar"

export const MainHeader: React.FC = () => {
  return (
    <>
      <header className="sticky flex w-full items-center justify-center gap-4 px-4 py-3 md:px-0">
        <SidebarTrigger />

        <HeaderSearch className="mx-auto" />

        <div className="flex justify-end gap-4 xl:w-full xl:max-w-sm">
          <Suspense fallback={<AvatarSkeleton />}>
            <HeaderUserAvatar />
          </Suspense>
        </div>
      </header>
    </>
  )
}
