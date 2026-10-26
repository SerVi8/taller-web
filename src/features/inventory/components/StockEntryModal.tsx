import type { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { StockEntryFormValues } from "../model/stock.schema";
import { StockEntryForm } from "./StockEntryForm";

type StockEntryModalProps = {
  open: boolean;
  onSubmit: (data: StockEntryFormValues) => Promise<void>;
  isSubmitting?: boolean;
  onClose: () => void;
};

export const StockEntryModal: FC<StockEntryModalProps> = ({
  open,
  onSubmit,
  isSubmitting = false,
  onClose,
}) => {
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
          <DialogTitle>Regitro de entrada</DialogTitle>
          <DialogDescription>
            Registra la entrada de productos.
          </DialogDescription>
        </DialogHeader>
        <StockEntryForm
          onSubmit={onSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
