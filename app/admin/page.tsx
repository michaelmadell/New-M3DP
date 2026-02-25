import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function AdminDashboard() {
  // Get overview stats
  const stats = await Promise.all([
    prisma.product.count(),
    prisma.order.count({ where: { status: 'pending' } }),
    prisma.quote.count({ where: { status: 'pending' } }),
    prisma.post.count(),
  ])

  const [productCount, pendingOrders, pendingQuotes, postCount] = stats

  // Get recent orders
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })

  // Get recent quotes
  const recentQuotes = await prisma.quote.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card bg-blue-50">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-blue-600">{productCount}</p>
        </div>
        <div className="card bg-yellow-50">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Pending Orders</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingOrders}</p>
        </div>
        <div className="card bg-purple-50">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Pending Quotes</h3>
          <p className="text-3xl font-bold text-purple-600">{pendingQuotes}</p>
        </div>
        <div className="card bg-green-50">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Blog Posts</h3>
          <p className="text-3xl font-bold text-green-600">{postCount}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-blue-600 hover:text-blue-800 text-sm">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-sm">No orders yet</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="border-b pb-3 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">#{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                      <p className="text-sm text-gray-500">
                        {order.items.length} item(s) - £{order.total.toFixed(2)}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Quotes */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Quote Requests</h2>
            <Link href="/admin/quotes" className="text-blue-600 hover:text-blue-800 text-sm">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentQuotes.length === 0 ? (
              <p className="text-gray-500 text-sm">No quote requests yet</p>
            ) : (
              recentQuotes.map((quote) => (
                <div key={quote.id} className="border-b pb-3 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{quote.customerName}</p>
                      <p className="text-sm text-gray-600">{quote.customerEmail}</p>
                      <p className="text-sm text-gray-500">
                        {(quote.files as any[]).length} file(s)
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        quote.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : quote.status === 'quoted'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {quote.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
