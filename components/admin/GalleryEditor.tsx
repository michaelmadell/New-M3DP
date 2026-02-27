"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/Button";

type Input = {
  title: string;
  description: string;
  imageUrl: string;
  category: "digital" | "film";
  tagsCsv: string;
  orderIndex: string;
  isVisible: boolean;
};

export function GalleryEditor({
  mode,
  imageId,
  initial,
}: {
  mode: "create" | "edit";
  imageId?: string;
  initial?: Partial<{
    title: string | null;
    description: string | null;
    imageUrl: string;
    category: string;
    tags: string[];
    orderIndex: number;
    isVisible: boolean;
  }>;
}) {
  const [form, setForm] = useState<Input>({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    imageUrl: initial?.imageUrl ?? "",
    category: (initial?.category === "film" ? "film" : "digital") as "digital" | "film",
    tagsCsv: initial?.tags?.join(", ") ?? "",
    orderIndex: initial?.orderIndex != null ? String(initial.orderIndex) : "0",
    isVisible: initial?.isVisible ?? true,
  });

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const set = <K extends keyof Input>(key: K, value: Input[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const upload = async (file: File) => {
    setUploading(true);
    setMsg(null);

    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/admin/uploads/gallery", {
      method: "POST",
      body: fd,
    });

    const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;

    setUploading(false);

    if (!res.ok || !data?.url) {
      setMsg(data?.error || "Upload failed");
      return;
    }

    set("imageUrl", data.url);
  };

  const save = async () => {
    setMsg(null);

    if (!form.imageUrl.trim()) return setMsg("Image URL is required.");
    if (!form.category) return setMsg("Category is required.");

    const orderIndex = Number(form.orderIndex);
    if (!Number.isFinite(orderIndex)) return setMsg("Order index must be a number.");

    const tags = form.tagsCsv
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: form.title.trim() || null,
      description: form.description.trim() || null,
      imageUrl: form.imageUrl.trim(),
      category: form.category,
      tags,
      orderIndex,
      isVisible: form.isVisible,
    };

    setSaving(true);
    try {
      const url = mode === "create" ? "/api/admin/gallery" : `/api/admin/gallery/${imageId}`;
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
          window.location.href = `/admin/gallery/${id}`;
          return;
        }
      }

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
            Title (optional)
          </label>
          <input
            className="mt-2 w-full border border-[var(--color-border)] bg-[var(--color-surface-2)]/30 rounded-md px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--digital-cyan)]"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-fg)]/60">
            Category
          </label>
          <select
            className="mt-2 w-full border border-[var(--color-border)] bg-[var(--color-surface-2)]/30 rounded-md px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--digital-cyan)]"
            value={form.category}
            onChange={(e) => set("category", e.target.value as "digital" | "film")}
          >
            <option value="digital">digital</option>
            <option value="film">film</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-fg)]/60">
            Description (optional)
          </label>
          <textarea
            className="mt-2 w-full border border-[var(--color-border)] bg-[var(--color-surface-2)]/30 rounded-md px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--digital-cyan)]"
            rows={4}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-fg)]/60">
              Image URL
            </label>

            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) upload(f);
                e.currentTarget.value = "";
              }}
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>

          <input
            className="mt-2 w-full border border-[var(--color-border)] bg-[var(--color-surface-2)]/30 rounded-md px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--digital-cyan)]"
            value={form.imageUrl}
            onChange={(e) => set("imageUrl", e.target.value)}
            placeholder="/uploads/gallery/..."
          />

          {form.imageUrl ? (
            <div className="mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-3">
              <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-fg)]/60">
                PREVIEW
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.imageUrl}
                alt={form.title || "Gallery preview"}
                className="mt-3 w-full max-h-[320px] object-contain rounded-md border border-[var(--color-border)] bg-black/20"
              />
            </div>
          ) : null}
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-fg)]/60">
            Tags (comma-separated)
          </label>
          <input
            className="mt-2 w-full border border-[var(--color-border)] bg-[var(--color-surface-2)]/30 rounded-md px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--digital-cyan)]"
            value={form.tagsCsv}
            onChange={(e) => set("tagsCsv", e.target.value)}
            placeholder="e.g. portrait, 35mm, neon"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-fg)]/60">
            Order index
          </label>
          <input
            inputMode="numeric"
            className="mt-2 w-full border border-[var(--color-border)] bg-[var(--color-surface-2)]/30 rounded-md px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--digital-cyan)]"
            value={form.orderIndex}
            onChange={(e) => set("orderIndex", e.target.value)}
          />
        </div>

        <div className="md:col-span-2 flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)]/20 p-4">
          <div>
            <div className="font-bold text-[var(--color-fg)]">Visible</div>
            <div className="text-sm text-[var(--color-fg)]/60">
              Controls whether the image shows in the public gallery.
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isVisible}
              onChange={(e) => set("isVisible", e.target.checked)}
            />
            <span className="font-bold tracking-widest uppercase">
              {form.isVisible ? "ON" : "OFF"}
            </span>
          </label>
        </div>
      </div>

      <Button variant="digital" onClick={save} disabled={saving}>
        {saving ? "Saving..." : mode === "create" ? "Create image" : "Save changes"}
      </Button>
    </div>
  );
}