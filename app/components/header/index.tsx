import { ModeToggle } from "@/components/ui/mode-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet"
import { MenuIcon } from "lucide-react"
import { MainDrawer } from "@/app/components/m3/drawer/main-drawer"
import { Suspense } from "react"
import { HeaderUserAvatar } from "@/app/components/header/header-user-avatar"
import { UserAvatarSkeleton } from "@/app/components/user/user-avatar"
import { HeaderSearch } from "@/app/components/header/header-search"

export const MainHeader: React.FC = () => {
  return (
    <>
      <header className="sticky py-3 px-4 md:pr-0 flex w-full items-center justify-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              className="md:hidden text-foreground"
              color="inherit"
              variant="ghost"
              size="icon"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <MainDrawer usingSheet />
            </SheetHeader>
          </SheetContent>
        </Sheet>

        <HeaderSearch className="mx-auto" />

        <div className="flex gap-4 xl:w-full xl:max-w-sm justify-end">
          <ModeToggle />

          <Suspense fallback={<UserAvatarSkeleton />}>
            <HeaderUserAvatar />
          </Suspense>
        </div>
      </header>
    </>
  )
}
