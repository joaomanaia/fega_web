import { Suspense } from "react"
import { MenuIcon } from "lucide-react"
import { AvatarSkeleton } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet"
import { HeaderSearch } from "@/app/components/header/header-search"
import { HeaderUserAvatar } from "@/app/components/header/header-user-avatar"
import { MainDrawer } from "@/app/components/m3/drawer/main-drawer"

export const MainHeader: React.FC = () => {
  return (
    <>
      <header className="sticky flex w-full items-center justify-center gap-4 px-4 py-3 md:pr-0">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              className="text-foreground md:hidden"
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

        <div className="flex justify-end gap-4 xl:w-full xl:max-w-sm">
          <ModeToggle />

          <Suspense fallback={<AvatarSkeleton />}>
            <HeaderUserAvatar />
          </Suspense>
        </div>
      </header>
    </>
  )
}
