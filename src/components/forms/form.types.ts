import type { HTMLInputTypeAttribute } from "react";

type Field<T> = {
  name: keyof T;
  label: string;
  placeholder: string;
  type: HTMLInputTypeAttribute;
  min?: string;
  max?: string;
  step?: string;
  setValueAs?: (v: string) => void;
  className?: string;
};

export type FormFields<T> = Field<T>[];
