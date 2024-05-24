import { createServerComponentClient } from "@/supabase"
import { MainDrawer } from "../../components/m3/drawer/main-drawer"
import { MainAppBar } from "../../components/m3/main-app-bar"
import { Locale } from "@/i18n-config"
import { getDictionary } from "@/get-dictionary"

export const metadata = {
  title: "Fega",
  description: "The best social network in ega!",
}

interface LayoutProps {
  children?: React.ReactNode
  params: {
    lang: Locale
  }
}

export default async function Layout({ children, params }: LayoutProps) {
  const supabase = createServerComponentClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const dictionary = await getDictionary(params.lang)

  return (
    <div className="flex h-screen min-h-screen overflow-hidden">
      <MainDrawer className="hidden md:block w-72" dictionary={dictionary} lang={params.lang} />
      <main className="w-full flex flex-col md:px-3">
        <MainAppBar authUser={session?.user ?? null} dictionary={dictionary} lang={params.lang} />
        {children}
      </main>
    </div>
  )
}
