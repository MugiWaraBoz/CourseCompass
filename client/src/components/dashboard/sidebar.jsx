import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
// import { AppSidebar } from "@/components/app-sidebar"

export default function sideBar({ children }) {
  return (
    <SidebarProvider>
      
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}