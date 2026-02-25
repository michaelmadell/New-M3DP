import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white min-h-screen p-6">
          <Link href="/admin" className="text-2xl font-bold mb-8 block">
            Admin Panel
          </Link>
          
          <nav className="space-y-2">
            <Link
              href="/admin"
              className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              📊 Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              📦 Products
            </Link>
            <Link
              href="/admin/categories"
              className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              🏷️ Categories
            </Link>
            <Link
              href="/admin/orders"
              className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              🛒 Orders
            </Link>
            <Link
              href="/admin/quotes"
              className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              💬 Quotes
            </Link>
            <Link
              href="/admin/blog"
              className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              ✍️ Blog / Reviews
            </Link>
            <Link
              href="/admin/gallery"
              className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              🖼️ Gallery
            </Link>
            
            <div className="border-t border-gray-700 my-4"></div>
            
            <Link
              href="/"
              className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              ← Back to Site
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
