import { Link, useLocation } from "react-router-dom";

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

import { mainNavigation, secondaryNavigation } from "@/config/navigation";

import { useAuth } from "@/features/auth/hooks/useAuth";

export function AppSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const isActive = (url: string) => {
    if (url === "/admin") {
      return location.pathname === "/admin";
    }

    return location.pathname.startsWith(url);
  };

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            L
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold">Lubrillantas</span>

            <span className="text-xs text-muted-foreground">
              Administración
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavigation.map((item) => {
                const Icon = item.icon;

                return (
                  <Link to={item.url}>
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        isActive={isActive(item.url)}
                        tooltip={item.title}
                      >
                        <Icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </Link>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Sistema</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavigation.map((item) => {
                const Icon = item.icon;

                return (
                  <Link to={item.url}>
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        isActive={isActive(item.url)}
                        tooltip={item.title}
                      >
                        <Icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </Link>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-3 border-t px-2 py-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.name}</p>

            <p className="truncate text-xs text-muted-foreground">
              {user?.username}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Salir
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
