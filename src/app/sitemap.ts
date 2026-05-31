import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://forge-five-flax.vercel.app'
  const now = new Date()

  return [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/blog/alignment-score`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/decision-fatigue`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/life-os`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/hrv-tracking`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/habit-tracker-alternatives`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/morning-routine-system`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/setup`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ]
}
