import { createServerComponentClient } from "@/supabase"
import { MainDrawer } from "./components/m3/drawer/main-drawer"
import { MainAppBar } from "./components/m3/main-app-bar"

export const metadata = {
  title: "Fega",
  description: "The best social network in ega!",
  icons: [
    {
      rel: "icon",
      url: "/fega_round_1.ico",
    },
  ],
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex h-screen min-h-screen overflow-hidden">
      <MainDrawer className="hidden md:block w-72" />
      <main className="w-full flex flex-col md:pb-3 md:px-3">
        <MainAppBar authUser={user} />
        {children}
      </main>
    </div>
  )
}
