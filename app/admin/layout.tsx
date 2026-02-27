import type { Metadata } from "next";
import { AdminSidebarShell } from "@/components/admin/AdminSidebarShell";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-fg)]">
      {/* This whole admin UI sits UNDER your site header, not fixed */}
      <AdminSidebarShell>{children}</AdminSidebarShell>
    </div>
  );
}