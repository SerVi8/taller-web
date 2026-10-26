import { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useClients } from "@/features/clients/hooks/use-client-queries";
import type { Client } from "@/features/clients/model/client.types";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

interface ClientPickerProps {
  value: number | undefined;
  onChange: (client: Client | undefined) => void;
  placeholder?: string;
  allowClear?: boolean;
  selectedLabel?: string;
}

export function ClientPicker({
  value,
  onChange,
  placeholder = "Buscar cliente...",
  allowClear = false,
  selectedLabel,
}: ClientPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const q = useDebouncedValue(search);

  const { data } = useClients({
    page: 1,
    limit: 20,
    status: "active",
    ...(q && { q }),
  });

  const clients = data?.data ?? [];
  const selected = clients.find((c) => c.id === value);

  const label = selected
    ? `${selected.name} · ${selected.phone}`
    : selectedLabel
      ? selectedLabel
      : value
        ? `Cliente #${value}`
        : placeholder;

  return (
    <div className="flex items-center gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className={"w-full"}>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between font-normal"
          >
            <span className="truncate">{label}</span>
            <ChevronsUpDown className="size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-120 p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder="Nombre o teléfono..."
            />
            <CommandList>
              <CommandEmpty>No se encontraron clientes</CommandEmpty>
              {clients.map((client) => (
                <CommandItem
                  key={client.id}
                  value={String(client.id)}
                  onSelect={() => {
                    onChange(client);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={
                      value === client.id
                        ? "size-4 opacity-100"
                        : "size-4 opacity-0"
                    }
                  />
                  <span className="truncate">{client.name}</span>
                  <CommandShortcut>{client.phone}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {allowClear && value && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => onChange(undefined)}
          aria-label="Limpiar filtro de cliente"
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}
