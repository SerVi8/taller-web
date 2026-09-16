import type { FC } from "react";
import type { Cliente } from "../types/client.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClientForm } from "./ClientForm";
import type { ClienteFormData } from "../schemas/client.schema";

type ClienteModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente?: Cliente;
  onSubmit: (data: ClienteFormData) => Promise<void>;
  isSubmitting?: boolean;
};

export const ClientModal: FC<ClienteModalProps> = ({
  open,
  onOpenChange,
  cliente,
  onSubmit,
  isSubmitting = false,
}) => {
  const isEditing = Boolean(cliente);
  const handleCancel = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={isSubmitting ? undefined : onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar cliente" : "Nuevo cliente"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos del cliente."
              : "Registra un nuevo cliente del taller."}
          </DialogDescription>
        </DialogHeader>
        <ClientForm
          cliente={cliente}
          onSubmit={onSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
