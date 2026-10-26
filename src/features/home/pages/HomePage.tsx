import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ClipboardList,
  Compass,
  Package,
  Plus,
  Users,
  Wrench,
} from "lucide-react";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        title="Lubrillantas · Panel Principal"
        description="Selecciona una acción rápida para comenzar a trabajar."
      />

      {/* Acciones principales: Creación de órdenes */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Recepción de Vehículos
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="justify-between">
            <CardHeader>
              <div className="mb-1 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Wrench className="size-5" />
              </div>
              <CardTitle>Nueva Orden de Trabajo</CardTitle>
              <CardDescription>
                Registra el ingreso de un vehículo desde cero con sus fallas, servicios o repuestos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full justify-between"
                onClick={() => navigate("/admin/orders/new")}
              >
                <span className="flex items-center gap-2">
                  <Plus className="size-4" /> Crear orden en blanco
                </span>
                <ArrowRight className="size-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="justify-between">
            <CardHeader>
              <div className="mb-1 flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <Compass className="size-5" />
              </div>
              <CardTitle>Orden de Alineado y Balanceado</CardTitle>
              <CardDescription>
                Inicia una orden con el servicio de alineación y balanceo ya pre-cargado en la lista.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="secondary"
                className="w-full justify-between"
                onClick={() =>
                  navigate("/admin/orders/new?preset=alignment")
                }
              >
                <span className="flex items-center gap-2">
                  <Plus className="size-4" /> Crear con Alineado y Balanceo
                </span>
                <ArrowRight className="size-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Accesos rápidos a módulos */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Accesos Directos
        </h2>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
            className="flex items-center justify-between rounded-xl border bg-card p-4 text-left transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex size-10 items-center justify-center rounded-lg border bg-background">
                <ClipboardList className="size-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Órdenes de Trabajo</p>
                <p className="text-xs text-muted-foreground">
                  Ver listado, filtrar estados y gestionar órdenes activas.
                </p>
              </div>
            </div>
            <ArrowRight className="size-4 text-muted-foreground" />
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/clients")}
            className="flex items-center justify-between rounded-xl border bg-card p-4 text-left transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex size-10 items-center justify-center rounded-lg border bg-background">
                <Users className="size-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Clientes y Vehículos</p>
                <p className="text-xs text-muted-foreground">
                  Administrar clientes registrados y sus vehículos.
                </p>
              </div>
            </div>
            <ArrowRight className="size-4 text-muted-foreground" />
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/inventory/products")}
            className="flex items-center justify-between rounded-xl border bg-card p-4 text-left transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex size-10 items-center justify-center rounded-lg border bg-background">
                <Package className="size-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Productos e Inventario</p>
                <p className="text-xs text-muted-foreground">
                  Consultar stock, precios, registrar productos y entradas.
                </p>
              </div>
            </div>
            <ArrowRight className="size-4 text-muted-foreground" />
          </button>
        </div>
      </section>
    </div>
  );
};
