"use client";

import { useState } from "react";
import { Button } from "@/components/Button";

const STATUSES = ["pending", "reviewed", "quoted", "accepted", "completed", "declined"] as const;

export function QuoteEditor({
  quote,
}: {
  quote: {
    id: string;
    status: string;
    notes: string | null;
    quotedPrice: number | null;
  };
}) {
  const [status, setStatus] = useState(quote.status);
  const [notes, setNotes] = useState(quote.notes ?? "");
  const [quotedPrice, setQuotedPrice] = useState<string>(
    quote.quotedPrice != null ? String(quote.quotedPrice) : ""
  );
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setMsg(null);

    const parsedPrice =
      quotedPrice.trim() === "" ? null : Number(quotedPrice.trim());

    if (parsedPrice !== null && !Number.isFinite(parsedPrice)) {
      setMsg("Quoted price must be a number.");
      setSaving(false);
      return;
    }

    const res = await fetch(`/api/admin/quotes/${quote.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        notes: notes.trim() === "" ? null : notes,
        quotedPrice: parsedPrice,
      }),
    });

    if (!res.ok) {
      setMsg("Failed to save changes.");
      setSaving(false);
      return;
    }

    setMsg("Saved.");
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-fg)]/60">
          Status
        </label>
        <select
          className="mt-2 w-full border border-[var(--color-border)] bg-[var(--color-surface-2)]/30 rounded-md px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--digital-cyan)]"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-fg)]/60">
          Quoted price (£)
        </label>
        <input
          className="mt-2 w-full border border-[var(--color-border)] bg-[var(--color-surface-2)]/30 rounded-md px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--digital-cyan)]"
          value={quotedPrice}
          onChange={(e) => setQuotedPrice(e.target.value)}
          inputMode="decimal"
          placeholder="e.g. 24.99"
        />
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-fg)]/60">
          Notes
        </label>
        <textarea
          className="mt-2 w-full border border-[var(--color-border)] bg-[var(--color-surface-2)]/30 rounded-md px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--digital-cyan)]"
          rows={6}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Internal notes (not shown to customer)"
        />
      </div>

      {msg && <div className="text-xs text-[var(--color-fg)]/70">{msg}</div>}

      <Button variant="digital" className="w-full" onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save changes"}
      </Button>
    </div>
  );
}