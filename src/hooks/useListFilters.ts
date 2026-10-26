import { useState } from "react";
import { useDebouncedValue } from "./use-debounced-value";

type Status = "active" | "inactive" | "all";

interface BaseFilters {
  page: number;
  limit: number;
  q: string;
  status: Status;
}

export function useListFilters<TExtra extends object = object>(
  initial?: Partial<BaseFilters> & { extra?: TExtra },
) {
  const [search, setSearch] = useState(initial?.q ?? "");
  const debouncedSearch = useDebouncedValue(search);

  const [state, setState] = useState({
    page: initial?.page ?? 1,
    limit: initial?.limit ?? 10,
    status: initial?.status ?? ("active" as Status),
    extra: (initial?.extra ?? {}) as TExtra,
  });

  const filters = {
    page: state.page,
    limit: state.limit,
    status: state.status,
    ...state.extra,
    ...(debouncedSearch && { q: debouncedSearch }),
  } as Omit<BaseFilters, "q"> & TExtra & { q?: string };

  // Cualquier cambio de filtro vuelve a la página 1; solo setPage la conserva
  const resetPage = <T extends object>(patch: T) =>
    setState((s) => ({ ...s, ...patch, page: 1 }));

  return {
    filters,
    search,
    setSearch: (value: string) => {
      setSearch(value);
      setState((s) => ({ ...s, page: 1 }));
    },
    setPage: (page: number) => setState((s) => ({ ...s, page })),
    setLimit: (limit: number) => resetPage({ limit }),
    setStatus: (status: Status) => resetPage({ status }),
    setExtra: (extra: Partial<TExtra>) =>
      setState((s) => ({ ...s, extra: { ...s.extra, ...extra }, page: 1 })),
  };
}
