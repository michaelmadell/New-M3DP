"use client";

import { useState } from "react";

const STATUSES = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "completed",
  "cancelled",
] as const;

export function OrderStatusInline({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const [okFlash, setOkFlash] = useState(false);

  const update = async (nextStatus: string) => {
    setStatus(nextStatus);
    setSaving(true);

    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });

    setSaving(false);

    if (!res.ok) {
      // revert on failure
      setStatus(currentStatus);
      return;
    }

    setOkFlash(true);
    window.setTimeout(() => setOkFlash(false), 500);
  };

  return (
    <div
      className={[
        "rounded-md border px-2 py-1",
        "border-[var(--color-border)] bg-[var(--color-surface-2)]/30",
        okFlash ? "border-[var(--digital-cyan)]" : "",
        saving ? "opacity-60" : "",
      ].join(" ")}
    >
      <select
        className="w-full bg-transparent text-xs font-bold tracking-widest uppercase text-[var(--color-fg)] outline-none"
        value={status}
        onChange={(e) => update(e.target.value)}
        disabled={saving}
        aria-label="Quick update order status"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}