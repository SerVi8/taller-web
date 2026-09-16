import type { FC } from "react";
import type { Cliente } from "../types/client.types";
import type { DataTableColumn } from "@/components/common/DataTable/types";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { DataTable } from "@/components/common/DataTable/DataTable";

type ClienteTableProps = {
  clientes: Cliente[];
  onEdit: (cliente: Cliente) => void;
  onDelete: (cliente: Cliente) => void;
};
export const ClientsTable: FC<ClienteTableProps> = ({
  clientes,
  onEdit,
  onDelete,
}) => {
  const columns: DataTableColumn<Cliente>[] = [
    {
      key: "nombre",
      header: "Cliente",
    },
    {
      key: "telefono",
      header: "Teléfono",
    },
    {
      key: "email",
      header: "Correo",
      render: (cliente) => cliente.email || "—",
    },
    {
      key: "direccion",
      header: "Dirección",
      render: (cliente) => cliente.direccion || "—",
    },
    {
      key: "acciones",
      header: "",
      className: "w-12 text-right",
      render: (cliente) => (
        <div>
          <Button
            size={"icon"}
            variant={"secondary"}
            onClick={() => onEdit(cliente)}
          >
            <Pencil />
          </Button>
          <Button
            size={"icon"}
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
