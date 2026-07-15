import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, BarChart3, Bell, FileText, Home, Leaf, Settings, Store, Trophy } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Visão Geral", url: "/", icon: Home },
  { title: "Shoppings", url: "/shoppings", icon: Store },
  { title: "Ranking", url: "/ranking", icon: Trophy },
  { title: "Análises", url: "/analises", icon: BarChart3 },
  { title: "ESG", url: "/esg", icon: Leaf },
  { title: "Alertas", url: "/alertas", icon: Bell },
  { title: "Relatórios", url: "/relatorios", icon: FileText },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string) => (url === "/" ? pathname === "/" : pathname.startsWith(url));

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-blue)] shadow-inner">
            <Activity className="h-5 w-5 text-[var(--sidebar)]" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight text-sidebar-foreground">ancar</div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Energy · ESG</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Portfólio</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        {!collapsed ? (
          <div className="px-2 py-2 text-[10px] leading-relaxed text-muted-foreground">
            <div>v1.0 · Dashboard operacional</div>
            <div className="mt-0.5 opacity-70">© Ancar 2026</div>
          </div>
        ) : (
          <div className="h-4" />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
