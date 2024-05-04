import type { User } from "@supabase/supabase-js"
import { useMemo } from "react"
import Link from "next/link"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet"
import { MainDrawer } from "./drawer/main-drawer"
import { MenuIcon } from "lucide-react"
import { type Dictionary } from "@/get-dictionary"
import { type Locale } from "@/i18n-config"

interface HeaderProps {
  authUser: User | null
  dictionary: Dictionary
  lang: Locale
}

type AppBarUser = {
  name: string | null
  avatar: string | null
  actionLink: string
}

export const MainAppBar: React.FC<HeaderProps> = ({ authUser, dictionary, lang }) => {
  const userData = useMemo<AppBarUser>(() => {
    return {
      name: authUser?.user_metadata.full_name ?? authUser?.email ?? null,
      avatar: authUser?.user_metadata.avatar_url ?? null,
      actionLink: authUser ? `/${authUser.id}` : "/auth",
    }
  }, [authUser])

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

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={userData.actionLink}>
                <Avatar>
                  <AvatarImage src={userData.avatar ?? undefined} />
                  <AvatarFallback>{userData.name ?? "Make login"}</AvatarFallback>
                </Avatar>
              </Link>
            </TooltipTrigger>
            <TooltipContent>{userData.name ?? "Make login"}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </header>
    </>
  )
}
