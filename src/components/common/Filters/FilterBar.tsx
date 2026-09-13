import type { ReactNode } from "react";

interface FilterBarProps {
  children: ReactNode;
  actions?: ReactNode;
}

export function FilterBar({ children, actions }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">{children}</div>

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
