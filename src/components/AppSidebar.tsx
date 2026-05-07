import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  UtensilsCrossed,
  User,
  Leaf,
  MessageCircle,
  CalendarDays,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Meal Plan", url: "/meal-plan", icon: UtensilsCrossed },
  { title: "AI Chat", url: "/chat", icon: MessageCircle },
  { title: "Profile", url: "/profile", icon: User },
  {title: "Weekly Planner", url: "/weekly-plan", icon: CalendarDays},
];

export function AppSidebar() {
  const currentPath = useRouterState({ select: (r) => r.location.pathname });
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[image:var(--gradient-primary)]">
            <Leaf className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold tracking-tight group-data-[collapsible=icon]:hidden">NutriAI</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={currentPath === item.url}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
