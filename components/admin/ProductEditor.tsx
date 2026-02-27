"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/Button";

type Category = { id: string; name: string };

type ProductInput = {
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: string;
  images: string[];
  categoryId: string;
  isActive: boolean;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function ProductEditor({
  mode,
  productId,
  initial,
}: {
  mode: "create" | "edit";
  productId?: string;
  initial?: Partial<{
    name: string;
    slug: string;
    description: string | null;
    price: number;
    stock: number;
    images: string[];
    categoryId: string;
    isActive: boolean;
  }>;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  const [form, setForm] = useState<ProductInput>({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    price: initial?.price != null ? String(initial.price) : "0",
    stock: initial?.stock != null ? String(initial.stock) : "0",
    images: initial?.images ?? [""],
    categoryId: initial?.categoryId ?? "",
    isActive: initial?.isActive ?? true,
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const canAutoSlug = useMemo(() => form.slug.trim() === "", [form.slug]);

  useEffect(() => {
    (async () => {
      setLoadingCats(true);
      const res = await fetch("/api/admin/categories");
      if (!res.ok) {
        setCategories([]);
        setLoadingCats(false);
        return;
      }
      const data = (await res.json()) as { data: Category[] };
      setCategories(data.data ?? []);
      setLoadingCats(false);
    })();
  }, []);

  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const addImage = () => set("images", [...form.images, ""]);
  const removeImage = (idx: number) =>
    set("images", form.images.filter((_, i) => i !== idx));
  const setImage = (idx: number, value: string) =>
    set("images", form.images.map((v, i) => (i === idx ? value : v)));

  const save = async () => {
    setMsg(null);

    const priceNum = Number(form.price);
    const stockNum = Number(form.stock);

    if (!form.name.trim()) return setMsg("Name is required.");
    const slug = form.slug.trim() || slugify(form.name);
    if (!slug) return setMsg("Slug is required.");
    if (!Number.isFinite(priceNum) || priceNum < 0) return setMsg("Price must be >= 0");
    if (!Number.isFinite(stockNum) || stockNum < 0) return setMsg("Stock must be >= 0");
    if (!form.categoryId) return setMsg("Category is required.");

    const payload = {
      name: form.name.trim(),
      slug,
      description: form.description.trim() || null,
      price: priceNum,
      stock: stockNum,
      images: form.images.map((s) => s.trim()).filter(Boolean),
      categoryId: form.categoryId,
      isActive: form.isActive,
    };

    setSaving(true);
    try {
      const url =
        mode === "create" ? "/api/admin/products" : `/api/admin/products/${productId}`;
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
        // redirect to edit page for convenience
        const id = data?.data?.id as string | undefined;
        if (id) {
          window.location.href = `/admin/products/${id}`;
          return;
        }
      }

      setMsg("Saved.");
      setForm((f) => ({ ...f, slug })); // ensure slug field is populated if auto-generated
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
            value={form.name}
            onChange={(e) => {
              const name = e.target.value;
              set("name", name);
              if (canAutoSlug) set("slug", slugify(name));
            }}
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-fg)]/60">
            Slug
          </label>
          <input
            className="mt-2 w-full border border-[var(--color-border)] bg-[var(--color-surface-2)]/30 rounded-md px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--digital-cyan)]"
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
          />
          <div className="text-[11px] text-[var(--color-fg)]/50 mt-2">
            URL: <span className="text-[var(--digital-cyan)]">/products/{form.slug || "your-slug"}</span>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-fg)]/60">
            Description
          </label>
          <textarea
            className="mt-2 w-full border border-[var(--color-border)] bg-[var(--color-surface-2)]/30 rounded-md px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--digital-cyan)]"
            rows={6}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-fg)]/60">
            Category
          </label>
          <select
            className="mt-2 w-full border border-[var(--color-border)] bg-[var(--color-surface-2)]/30 rounded-md px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--digital-cyan)]"
            value={form.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
            disabled={loadingCats}
          >
            <option value="">{loadingCats ? "Loading..." : "Select category"}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="text-[11px] text-[var(--color-fg)]/50 mt-2">
            Need categories? Build `/admin/categories` next.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-fg)]/60">
              Price (£)
            </label>
            <input
              inputMode="decimal"
              className="mt-2 w-full border border-[var(--color-border)] bg-[var(--color-surface-2)]/30 rounded-md px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--digital-cyan)]"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-fg)]/60">
              Stock
            </label>
            <input
              inputMode="numeric"
              className="mt-2 w-full border border-[var(--color-border)] bg-[var(--color-surface-2)]/30 rounded-md px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--digital-cyan)]"
              value={form.stock}
              onChange={(e) => set("stock", e.target.value)}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-fg)]/60">
            Images (URLs)
          </label>

          <div className="mt-2 space-y-2">
            {form.images.map((img, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  className="flex-1 border border-[var(--color-border)] bg-[var(--color-surface-2)]/30 rounded-md px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--digital-cyan)]"
                  value={img}
                  placeholder="https://... or /uploads/..."
                  onChange={(e) => setImage(idx, e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeImage(idx)}
                  disabled={form.images.length === 1}
                >
                  Remove
                </Button>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addImage}>
              + Add image
            </Button>
          </div>
        </div>

        <div className="md:col-span-2 flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)]/20 p-4">
          <div>
            <div className="font-bold text-[var(--color-fg)]">Active</div>
            <div className="text-sm text-[var(--color-fg)]/60">
              Controls whether this product is visible on the site.
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => set("isActive", e.target.checked)}
            />
            <span className="font-bold tracking-widest uppercase">
              {form.isActive ? "ON" : "OFF"}
            </span>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="digital" onClick={save} disabled={saving}>
          {saving ? "Saving..." : mode === "create" ? "Create product" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}