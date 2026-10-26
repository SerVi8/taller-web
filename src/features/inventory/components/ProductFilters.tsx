import { FilterBar } from "@/components/common/Filters/FilterBar";
import { SearchInput } from "@/components/common/Filters/SearchInput";
import type { useListFilters } from "@/hooks/useListFilters";
import type { ReactNode } from "react";

export function ProductFilter({
  list,
  children,
}: {
  list: ReturnType<typeof useListFilters>;
  children?: ReactNode;
}) {
  return (
    <FilterBar>
      <SearchInput
        value={list.search}
        onChange={list.setSearch}
        placeholder="Buscar producto..."
      />
      {/* <StatusFilter value={list.filters.status} onChange={list.setStatus} /> */}
      {children /* acciones o filtros extra de cada página */}
    </FilterBar>
  );
}
