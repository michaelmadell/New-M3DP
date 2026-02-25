import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const categories = await prisma.category.findMany({
    include: {
      products: {
        select: { id: true },
      },
    },
  })

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(params.category && {
        category: {
          slug: params.category,
        },
      }),
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Shop</h1>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar with categories */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <ul className="space-y-2">
            <li>
              <Link
                href="/shop"
                className={`block px-4 py-2 rounded ${
                  !params.category
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                All Products
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/shop?category=${category.slug}`}
                  className={`block px-4 py-2 rounded ${
                    params.category === category.slug
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {category.name} ({category.products.length})
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Product grid */}
        <div className="md:col-span-3">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No products found in this category.</p>
              <Link href="/quote" className="btn btn-primary">
                Request a Custom Quote Instead
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  className="card hover:shadow-xl transition-shadow"
                >
                  <div className="bg-gray-200 h-48 rounded-lg mb-4 relative">
                    {product.images[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    )}
                  </div>
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">£{product.price.toFixed(2)}</span>
                    {product.stock > 0 ? (
                      <span className="text-green-600 text-sm">In Stock</span>
                    ) : (
                      <span className="text-red-600 text-sm">Out of Stock</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Make this page dynamic (not statically generated)
export const dynamic = 'force-dynamic'
