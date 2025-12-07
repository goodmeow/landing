import { useEffect, useMemo, useState } from "react";

export type ThemeMode = "light" | "dark";

type ThemeState = {
  theme: ThemeMode;
  manual: boolean;
};

const THEME_STORAGE_KEY = "gm-theme-preference";

function resolvePreferredTheme(): ThemeState {
  if (typeof window === "undefined") {
    return { theme: "dark", manual: false };
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (stored === "light" || stored === "dark") {
    return { theme: stored, manual: true };
  }

  const prefersLight = window.matchMedia?.(
    "(prefers-color-scheme: light)",
  ).matches;

  return { theme: prefersLight ? "light" : "dark", manual: false };
}

export function useThemePreference() {
  const [{ theme, manual }, setThemeState] = useState<ThemeState>(
    resolvePreferredTheme,
  );

  const nextTheme = theme === "light" ? "dark" : "light";

  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;

    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    if (typeof window !== "undefined") {
      if (manual) {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
      } else {
        window.localStorage.removeItem(THEME_STORAGE_KEY);
      }
    }
  }, [theme, manual]);

  useEffect(() => {
    if (manual || typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const handleChange = (event: MediaQueryListEvent) => {
      setThemeState({
        theme: event.matches ? "light" : "dark",
        manual: false,
      });
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [manual]);

  const toggleTheme = () => {
    setThemeState({ theme: nextTheme, manual: true });
  };

  const setTheme = (value: ThemeMode, isManual = true) => {
    setThemeState({ theme: value, manual: isManual });
  };

  return useMemo(
    () => ({
      theme,
      manual,
      nextTheme,
      toggleTheme,
      setTheme,
    }),
    [manual, nextTheme, theme],
  );
}
