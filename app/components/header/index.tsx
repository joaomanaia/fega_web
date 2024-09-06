import { ModeToggle } from "@/components/ui/mode-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet"
import { MenuIcon } from "lucide-react"
import { type Dictionary } from "@/get-dictionary"
import { type Locale } from "@/i18n-config"
import { MainDrawer } from "@/app/components/m3/drawer/main-drawer"
import { Suspense } from "react"
import { HeaderUserAvatar } from "@/app/components/header/header-user-avatar"
import { UserAvatarSkeleton } from "@/app/components/user/user-avatar"

interface HeaderProps {
  dictionary: Dictionary
  lang: Locale
}

export const MainHeader: React.FC<HeaderProps> = ({ dictionary, lang }) => {
  return (
    <>
      <header className="sticky py-3 px-4 md:pr-0 flex w-full items-center justify-end gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              className="md:hidden mr-auto text-foreground"
              color="inherit"
              variant="ghost"
              size="icon"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <MainDrawer dictionary={dictionary} lang={lang} usingSheet />
            </SheetHeader>
          </SheetContent>
        </Sheet>

        <ModeToggle />

        <Suspense fallback={<UserAvatarSkeleton />}>
          <HeaderUserAvatar lang={lang} />
        </Suspense>
      </header>
    </>
  )
}
