import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://monkeys3dprints.co.uk';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [posts, products] = await Promise.all([
        prisma.post.findMany({
            where: {isPublished: true},
            select: {slug: true, updatedAt: true, publishedAt: true }
        }),
        prisma.product.findMany({
            where: {isActive: true},
            select: { slug: true, updatedAt: true }
        })
    ]);

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: `${siteUrl}/`, lastModified: new Date() },
        { url: `${siteUrl}/shop`, lastModified: new Date() },
        { url: `${siteUrl}/quote`, lastModified: new Date() },
        { url: `${siteUrl}/gallery`, lastModified: new Date() },
        { url: `${siteUrl}/blog`, lastModified: new Date() },
        { url: `${siteUrl}/contact`, lastModified: new Date() },
        { url: `${siteUrl}/about`, lastModified: new Date() },
    ];

    const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
        url: `${siteUrl}/blog/${p.slug}`,
        lastModified: p.updatedAt ?? p.publishedAt ?? new Date()
    }));

    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
        url: `${siteUrl}/shop/${p.slug}`,
        lastModified: p.updatedAt ?? new Date()
    }));

    return [...staticRoutes, ...postRoutes, ...productRoutes];
}