import { toast } from "@/components/ui/toast";


export const toastSuccess = (message: string) => {
  toast.add({type:"success", description: message});
};

export const toastError = (message: string) => {
  toast.add({type:"error", description:message, priority:"high"});
};

export const toastInfo = (message: string) => {
  toast.add({type:"info", description: message});
};

export const toastWarning = (message: string) => {
  toast.add({type:"Warning", description: message});
};