"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const activeItem = useMemo(
    () => NAV.find((n) => isActive(pathname, n.href)) ?? NAV[0],
    [pathname]
  );

  useEffect(() => setOpen(false), [pathname]);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      {/* Top bar (always visible) */}
      <div className="fixed top-0 left-0 right-0 z-[200] border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="admin-drawer"
          >
            {open ? "Close" : "Menu"}
          </Button>

          <div className="min-w-0 flex-1">
            <div className="text-[10px] tracking-[0.35em] font-bold text-[var(--color-muted)]">
              [ ADMIN ]
            </div>
            <div className="text-sm font-bold text-[var(--color-fg)] truncate">
              {activeItem.label}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="border-[var(--analog-amber)] text-[var(--analog-amber)] hover:bg-[var(--analog-amber)] hover:text-[var(--tech-slate)]"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Spacer under top bar */}
      <div className="h-[64px]" />

      {/* Overlay */}
      {open && (
        <button
          aria-label="Close admin menu"
          className="fixed inset-0 z-[190] bg-black/55"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer sidebar */}
      <aside
        id="admin-drawer"
        className={[
          "fixed top-0 left-0 z-[210] h-screen w-[280px]",
          "border-r border-[var(--color-border)]",
          "bg-[var(--color-surface)]/92 backdrop-blur-xl",
          "tech-grid",
          "transition-transform duration-200",
          "pt-[72px]",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="px-5 pb-4">
          <Link href="/admin" className="block">
            <div className="text-xs tracking-[0.35em] font-bold text-[var(--color-muted)]">
              [ MONKEYS3DPRINTS ]
            </div>
            <div className="mt-2 text-lg font-bold text-[var(--color-fg)]">
              Admin Panel
            </div>
          </Link>
        </div>

        <nav className="px-3 space-y-1">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Button
                key={item.href}
                asChild
                variant={active ? "digital" : "ghost"}
                className={[
                  "w-full justify-start gap-3",
                  active ? "" : "text-[var(--color-fg)]/80",
                ].join(" ")}
              >
                <Link href={item.href}>
                  <span className="w-6 text-center">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </Link>
              </Button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}