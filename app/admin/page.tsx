import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/Button";

function statCardClass(accent: "cyan" | "amber" | "purple" | "green") {
  const base =
    "rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur tech-grid p-6";
  const ring =
    accent === "cyan"
      ? "hover:border-[var(--digital-cyan)]"
      : accent === "amber"
      ? "hover:border-[var(--analog-amber)]"
      : accent === "purple"
      ? "hover:border-[var(--color-accent)]"
      : "hover:border-[var(--color-primary)]";

  return `${base} transition-colors ${ring}`;
}

function statusBadge(status: string) {
  const base =
    "inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase border";
  switch (status) {
    case "pending":
      return `${base} border-[var(--analog-amber)] text-[var(--analog-amber)] bg-[var(--analog-amber)]/10`;
    case "paid":
      return `${base} border-[var(--digital-cyan)] text-[var(--digital-cyan)] bg-[var(--digital-cyan)]/10`;
    case "processing":
      return `${base} border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/10`;
    case "shipped":
      return `${base} border-[var(--digital-cyan)] text-[var(--digital-cyan)] bg-[var(--digital-cyan)]/10`;
    case "completed":
      return `${base} border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/10`;
    case "cancelled":
      return `${base} border-[var(--color-destructive)] text-[var(--color-destructive)] bg-[var(--color-destructive)]/10`;
    case "quoted":
      return `${base} border-[var(--digital-cyan)] text-[var(--digital-cyan)] bg-[var(--digital-cyan)]/10`;
    case "reviewed":
      return `${base} border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/10`;
    case "accepted":
      return `${base} border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/10`;
    case "declined":
      return `${base} border-[var(--color-destructive)] text-[var(--color-destructive)] bg-[var(--color-destructive)]/10`;
    default:
      return `${base} border-[var(--color-border)] text-[var(--color-fg)]/70 bg-[var(--color-surface-2)]`;
  }
}

export default async function AdminDashboard() {
  const [productCount, pendingOrders, pendingQuotes, postCount] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count({ where: { status: "pending" } }),
      prisma.quote.count({ where: { status: "pending" } }),
      prisma.post.count(),
    ]);

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { product: true } },
    },
  });

  const recentQuotes = await prisma.quote.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
          [ ADMIN / DASHBOARD ]
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mt-2 text-[var(--color-fg)]">
          Dashboard
        </h1>
        <p className="text-sm text-[var(--color-fg)]/70 mt-2">
          Quick snapshot of your shop activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={statCardClass("cyan")}>
          <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-fg)]/60">
            PRODUCTS
          </div>
          <div className="mt-3 text-4xl font-bold text-[var(--digital-cyan)]">
            {productCount}
          </div>
          <div className="mt-3">
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/products">Manage →</Link>
            </Button>
          </div>
        </div>

        <div className={statCardClass("amber")}>
          <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-fg)]/60">
            PENDING ORDERS
          </div>
          <div className="mt-3 text-4xl font-bold text-[var(--analog-amber)]">
            {pendingOrders}
          </div>
          <div className="mt-3">
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/orders?status=pending">View →</Link>
            </Button>
          </div>
        </div>

        <div className={statCardClass("purple")}>
          <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-fg)]/60">
            PENDING QUOTES
          </div>
          <div className="mt-3 text-4xl font-bold text-[var(--color-accent)]">
            {pendingQuotes}
          </div>
          <div className="mt-3">
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/quotes?status=pending">Review →</Link>
            </Button>
          </div>
        </div>

        <div className={statCardClass("green")}>
          <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-fg)]/60">
            BLOG POSTS
          </div>
          <div className="mt-3 text-4xl font-bold text-[var(--color-primary)]">
            {postCount}
          </div>
          <div className="mt-3">
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/blog">Edit →</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur tech-grid p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-xl font-bold text-[var(--color-fg)]">
              Recent Orders
            </h2>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/orders">View All →</Link>
            </Button>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-sm text-[var(--color-fg)]/70">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="block rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)]/30 hover:bg-[var(--color-surface-2)]/60 transition-colors p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-bold text-[var(--color-fg)] truncate">
                        #{order.orderNumber} • £{order.total.toFixed(2)}
                      </div>
                      <div className="text-sm text-[var(--color-fg)]/70 truncate">
                        {order.customerName} • {order.items.length} item(s)
                      </div>
                      <div className="text-xs text-[var(--color-fg)]/50 mt-1">
                        {new Date(order.createdAt).toLocaleString("en-GB")}
                      </div>
                    </div>
                    <span className={statusBadge(order.status)}>{order.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur tech-grid p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-xl font-bold text-[var(--color-fg)]">
              Recent Quotes
            </h2>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/quotes">View All →</Link>
            </Button>
          </div>

          {recentQuotes.length === 0 ? (
            <p className="text-sm text-[var(--color-fg)]/70">
              No quote requests yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recentQuotes.map((quote) => (
                <Link
                  key={quote.id}
                  href={`/admin/quotes/${quote.id}`}
                  className="block rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)]/30 hover:bg-[var(--color-surface-2)]/60 transition-colors p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-bold text-[var(--color-fg)] truncate">
                        {quote.customerName}
                      </div>
                      <div className="text-sm text-[var(--color-fg)]/70 truncate">
                        {quote.customerEmail} • {(quote.files as any[]).length} file(s)
                      </div>
                      <div className="text-xs text-[var(--color-fg)]/50 mt-1">
                        {new Date(quote.createdAt).toLocaleString("en-GB")}
                      </div>
                    </div>
                    <span className={statusBadge(quote.status)}>{quote.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";