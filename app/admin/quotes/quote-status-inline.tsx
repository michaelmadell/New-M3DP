"use client";

import { useState } from "react";

const OPTIONS = [
  "pending",
  "reviewed",
  "quoted",
  "accepted",
  "completed",
  "declined",
] as const;

export function QuoteStatusInline({
  quoteId,
  initialStatus,
}: {
  quoteId: string;
  initialStatus: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<"ok" | "err" | null>(null);

  const update = async (next: string) => {
    const prev = status;
    setStatus(next);
    setSaving(true);
    setFlash(null);

    const res = await fetch(`/api/admin/quotes/${quoteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });

    setSaving(false);

    if (!res.ok) {
      setStatus(prev);
      setFlash("err");
      window.setTimeout(() => setFlash(null), 800);
      return;
    }

    setFlash("ok");
    window.setTimeout(() => setFlash(null), 500);
  };

  return (
    <select
      value={status}
      disabled={saving}
      onChange={(e) => update(e.target.value)}
      className={[
        "w-[140px] border rounded-md px-2 py-1 text-xs font-bold uppercase tracking-widest outline-none",
        "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-fg)]",
        "focus:border-[var(--digital-cyan)]",
        saving ? "opacity-60" : "",
        flash === "ok" ? "ring-1 ring-[var(--digital-cyan)]" : "",
        flash === "err" ? "ring-1 ring-[var(--color-destructive)]" : "",
      ].join(" ")}
      aria-label="Update quote status"
    >
      {OPTIONS.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}