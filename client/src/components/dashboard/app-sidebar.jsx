import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MessagesSquare,
  BookOpen,
  Building2,
  LogOut,
  Users,
  UserShield,
  BarChart2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Status", url: "/dashboard", icon: BarChart2 },
  { title: "Courses", url: "/courses", icon: BookOpen },
  { title: "Faculty", url: "/faculty", icon: Building2 },
  { title: "Students", url: "/students", icon: Users },
  { title: "Reviews", url: "/reviews", icon: MessagesSquare },
  { title: "Moderators", url: "/moderators", icon: UserShield },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("courseCompassAuth");
    navigate("/");
  }

  return (
    <Sidebar className="border-r border-slate-800 bg-slate-950 text-slate-100">
      {/* Header */}
      <SidebarHeader className="border-b border-slate-800 bg-[#020618] px-4 py-4">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm font-semibold tracking-wide text-cyan-200">
              CourseCompass
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
              Admin
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="bg-slate-950 px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-slate-400">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive}
                      className={
                        isActive
                          ? "bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/15"
                          : "text-slate-200 hover:bg-slate-800 hover:text-white"
                      }
                    >
                      <Link
                        to={item.url}
                        className="flex w-full items-center gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-slate-800 bg-[#020618] px-3 py-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
