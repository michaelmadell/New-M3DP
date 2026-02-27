"use client";

import { useState } from "react";

export function ProductActiveInline({
  productId,
  initialActive,
}: {
  productId: string;
  initialActive: boolean;
}) {
  const [active, setActive] = useState(initialActive);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<"ok" | "err" | null>(null);

  const toggle = async () => {
    const next = !active;
    setActive(next);
    setSaving(true);
    setFlash(null);

    const res = await fetch(`/api/admin/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: next }),
    });

    setSaving(false);

    if (!res.ok) {
      setActive(!next); // revert
      setFlash("err");
      window.setTimeout(() => setFlash(null), 800);
      return;
    }

    setFlash("ok");
    window.setTimeout(() => setFlash(null), 500);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={saving}
      className={[
        "inline-flex items-center justify-center",
        "w-[52px] px-2 py-1 rounded-md border",
        "text-[10px] font-bold tracking-widest uppercase",
        "transition-colors",
        saving ? "opacity-60" : "",
        active
          ? "border-[var(--digital-cyan)] text-[var(--digital-cyan)] bg-[var(--digital-cyan)]/10"
          : "border-[var(--color-border)] text-[var(--color-fg)]/60 bg-[var(--color-surface-2)]/40",
        flash === "ok" ? "ring-1 ring-[var(--digital-cyan)]" : "",
        flash === "err" ? "ring-1 ring-[var(--color-destructive)]" : "",
      ].join(" ")}
      aria-pressed={active}
      aria-label={active ? "Deactivate product" : "Activate product"}
      title={active ? "Click to deactivate" : "Click to activate"}
    >
      {active ? "ON" : "OFF"}
    </button>
  );
}