import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/Button";

export default async function ShopProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: { category: true },
  });

  if (!product) return notFound();

  return (
    <div className="max-w-5xl px-4 py-16 mx-auto">
      <div className="mb-8">
        <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
          [ SHOP ]
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[var(--color-fg)]/60">
          <Link href="/shop" className="hover:text-[var(--digital-cyan)]">
            Products
          </Link>
          <span>/</span>
          {product.category ? (
            <>
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="hover:text-[var(--digital-cyan)]"
              >
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          ) : null}
          <span className="text-[var(--color-fg)]/80">{product.name}</span>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
          <div className="relative aspect-square bg-[var(--color-surface-2)]">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[var(--color-fg)]/40">
                No image
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <h1 className="text-4xl font-bold text-[var(--color-fg)]">
            {product.name}
          </h1>

          <div className="text-xl font-bold text-[var(--digital-cyan)]">
            £{product.price.toFixed(2)}
          </div>

          {product.description ? (
            <p className="text-[var(--color-fg)]/75 leading-relaxed">
              {product.description}
            </p>
          ) : null}

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/70 p-4">
            <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-fg)]/60">
              AVAILABILITY
            </div>
            <div className="mt-2 text-sm text-[var(--color-fg)]/80">
              {product.stock > 0 ? (
                <span className="font-bold text-[var(--digital-cyan)]">
                  In stock ({product.stock})
                </span>
              ) : (
                <span className="font-bold text-[var(--analog-amber)]">
                  Out of stock
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild variant="digital">
              <Link href="/quote">Request a custom quote</Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="/shop">Back to shop</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";