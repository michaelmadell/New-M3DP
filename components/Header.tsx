"use client";

import "../app/globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "./Button";

const navConfig = {
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      href: "/shop",
      title: "Shop",
    },
    {
      href: "/gallery",
      title: "Gallery",
    },
    {
      href: "/blog",
      title: "Blog",
    },
    {
      href: "/about",
      title: "About",
    },
    {
      href: "/quote",
      title: "Get Quote",
    },
  ],
};

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themePreference, setThemePreference] = useState<
    "system" | "dark" | "light"
  >("system");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const savedPreference = localStorage.getItem("theme");
    if (
      savedPreference === "system" ||
      savedPreference === "dark" ||
      savedPreference === "light"
    ) {
      setThemePreference(savedPreference);
      return;
    }

    setThemePreference("system");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", themePreference);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const syncTheme = () => {
      if (themePreference === "system") {
        document.documentElement.removeAttribute("data-theme");
        setTheme(mediaQuery.matches ? "light" : "dark");
        return;
      }

      document.documentElement.setAttribute("data-theme", themePreference);
      setTheme(themePreference);
    };

    syncTheme();

    if (themePreference === "system") {
      mediaQuery.addEventListener("change", syncTheme);
      return () => mediaQuery.removeEventListener("change", syncTheme);
    }

    return;
  }, [themePreference]);

  const toggleTheme = () => {
    setThemePreference((current) => {
      if (current === "system") return "light";
      if (current === "light") return "dark";
      return "system";
    });
  };

  const themeLabel =
    themePreference.charAt(0).toUpperCase() + themePreference.slice(1);

  return (
    <header className="w-full sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/85 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 border-2 bg-[var(--color-primary)]/10 border-[var(--color-primary)] flex items-center justify-center font-bold text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-[var(--color-bg)] transition-all">
              M3DP
            </div>
            <div className="font-bold text-lg">
              <span className="text-[var(--color-fg)]">Monkeys</span>
              <span className="text-[var(--color-primary)]">3DPrints</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center gap-3 md:gap-6">
            <nav className="hidden md:flex items-center gap-6">
              {navConfig.mainNav.map((item) => {
                const isQuote = item.href === "/quote";
                return isQuote ? (
                  <Button key={item.href} asChild variant="digital" size="sm">
                    <Link href={item.href}>Get Quote</Link>
                  </Button>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-[var(--color-fg)]/80 hover:text-[var(--color-fg)] transition-colors"
                  >
                    {item.title}
                  </Link>
                );
              })}
            </nav>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              aria-label="Toggle theme mode"
              title={`Theme: ${themePreference}. Click to switch mode.`}
              className="border border-[var(--color-border)] text-[var(--color-fg)] hover:bg-[var(--color-surface-2)] gap-2 px-3"
            >
              {themePreference === "system" ? (
                <Monitor size={18} />
              ) : theme === "dark" ? (
                <Moon size={18} />
              ) : (
                <Sun size={18} />
              )}
              <span className="hidden md:inline text-xs uppercase tracking-wide">
                {themeLabel}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={`md:hidden hamburger-menu ${mobileMenuOpen ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </Button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="absolute right-4 top-20 w-56 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-lg md:hidden overflow-hidden">
          <nav className="flex flex-col p-2">
            {navConfig.mainNav.map((item) => {
              const isQuote = item.href === "/quote";
              return isQuote ? (
                <Button
                  key={item.href}
                  asChild
                  variant="digital"
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href={item.href} className="w-full">
                    {item.title}
                  </Link>
                </Button>
              ) : (
                <Button
                  key={item.href}
                  asChild
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href={item.href} className="w-full">
                    {item.title}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
