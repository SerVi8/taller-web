import type { ReactNode } from "react";

interface FormActionsProps {
  children: ReactNode;
}

export function FormActions({ children }: FormActionsProps) {
  return <div className="flex justify-end gap-2 pt-4">{children}</div>;
}
