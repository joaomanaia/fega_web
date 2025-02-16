import type { Locale } from "@/i18n-config"
import { getDictionary } from "@/get-dictionary"
import { MainDrawer } from "@/app/components/m3/drawer/main-drawer"
import { MainHeader } from "@/app/components/header"

interface LayoutProps {
  children?: React.ReactNode
  params: Promise<{
    lang: Locale
  }>
}

export default async function Layout({ children, params }: LayoutProps) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)

  return (
    <div className="flex h-screen min-h-screen overflow-hidden">
      <MainDrawer className="hidden md:block w-72" dictionary={dictionary} lang={lang} />
      <main className="w-full flex flex-col md:px-3">
        <MainHeader dictionary={dictionary} lang={lang} />
        {children}
      </main>
    </div>
  )
}
