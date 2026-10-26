import { Badge } from "@/components/ui/badge";
import {
  WORK_ORDER_STATUS_LABELS,
  type WorkOrderStatus,
} from "../model/order.types";
import { cn } from "@/lib/utils";

const statusStyles: Record<WorkOrderStatus, string> = {
  price:
    "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  open: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
  in_progress:
    "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
  completed:
    "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  cancelled:
    "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
};

export function OrderStatusBadge({ status }: { status: WorkOrderStatus }) {
  return (
    <Badge variant="outline" className={cn("font-medium", statusStyles[status])}>
      {WORK_ORDER_STATUS_LABELS[status] ?? status}
    </Badge>
  );
}
