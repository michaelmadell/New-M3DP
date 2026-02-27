"use client";

import { useState } from "react";
import { Button } from "@/components/Button";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function CategoryEditor({
  mode,
  categoryId,
  initial,
}: {
  mode: "create" | "edit";
  categoryId?: string;
  initial?: Partial<{ name: string; slug: string; description: string | null }>;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const save = async () => {
    setMsg(null);

    if (!name.trim()) return setMsg("Name is required.");
    const finalSlug = slug.trim() || slugify(name);
    if (!finalSlug) return setMsg("Slug is required.");

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        slug: finalSlug,
        description: description.trim() || null,
      };

      const url =
        mode === "create" ? "/api/admin/categories" : `/api/admin/categories/${categoryId}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setMsg((data && data.error) || "Failed to save.");
        return;
      }

      if (mode === "create") {
        const id = data?.data?.id as string | undefined;
        if (id) {
          window.location.href = `/admin/categories/${id}`;
          return;
        }
      }

      setSlug(finalSlug);
      setMsg("Saved.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {msg && (
        <div className="rounded-lg border border-[var(--digital-cyan)] bg-[var(--digital-cyan)]/10 p-3 text-sm text-[var(--color-fg)]">
          {msg}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-fg)]/60">
            Name
          </label>
          <input
            className="mt-2 w-full border border-[var(--color-border)] bg-[var(--color-surface-2)]/30 rounded-md px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--digital-cyan)]"
            value={name}
            onChange={(e) => {
              const v = e.target.value;
              setName(v);
              if (!slug.trim()) setSlug(slugify(v));
            }}
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-fg)]/60">
            Slug
          </label>
          <input
            className="mt-2 w-full border border-[var(--color-border)] bg-[var(--color-surface-2)]/30 rounded-md px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--digital-cyan)]"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <div className="text-[11px] text-[var(--color-fg)]/50 mt-2">
            Used in URLs and internal filtering.
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-fg)]/60">
            Description (optional)
          </label>
          <textarea
            className="mt-2 w-full border border-[var(--color-border)] bg-[var(--color-surface-2)]/30 rounded-md px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--digital-cyan)]"
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <Button variant="digital" onClick={save} disabled={saving}>
        {saving ? "Saving..." : mode === "create" ? "Create category" : "Save changes"}
      </Button>
    </div>
  );
}