import { Outlet } from "react-router-dom";

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r bg-card md:block">
          <div className="flex h-16 items-center border-b px-6">
            <h1 className="text-primary font-semibold">Lubrillantas</h1>
          </div>

          <nav className="p-4">
            {/* Aquí posteriormente irán los items del menú */}
          </nav>
        </aside>

        {/* Contenido principal */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header className="flex h-16 items-center border-b bg-card px-6">
            <h2 className="text-sm font-medium">Sistema Administrativo</h2>
          </header>

          {/* Página actual */}
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
