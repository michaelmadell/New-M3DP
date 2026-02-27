"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button";

export function DeleteCategoryButton({ categoryId }: { categoryId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const del = async () => {
    const ok = window.confirm(
      "Delete this category? This may fail if products still reference it."
    );
    if (!ok) return;

    setDeleting(true);
    const res = await fetch(`/api/admin/categories/${categoryId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      setDeleting(false);
      alert("Delete failed. Remove or reassign products in this category first.");
      return;
    }

    router.push("/admin/categories");
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