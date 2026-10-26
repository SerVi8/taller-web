export { cn } from "cn";

export const formatMoney = (value: string | number | null | undefined) =>
  `Bs ${Number(value ?? 0).toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
