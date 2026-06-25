"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check local storage or system preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  if (!mounted) {
    return <div className="w-10 h-10 border border-surface-200 rounded-full bg-surface-50 animate-pulse"></div>;
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 bg-surface-50 border border-surface-200 flex items-center justify-center text-surface-600 hover:bg-surface-100 transition-colors rounded-full"
      aria-label="Toggle dark mode"
    >
      {isDark ? <Sun className="w-5 h-5 text-accent-500" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
