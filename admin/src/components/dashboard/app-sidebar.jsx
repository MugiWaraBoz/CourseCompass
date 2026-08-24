import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  MessagesSquare,
  BookOpen,
  Building2,
  LogOut,
  Users,
  UserShield,
  BarChart2,
} from 'lucide-react';
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
} from '@/components/ui/sidebar';

const navItems = [
  { title: 'Status', url: '/dashboard', icon: BarChart2 },
  { title: 'Courses', url: '/courses', icon: BookOpen },
  { title: 'Faculty', url: '/faculty', icon: Building2 },
  { title: 'Students', url: '/students', icon: Users },
  { title: 'Reviews', url: '/reviews', icon: MessagesSquare },
  { title: 'Moderators', url: '/moderators', icon: UserShield },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <Sidebar className="border-r border-cyan-400/10 bg-slate-950 text-slate-100">
      {/* Header */}
      <SidebarHeader className="border-b border-cyan-400/10 bg-[#020618] px-4 py-5">
        <div className="flex justify-center items-center gap-3">
          <div className="text-center min-w-0">
            <p className="truncate text-m font-black tracking-tight text-white">
              CourseCompass
            </p>
            <p className="font-mono text-[12px] tracking-[0.2em] text-cyan-400/60 uppercase">
              ⟨ admin ⟩
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="bg-slate-950 px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
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
                      asChild
                      isActive={isActive}
                      className={
                        isActive
                          ? 'relative bg-cyan-400/10 font-medium text-cyan-200 hover:bg-cyan-400/15 hover:text-cyan-100'
                          : 'relative text-slate-400 hover:bg-white/5 hover:text-white'
                      }
                    >
                      <Link
                        to={item.url}
                        className="flex w-full items-center gap-2.5"
                      >
                        {isActive && (
                          <span className="absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-full bg-cyan-400" />
                        )}
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="truncate text-sm">{item.title}</span>
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
      <SidebarFooter className="border-t border-cyan-400/10 bg-[#020618] px-3 py-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-400 transition-colors hover:bg-red-400/10 hover:text-red-300"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
