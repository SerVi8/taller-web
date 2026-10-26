import { useState } from "react";

type Dialog<T> =
  | { type: "closed" }
  | { type: "create" }
  | { type: "edit"; item: T }
  | { type: "view"; item: T }
  | { type: "delete"; item: T };

export function useCrudDialogs<T>() {
  const [dialog, setDialog] = useState<Dialog<T>>({ type: "closed" });

  return {
    dialog,
    openCreate: () => setDialog({ type: "create" }),
    openEdit: (item: T) => setDialog({ type: "edit", item }),
    openView: (item: T) => setDialog({ type: "view", item }),
    openDelete: (item: T) => setDialog({ type: "delete", item }),
    close: () => setDialog({ type: "closed" }),

    // helpers para los componentes
    isFormOpen: dialog.type === "create" || dialog.type === "edit",
    isViewOpen: dialog.type === "view",
    isDeleteOpen: dialog.type === "delete",
    item:
      dialog.type === "closed" || dialog.type === "create"
        ? undefined
        : dialog.item,
  };
}
