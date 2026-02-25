import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Blog & Reviews</h1>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.id} className="card hover:shadow-xl transition-shadow">
              {post.coverImage && (
                <div className="relative h-64 -mx-6 -mt-6 mb-6">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
              )}
              
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                {post.category && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    {post.category}
                  </span>
                )}
                <span>
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : ''}
                </span>
              </div>

              <h2 className="text-2xl font-bold mb-4">
                <Link href={`/blog/${post.slug}`} className="hover:text-blue-600">
                  {post.title}
                </Link>
              </h2>

              {post.excerpt && (
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
              )}

              <Link
                href={`/blog/${post.slug}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export const dynamic = 'force-dynamic'
