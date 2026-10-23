import type { FC } from "react";
import type { Client } from "../model/client.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client;
  isLoading?: boolean;
  onEdit: () => void;
};

export const ClientDetailsModal: FC<Props> = ({
  open,
  onOpenChange,
  client,
  isLoading = false,
  onEdit,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>{client?.name ?? "Detalle del cliente"}</DialogTitle>
        <DialogDescription>
          Información de contacto y vehículos registrados.
        </DialogDescription>
      </DialogHeader>
      {isLoading && (
        <p className="py-8 text-center text-muted-foreground">
          Cargando información del cliente...
        </p>
      )}
      {client && (
        <div className="max-h-[65vh] space-y-5 overflow-y-auto">
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Teléfono</dt>
              <dd>{client.phone}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">
                Correo electrónico
              </dt>
              <dd>{client.email || "—"}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Estado</dt>
              <dd>{client.active ? "Activo" : "Inactivo"}</dd>
            </div>
          </dl>
          <section className="space-y-3">
            <h3 className="font-medium">
              Vehículos ({client.vehicles?.length ?? 0})
            </h3>
            {!client.vehicles?.length ? (
              <p className="text-sm text-muted-foreground">
                Este cliente no tiene vehículos activos.
              </p>
            ) : (
              client.vehicles.map((vehicle) => (
                <article key={vehicle.id} className="rounded-lg border p-3">
                  <div className="font-medium">{vehicle.plate}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {[vehicle.model, vehicle.year, vehicle.color]
                      .filter(Boolean)
                      .join(" · ") || "Sin detalles adicionales"}
                  </div>
                </article>
              ))
            )}
          </section>
          <div className="flex justify-end">
            <Button onClick={onEdit}>Editar información</Button>
          </div>
        </div>
      )}
    </DialogContent>
  </Dialog>
);
