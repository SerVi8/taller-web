import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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
import { useProducts } from "../hooks/use-product-queries";
import type { Product } from "../model/product.types";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

interface Props {
  value: number | undefined;
  onChange: (product: Product) => void;
}

export function ProductPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const q = useDebouncedValue(search);

  const { data } = useProducts({
    page: 1,
    limit: 20,
    status: "active",
    ...(q && { q }),
  });
  const products = data?.data ?? [];
  const selected = products.find((p) => p.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between font-normal"
        >
          <span className="truncate">
            {selected
              ? `${selected.sku} · ${selected.name}`
              : value
                ? `Producto #${value}`
                : "Buscar producto..."}
          </span>
          <ChevronsUpDown className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        {/* shouldFilter=false: el filtrado lo hace el backend */}
        <Command shouldFilter={false}>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder="SKU o nombre..."
          />
          <CommandList>
            <CommandEmpty>Sin resultados</CommandEmpty>
            {products.map((p) => (
              <CommandItem
                key={p.id}
                value={String(p.id)}
                onSelect={() => {
                  onChange(p);
                  setOpen(false);
                }}
              >
                <Check
                  className={
                    value === p.id ? "size-4 opacity-100" : "size-4 opacity-0"
                  }
                />
                <div>
                  <span className="truncate">{p.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {" "}
                    - {p.sku}
                  </span>
                </div>
                <CommandShortcut>
                  {p.stock} {p.unit}
                </CommandShortcut>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
