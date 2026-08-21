import { buttonVariants } from "@workspace/ui/components/button"
import { Sidebar, SidebarContent, SidebarHeader } from "@workspace/ui/components/sidebar"
import { cn } from "@workspace/ui/lib/utils"
import { SidebarNavigation } from "@/components/app-sidebar/sidebar-navigation"
import Link from "@/components/link"

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "w-full")}
          style={{ fontSize: 20 }}
        >
          Fega
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavigation />
      </SidebarContent>
    </Sidebar>
  )
}
