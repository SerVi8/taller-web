import type { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Product } from "../model/product.types";
import type { ProductFormValues } from "../model/product.schema";
import { ProductForm } from "./ProductForm";

type ProductModalProps = {
  open: boolean;
  product?: Product;
  onSubmit: (data: ProductFormValues) => Promise<void>;
  isSubmitting?: boolean;
  isLoadingClient?: boolean;
  onClose: () => void;
};

export const ProductModal: FC<ProductModalProps> = ({
  open,
  product,
  onSubmit,
  isSubmitting = false,
  isLoadingClient = false,
  onClose,
}) => {
  const isEditing = Boolean(product);
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
            {isEditing ? "Editar producto" : "Nuevo producto"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos del producto."
              : "Registra un nuevo producto."}
          </DialogDescription>
        </DialogHeader>
        {isLoadingClient ? (
          <p className="py-8 text-center text-muted-foreground">
            Cargando información del producto...
          </p>
        ) : (
          <ProductForm
            product={product}
            onSubmit={onSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
