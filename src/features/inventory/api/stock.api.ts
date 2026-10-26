import type {
  StockEntryInput,
  StockMovementFilters,
  StockMoventsResponce,
} from "../model/stock.types";
import { api } from "@/lib/http/api-client";

const stockUrl = "/stock";

export const stockApi = {
  listMovements: async (
    filters: StockMovementFilters,
  ): Promise<StockMoventsResponce> =>
    (
      await api.get<StockMoventsResponce>(`${stockUrl}/movements`, {
        params: filters,
      })
    ).data,
  entry: async (data: StockEntryInput): Promise<{ lines: number }> =>
    (await api.post<{ lines: number }>(`${stockUrl}/entries`, data)).data,
};
