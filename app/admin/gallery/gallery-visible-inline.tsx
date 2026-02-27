"use client";

import { useState } from "react";

export function GalleryVisibleInline({
  imageId,
  initialVisible,
}: {
  imageId: string;
  initialVisible: boolean;
}) {
  const [visible, setVisible] = useState(initialVisible);
  const [saving, setSaving] = useState(false);

  const toggle = async () => {
    const next = !visible;
    setVisible(next);
    setSaving(true);

    const res = await fetch(`/api/admin/gallery/${imageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVisible: next }),
    });

    setSaving(false);

    if (!res.ok) {
      setVisible(!next);
      return;
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={saving}
      className={[
        "inline-flex items-center justify-center w-[60px] px-2 py-1 rounded-md border",
        "text-[10px] font-bold tracking-widest uppercase transition-colors",
        saving ? "opacity-60" : "",
        visible
          ? "border-[var(--digital-cyan)] text-[var(--digital-cyan)] bg-[var(--digital-cyan)]/10"
          : "border-[var(--color-border)] text-[var(--color-fg)]/60 bg-[var(--color-surface-2)]/40",
      ].join(" ")}
      aria-pressed={visible}
      aria-label={visible ? "Hide image" : "Show image"}
    >
      {visible ? "ON" : "OFF"}
    </button>
  );
}