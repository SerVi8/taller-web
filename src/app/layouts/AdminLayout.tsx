import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/common/Sidebar/AppSidebar";

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome =
    location.pathname === "/admin" || location.pathname === "/admin/";

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-14 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />

            <div className="h-4 w-px bg-border" />

            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Sistema Administrativo
            </button>
          </div>

          {!isHome && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate("/admin")}
            >
              <Home className="size-4" /> Inicio
            </Button>
          )}
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
