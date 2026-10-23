import { toast } from "@/components/ui/toast";

export const toastSuccess = (message: string) => {
  toast.add({ type: "success", title: "Listo", description: message });
};

export const toastError = (message: string) => {
  toast.add({
    type: "error",
    title: "No se pudo completar la acción",
    description: message,
    priority: "high",
  });
};

export const toastInfo = (message: string) => {
  toast.add({ type: "info", title: "Información", description: message });
};

export const toastWarning = (message: string) => {
  toast.add({ type: "warning", title: "Atención", description: message });
};
