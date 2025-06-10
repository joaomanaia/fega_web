import { MainDrawer } from "@/app/components/m3/drawer/main-drawer"
import { MainHeader } from "@/app/components/header"
import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"

interface LayoutProps {
  children?: React.ReactNode
  params: Promise<{
    lang: Locale
  }>
}

export default async function Layout({ children, params }: LayoutProps) {
  const { lang } = await params
  // Enable static rendering
  setRequestLocale(lang)

  return (
    <div className="flex h-screen min-h-screen overflow-hidden">
      <MainDrawer className="hidden md:block w-72" />
      <main className="w-full flex flex-col md:px-3">
        <MainHeader />
        {children}
      </main>
    </div>
  )
}
