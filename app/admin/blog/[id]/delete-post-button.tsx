"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button";

export function DeletePostButton({ postId }: { postId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const del = async () => {
    const ok = window.confirm("Delete this post? This cannot be undone.");
    if (!ok) return;

    setDeleting(true);
    const res = await fetch(`/api/admin/posts/${postId}`, { method: "DELETE" });

    if (!res.ok) {
      setDeleting(false);
      alert("Delete failed.");
      return;
    }

    router.push("/admin/blog");
    router.refresh();
  };

  return (
    <Button
      variant="outline"
      className="border-[var(--color-destructive)] text-[var(--color-destructive)] hover:bg-[var(--color-destructive)] hover:text-white"
      onClick={del}
      disabled={deleting}
    >
      {deleting ? "Deleting..." : "Delete"}
    </Button>
  );
}