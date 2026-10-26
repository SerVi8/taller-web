import type { FC } from "react";
import type { Client } from "../model/client.types";
import type { DataTableColumn } from "@/components/common/DataTable/types";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { DataTable } from "@/components/common/DataTable/DataTable";

type ClienteTableProps = {
  clientes: Client[];
  onView: (cliente: Client) => void;
  onEdit: (cliente: Client) => void;
  onDelete: (cliente: Client) => void;
};
export const ClientsTable: FC<ClienteTableProps> = ({
  clientes,
  onView,
  onEdit,
  onDelete,
}) => {
  const columns: DataTableColumn<Client>[] = [
    {
      key: "name",
      header: "Cliente",
    },
    {
      key: "phone",
      header: "Teléfono",
    },
    {
      key: "email",
      header: "Correo",
      render: (cliente) => cliente.email || "—",
    },
    {
      key: "acciones",
      header: "",
      className: "w-12 text-right",
      render: (cliente) => (
        <div className="flex justify-end gap-1">
          <Button size="icon" variant="ghost" aria-label="Ver detalles" onClick={() => onView(cliente)}><Eye /></Button>
          <Button
            size={"icon"}
            variant={"secondary"}
            onClick={() => onEdit(cliente)}
          >
            <Pencil />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            onClick={() => onDelete(cliente)}
          >
            <Trash2 />
          </Button>
        </div>
      ),
    },
  ];
  return (
    <DataTable
      data={clientes}
      columns={columns}
      getRowKey={(cliente) => cliente.id}
    />
  );
};
