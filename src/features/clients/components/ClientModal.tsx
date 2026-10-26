import type { FC } from "react";
import type { Client } from "../model/client.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClientForm } from "./ClientForm";
import type { ClientFormValues } from "../model/client.schema";

type ClienteModalProps = {
  open: boolean;
  client?: Client;
  onSubmit: (data: ClientFormValues) => Promise<void>;
  isSubmitting?: boolean;
  isLoadingClient?: boolean;
  onClose: () => void;
};

export const ClientModal: FC<ClienteModalProps> = ({
  open,
  client,
  onSubmit,
  isSubmitting = false,
  isLoadingClient = false,
  onClose,
}) => {
  const isEditing = Boolean(client);
  const handleCancel = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={isSubmitting ? undefined : (o) => !o && onClose()}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar cliente" : "Nuevo cliente"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos del cliente y sus vehículos."
              : "Registra un nuevo cliente y sus vehículos."}
          </DialogDescription>
        </DialogHeader>
        {isLoadingClient ? (
          <p className="py-8 text-center text-muted-foreground">
            Cargando información del cliente...
          </p>
        ) : (
          <ClientForm
            client={client}
            onSubmit={onSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
