import { User } from "@supabase/supabase-js"
import { MainDrawer } from "./drawer/main-drawer"
import { MainAppBar } from "./main-app-bar"

interface MainLayoutProps {
  authUser: User | null
  children: React.ReactNode
}

export const MainLayout: React.FC<MainLayoutProps> = ({ authUser, children }) => {
  return (
    <div className="flex h-screen min-h-screen overflow-hidden pb-[6vh]">
      <MainDrawer className="hidden md:block w-72" />
      <div className="flex flex-col w-full">
        <MainAppBar authUser={authUser} />
        {children}
      </div>
    </div>
  )
}
