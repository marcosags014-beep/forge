import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/activate'] },
    sitemap: 'https://forge-five-flax.vercel.app/sitemap.xml',
  }
}
