"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/Button";

type NavItem = { href: string; label: string; icon: string };

const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Products", icon: "📦" },
  { href: "/admin/categories", label: "Categories", icon: "🏷️" },
  { href: "/admin/orders", label: "Orders", icon: "🛒" },
  { href: "/admin/quotes", label: "Quotes", icon: "💬" },
  { href: "/admin/blog", label: "Blog / Reviews", icon: "✍️" },
  { href: "/admin/gallery", label: "Gallery", icon: "🖼️" },
  { href: "/admin/account", label: "Account", icon: "👤" },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

function NavLinks({
  collapsed,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {NAV.map((item) => {
        const active = isActive(pathname, item.href);

        return (
          <Button
            key={item.href}
            asChild
            variant={active ? "digital" : "ghost"}
            className={["w-full justify-start gap-3", collapsed ? "px-2" : ""].join(" ")}
          >
            <Link
              href={item.href}
              title={collapsed ? item.label : undefined}
              onClick={onNavigate}
            >
              <span className="w-6 text-center">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}

export function AdminSidebarShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeLabel = useMemo(() => {
    return NAV.find((n) => isActive(pathname, n.href))?.label ?? "Admin";
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Mobile controls (only) */}
      <div className="md:hidden mb-4 flex items-center justify-between gap-3 border border-[var(--color-border)] bg-[var(--color-surface)]/70 backdrop-blur rounded-xl px-4 py-3">
        <div className="min-w-0">
          <div className="text-[10px] tracking-[0.35em] font-bold text-[var(--color-muted)]">
            [ ADMIN ]
          </div>
          <div className="text-sm font-bold text-[var(--color-fg)] truncate">
            {activeLabel}
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={() => setMobileOpen(true)}>
          Menu
        </Button>
      </div>

      {/* Desktop layout */}
      <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-6">
        {/* Desktop sidebar only (md+) */}
        <aside
          className={[
            "hidden md:block sticky top-6 self-start",
            "border border-[var(--color-border)] rounded-xl",
            "bg-[var(--color-surface)]/80 backdrop-blur tech-grid",
            "p-2",
            collapsed ? "w-[72px]" : "w-[280px]",
            "transition-[width] duration-200",
          ].join(" ")}
        >
          <div className="flex items-center justify-between gap-2 px-3 pt-2 pb-3">
            <div className="min-w-0">
              <div className="text-[10px] tracking-[0.35em] font-bold text-[var(--color-muted)]">
                [ PANEL ]
              </div>
              {!collapsed && (
                <div className="mt-2 text-base font-bold text-[var(--color-fg)]">
                  Admin
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCollapsed((v) => !v)}
              className="shrink-0"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? "»" : "«"}
            </Button>
          </div>

          <NavLinks collapsed={collapsed} />

          <div className="mt-2 border-t border-[var(--color-border)] pt-2">
            <Button asChild variant="outline" className="w-full justify-start gap-3">
              <Link href="/">
                <span className="w-6 text-center">←</span>
                {!collapsed && <span>Back to Site</span>}
              </Link>
            </Button>
          </div>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>

      {/* Mobile drawer under the header (does NOT cover header) */}
      {mobileOpen && (
        <>
          <button
            aria-label="Close admin menu"
            className="fixed inset-0 z-[90] bg-black/55"
            style={{ top: "var(--site-header-height)" }}
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className={[
              "fixed left-0 z-[100]",
              "w-[280px] h-[calc(100vh-var(--site-header-height))]",
              "border-r border-[var(--color-border)]",
              "bg-[var(--color-surface)]/92 backdrop-blur tech-grid",
              "p-3",
            ].join(" ")}
            style={{ top: "var(--site-header-height)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs tracking-[0.35em] font-bold text-[var(--color-muted)]">
                [ ADMIN MENU ]
              </div>
              <Button variant="outline" size="sm" onClick={() => setMobileOpen(false)}>
                Close
              </Button>
            </div>

            <NavLinks onNavigate={() => setMobileOpen(false)} />

            <div className="mt-3 border-t border-[var(--color-border)] pt-3">
              <Button asChild variant="outline" className="w-full justify-start gap-3">
                <Link href="/" onClick={() => setMobileOpen(false)}>
                  <span className="w-6 text-center">←</span>
                  <span>Back to Site</span>
                </Link>
              </Button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}