import { useState, useEffect } from "react";

type Theme = "light" | "dark" | "system";

const THEME_KEY = "theme";
const isTheme = (value: string | null): value is Theme => value === "light" || value === "dark" || value === "system";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    const stored = localStorage.getItem(THEME_KEY);
    if (isTheme(stored)) return stored;
    return "system";
  });

  const applyTheme = (value: Theme) => {
    const root = document.documentElement;
    const darkMode = value === "dark" || (value === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => {
      applyTheme("system");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === "dark") return "light";
      if (prev === "light") return "system";
      return "dark";
    });
  };

  return { theme, setTheme, toggleTheme };
}
