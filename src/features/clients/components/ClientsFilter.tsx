import { FilterBar } from "@/components/common/Filters/FilterBar";
import { SearchInput } from "@/components/common/Filters/SearchInput";
import type { FC } from "react";

type ClienteFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export const ClientsFilter: FC<ClienteFiltersProps> = ({
  search,
  onSearchChange,
}) => {
  return (
    <FilterBar>
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Buscar nombre del cliente..."
      />
    </FilterBar>
  );
};
