import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

export default function SideBar({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="min-h-screen w-full bg-[#020817]">
        <div className="sticky top-0 z-40 flex items-center gap-2 border-b border-cyan-400/10 bg-[#020817]/90 px-4 py-3 backdrop-blur-sm">
          <SidebarTrigger className="text-slate-400 hover:bg-white/5 hover:text-white" />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
