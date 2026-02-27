"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { Button } from "@/components/Button";

// MDEditor uses window, so dynamic import without SSR
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export function MarkdownEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setMsg(null);

    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/admin/uploads/blog", {
      method: "POST",
      body: fd,
    });

    const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;

    setUploading(false);

    if (!res.ok || !data?.url) {
      setMsg(data?.error || "Upload failed");
      return;
    }

    const alt = file.name.replace(/\.[^/.]+$/, "");
    const snippet = `\n\n![${alt}](${data.url})\n\n`;
    onChange((value || "") + snippet);
  };

  return (
    <div className="space-y-3" data-color-mode="dark">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-fg)]/60">
          CONTENT (MARKDOWN)
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              // reset so selecting same file again works
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
            {uploading ? "Uploading..." : "Upload image"}
          </Button>
        </div>
      </div>

      {msg && (
        <div className="rounded-lg border border-[var(--color-destructive)] bg-[var(--color-destructive)]/10 p-3 text-sm text-[var(--color-fg)]">
          {msg}
        </div>
      )}

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 overflow-hidden">
        {/* @uiw/react-md-editor uses its own styles; data-color-mode=dark helps */}
        <MDEditor value={value} onChange={(v) => onChange(v ?? "")} height={420} />
      </div>

      <div className="text-xs text-[var(--color-fg)]/50">
        Tip: uploaded images are stored in <span className="text-[var(--digital-cyan)]">/public/uploads/blog</span>
        .
      </div>
    </div>
  );
}