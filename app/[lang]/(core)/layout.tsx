import { SidebarProvider } from "@/components/ui/sidebar"
import { MainHeader } from "@/app/components/header"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: LayoutProps<"/[lang]">) {
  return (
    <div className="flex h-screen min-h-screen overflow-hidden">
      <SidebarProvider>
        <AppSidebar />

        <main className="flex w-full min-w-0 flex-col md:px-3">
          <MainHeader />
          {children}
        </main>
      </SidebarProvider>
    </div>
  )
}
