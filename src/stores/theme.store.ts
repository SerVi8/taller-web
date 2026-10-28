import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "system" ? getSystemTheme() : theme;
}

export function applyThemeToDocument(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const resolved = resolveTheme(theme);

  root.classList.remove("light", "dark");
  root.classList.add(resolved);
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "system",

      setTheme: (theme) => {
        applyThemeToDocument(theme);
        set({ theme });
      },

      toggleTheme: () => {
        const currentResolved = resolveTheme(get().theme);
        const nextTheme: Theme = currentResolved === "dark" ? "light" : "dark";
        applyThemeToDocument(nextTheme);
        set({ theme: nextTheme });
      },
    }),
    {
      name: "lubrillantas-theme",
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyThemeToDocument(state.theme);
        }
      },
    },
  ),
);
