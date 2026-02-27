"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";

export function AdminLogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full justify-start border-white/20 text-white hover:bg-white/10"
      onClick={logout}
    >
      ↩ Logout
    </Button>
  );
}