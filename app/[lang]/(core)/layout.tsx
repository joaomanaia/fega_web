import { MainDrawer } from "@/app/components/m3/drawer/main-drawer"
import { MainHeader } from "@/app/components/header"

interface LayoutProps {
  children?: React.ReactNode
}

export default async function Layout({ children }: LayoutProps) {
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
