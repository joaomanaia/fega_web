import { use } from "react"
import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { MainHeader } from "@/app/components/header"
import { MainDrawer } from "@/app/components/m3/drawer/main-drawer"

interface LayoutProps {
  children?: React.ReactNode
  params: Promise<{
    lang: Locale
  }>
}

export default function Layout({ children, params }: LayoutProps) {
  const { lang } = use(params)
  // Enable static rendering
  setRequestLocale(lang)

  return (
    <div className="flex h-screen min-h-screen overflow-hidden">
      <MainDrawer className="hidden w-72 md:flex" />
      <main className="flex w-full flex-col md:px-3">
        <MainHeader />
        {children}
      </main>
    </div>
  )
}
