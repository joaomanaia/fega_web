import { Button } from "@/components/ui/button"
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar"
import { SidebarNavigation } from "@/components/app-sidebar/sidebar-navigation"
import Link from "@/components/link"

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <Button asChild variant="ghost" className="w-full" size="lg" style={{ fontSize: 20 }}>
          <Link href="/">Fega</Link>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavigation />
      </SidebarContent>
    </Sidebar>
  )
}
