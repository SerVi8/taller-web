import type { FC } from "react";
import { FilterBar } from "@/components/common/Filters/FilterBar";
import { SearchInput } from "@/components/common/Filters/SearchInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  WORK_ORDER_STATUS_LABELS,
  WORK_ORDER_STATUSES,
  type WorkOrderStatus,
} from "../model/order.types";
import { ClientPicker } from "./ClientPicker";

interface OrdersFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: WorkOrderStatus | "all";
  onStatusChange: (status: WorkOrderStatus | "all") => void;
  clientId: number | undefined;
  onClientChange: (clientId: number | undefined) => void;
}

export const OrdersFilter: FC<OrdersFilterProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  clientId,
  onClientChange,
}) => {
  return (
    <FilterBar>
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Buscar por código, placa o cliente..."
      />
      <Select
        value={status}
        onValueChange={(val) => onStatusChange(val as WorkOrderStatus | "all")}
      >
        <SelectTrigger className="w-44">
          <SelectValue>
            {status === "all"
              ? "Todos los estados"
              : WORK_ORDER_STATUS_LABELS[status]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los estados</SelectItem>
          {WORK_ORDER_STATUSES.map((st) => (
            <SelectItem key={st} value={st}>
              {WORK_ORDER_STATUS_LABELS[st]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="min-w-56">
        <ClientPicker
          value={clientId}
          onChange={(client) => onClientChange(client?.id)}
          placeholder="Filtrar por cliente..."
          allowClear
        />
      </div>
    </FilterBar>
  );
};
