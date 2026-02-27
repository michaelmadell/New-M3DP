import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/Button";

const STATUSES = [
  "all",
  "pending",
  "reviewed",
  "quoted",
  "accepted",
  "completed",
  "declined",
] as const;

function statusBadge(status: string) {
  // simple cyber palette mapping
  const base =
    "inline-flex items-center px-2 py-1 rounded-md text-xs font-bold tracking-widest uppercase border";
  switch (status) {
    case "pending":
      return `${base} border-[var(--analog-amber)] text-[var(--analog-amber)] bg-[var(--analog-amber)]/10`;
    case "reviewed":
      return `${base} border-[var(--digital-cyan)] text-[var(--digital-cyan)] bg-[var(--digital-cyan)]/10`;
    case "quoted":
      return `${base} border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/10`;
    case "accepted":
      return `${base} border-[var(--digital-cyan)] text-[var(--digital-cyan)] bg-[var(--digital-cyan)]/10`;
    case "completed":
      return `${base} border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/10`;
    case "declined":
      return `${base} border-[var(--color-destructive)] text-[var(--color-destructive)] bg-[var(--color-destructive)]/10`;
    default:
      return `${base} border-[var(--color-border)] text-[var(--color-fg)]/70 bg-[var(--color-surface-2)]`;
  }
}

export default async function AdminQuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const status = (params.status ?? "all") as (typeof STATUSES)[number];

  const quotes = await prisma.quote.findMany({
    where: status === "all" ? undefined : { status },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
            [ ADMIN / QUOTES ]
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-fg)] mt-2">
            Quote Requests
          </h1>
          <p className="text-sm text-[var(--color-fg)]/70 mt-2">
            View requests, download files, and update status.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <Button
              key={s}
              asChild
              variant={s === status ? "digital" : "outline"}
              size="sm"
            >
              <Link href={s === "all" ? "/admin/quotes" : `/admin/quotes?status=${s}`}>
                {s}
              </Link>
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-3 px-4 py-3 border-b border-[var(--color-border)] text-xs font-bold uppercase tracking-widest text-[var(--color-fg)]/60">
          <div className="col-span-3">Customer</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Files</div>
          <div className="col-span-2">Created</div>
        </div>

        {quotes.length === 0 ? (
          <div className="p-6 text-sm text-[var(--color-fg)]/70">
            No quotes found.
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {quotes.map((q) => (
              <Link
                key={q.id}
                href={`/admin/quotes/${q.id}`}
                className="grid grid-cols-12 gap-3 px-4 py-3 text-sm hover:bg-[var(--color-surface-2)]/60 transition-colors"
              >
                <div className="col-span-3 font-bold text-[var(--color-fg)] truncate">
                  {q.customerName}
                </div>
                <div className="col-span-3 text-[var(--color-fg)]/70 truncate">
                  {q.customerEmail}
                </div>
                <div className="col-span-2">
                  <span className={statusBadge(q.status)}>{q.status}</span>
                </div>
                <div className="col-span-2 text-[var(--color-fg)]/70">
                  {(q.files as any[]).length}
                </div>
                <div className="col-span-2 text-[var(--color-fg)]/70">
                  {new Date(q.createdAt).toLocaleString("en-GB", {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}