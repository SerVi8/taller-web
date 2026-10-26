import { useQuery } from "@tanstack/react-query";
import { clientApi } from "../api/client.api";
import { clientKeys } from "../model/client.keys";
import type { ClientFilters } from "../model/client.types";

export function useClients(filters: ClientFilters) {
  return useQuery({
    queryKey: clientKeys.list(filters),
    queryFn: () => clientApi.list(filters),
    placeholderData: (previousData) => previousData,
  });
}

export function useClient(id: number | undefined) {
  return useQuery({
    queryKey: clientKeys.detail(id ?? 0),
    queryFn: () => clientApi.getById(id!),
    enabled: id !== undefined,
  });
}
