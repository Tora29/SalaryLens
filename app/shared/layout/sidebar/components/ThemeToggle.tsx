import { useState } from "react";

import { Moon, Sun } from "lucide-react";

import type { Theme } from "../schema";
import { getNextTheme, createThemeCookieValue } from "../service";

interface ThemeToggleProps {
  initialTheme: Theme;
}

// テーマ切り替えボタンコンポーネント
export function ThemeToggle({ initialTheme }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  const toggleTheme = () => {
    const nextTheme = getNextTheme(theme);
    setTheme(nextTheme);

    // Cookie に保存
    document.cookie = createThemeCookieValue(nextTheme);

    // html 要素の class を更新
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="min-h-12 min-w-12 flex items-center justify-center rounded-full hover:bg-gray-900/8 dark:hover:bg-white/8 active:bg-gray-900/12 dark:active:bg-white/12 transition-colors"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="w-6 h-6 text-amber-400" />
      ) : (
        <Moon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      )}
    </button>
  );
}
