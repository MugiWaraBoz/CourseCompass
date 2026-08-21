import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function Layout({ children }) {
  const content = children ?? <Outlet />;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-950 text-slate-50">
        <AppSidebar />

        <SidebarInset className="flex-1 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.22),transparent_33%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.18),transparent_30%),linear-gradient(135deg,_#020817_0%,_#0f172a_48%,_#111827_100%)]">
          <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-3 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-slate-200 hover:bg-slate-800 hover:text-white" />
              <span className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-200">
                CourseCompass
              </span>
            </div>
          </header>

          <main className="relative flex-1 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="relative">{content}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
