import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/Button";
import { QuoteEditor } from "./quote-editor";

type QuoteFile = { name: string; url: string; size: number };

export default async function AdminQuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const quote = await prisma.quote.findUnique({ where: { id } });
  if (!quote) {
    return (
      <div className="space-y-4">
        <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
          [ ADMIN / QUOTES ]
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-fg)]">Not found</h1>
        <Button asChild variant="outline">
          <Link href="/admin/quotes">Back to quotes</Link>
        </Button>
      </div>
    );
  }

  const files = quote.files as unknown as QuoteFile[];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-[var(--color-fg)]/60">
            <Link href="/admin/quotes" className="hover:text-[var(--digital-cyan)] transition-colors">
              Quotes
            </Link>{" "}
            <span className="text-[var(--color-fg)]/40">/</span>{" "}
            {quote.customerName}
          </div>

          <h1 className="text-3xl font-bold text-[var(--color-fg)] mt-2">
            {quote.customerName}
          </h1>

          <div className="text-sm text-[var(--color-fg)]/70 mt-1">
            {quote.customerEmail}
            {quote.customerPhone ? (
              <span className="text-[var(--color-fg)]/40"> • {quote.customerPhone}</span>
            ) : null}
          </div>
        </div>

        <Button asChild variant="outline">
          <Link href="/admin/quotes">Back</Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
            <h2 className="font-bold text-[var(--color-fg)] mb-3">Message</h2>
            <p className="text-sm text-[var(--color-fg)]/75 whitespace-pre-wrap">
              {quote.message ?? "No message provided."}
            </p>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
            <h2 className="font-bold text-[var(--color-fg)] mb-3">Files</h2>

            {files.length === 0 ? (
              <p className="text-sm text-[var(--color-fg)]/70">No files uploaded.</p>
            ) : (
              <ul className="space-y-2">
                {files.map((f, idx) => (
                  <li
                    key={`${f.url}-${idx}`}
                    className="flex items-center justify-between gap-3 border border-[var(--color-border)] bg-[var(--color-surface-2)]/40 rounded-lg px-3 py-2"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-[var(--color-fg)] truncate">
                        {f.name}
                      </div>
                      <div className="text-xs text-[var(--color-fg)]/60">
                        {(f.size / 1024).toFixed(2)} KB
                      </div>
                    </div>

                    <Button asChild variant="outline" size="sm">
                      <a href={f.url} target="_blank" rel="noreferrer">
                        Download
                      </a>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
            <h2 className="font-bold text-[var(--color-fg)] mb-4">Update</h2>
            <QuoteEditor
              quote={{
                id: quote.id,
                status: quote.status,
                notes: quote.notes,
                quotedPrice: quote.quotedPrice,
              }}
            />
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 text-sm text-[var(--color-fg)]/70 space-y-2">
            <div>
              <span className="font-bold text-[var(--color-fg)]">Created:</span>{" "}
              {new Date(quote.createdAt).toLocaleString("en-GB")}
            </div>
            <div>
              <span className="font-bold text-[var(--color-fg)]">Updated:</span>{" "}
              {new Date(quote.updatedAt).toLocaleString("en-GB")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}