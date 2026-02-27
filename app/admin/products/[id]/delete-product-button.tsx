"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button";

export function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const del = async () => {
    const ok = window.confirm("Delete this product? This cannot be undone.");
    if (!ok) return;

    setDeleting(true);
    const res = await fetch(`/api/admin/products/${productId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      setDeleting(false);
      alert("Delete failed. This product may be referenced by order items.");
      return;
    }

    router.push("/admin/products");
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