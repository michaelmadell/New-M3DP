"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function PostEditor({
  mode,
  postId,
  initial,
}: {
  mode: "create" | "edit";
  postId?: string;
  initial?: Partial<{
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    coverImage: string | null;
    category: string | null;
    isPublished: boolean;
  }>;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? false);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const canAutoSlug = useMemo(() => slug.trim() === "", [slug]);

  const save = async () => {
    setMsg(null);
    if (!title.trim()) return setMsg("Title is required.");
    const finalSlug = slug.trim() || slugify(title);
    if (!finalSlug) return setMsg("Slug is required.");
    if (!content.trim()) return setMsg("Content is required.");

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        slug: finalSlug,
        category: category.trim() || null,
        coverImage: coverImage.trim() || null,
        excerpt: excerpt.trim() || null,
        content,
        isPublished,
      };

      const url = mode === "create" ? "/api/admin/posts" : `/api/admin/posts/${postId}`;
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
          window.location.href = `/admin/blog/${id}`;
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
            Title
          </label>
          <input
            className="mt-2 w-full border border-[var(--color-border)] bg-[var(--color-surface-2)]/30 rounded-md px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--digital-cyan)]"
            value={title}
            onChange={(e) => {
              const v = e.target.value;
              setTitle(v);
              if (canAutoSlug) setSlug(slugify(v));
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
            URL: <span className="text-[var(--digital-cyan)]">/blog/{slug || "your-slug"}</span>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-fg)]/60">
            Category (optional)
          </label>
          <input
            className="mt-2 w-full border border-[var(--color-border)] bg-[var(--color-surface-2)]/30 rounded-md px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--digital-cyan)]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder='e.g. "review" or "tutorial"'
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-fg)]/60">
            Cover image URL (optional)
          </label>
          <input
            className="mt-2 w-full border border-[var(--color-border)] bg-[var(--color-surface-2)]/30 rounded-md px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--digital-cyan)]"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="/uploads/blog/..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-fg)]/60">
            Excerpt (optional)
          </label>
          <textarea
            className="mt-2 w-full border border-[var(--color-border)] bg-[var(--color-surface-2)]/30 rounded-md px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--digital-cyan)]"
            rows={3}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/70 backdrop-blur tech-grid p-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
          <span className="font-bold tracking-widest uppercase">
            {isPublished ? "PUBLISHED" : "DRAFT"}
          </span>
        </label>
        <div className="text-xs text-[var(--color-fg)]/50 mt-2">
          Publishing sets <code>publishedAt</code> automatically.
        </div>
      </div>

      <MarkdownEditor value={content} onChange={setContent} />

      <Button variant="digital" onClick={save} disabled={saving}>
        {saving ? "Saving..." : mode === "create" ? "Create post" : "Save changes"}
      </Button>
    </div>
  );
}