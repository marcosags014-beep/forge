import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://forge-five-flax.vercel.app'
  const now = new Date()

  return [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    // Launch campaign page
    { url: `${base}/launch`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    // Blog posts
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/blog/alignment-score`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/decision-fatigue`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/life-os`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/hrv-tracking`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/habit-tracker-alternatives`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/morning-routine-system`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/personal-finance-tracker`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/ynab-alternative`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog/habitica-alternative`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog/biohacker-app`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/vs-notion-life-os`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/quantified-self-app`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/consistency-system`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog/daily-structure-app`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog/accountability-app`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog/oura-alternative`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/todoist-alternative`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog/self-discipline-app`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog/goal-tracking-app`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog/whoop-alternative`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/journaling-app`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/best-life-os-app`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog/myfitnesspal-alternative`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog/notion-alternative`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog/strava-alternative`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog/sleep-tracker-app`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/fitness-tracker-app`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/life-planner-app`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog/personal-development-app`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog/weekly-review-template`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/google-fit-alternative`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog/health-tracking-app`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    // /vs/ comparison pages
    { url: `${base}/vs/notion`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/vs/habitica`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/vs/ynab`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/vs/apple-health`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/vs/myfitnesspal`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/vs/strong-app`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/vs/strava`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/vs/obsidian`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/vs/google-fit`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    // /for/ persona pages
    { url: `${base}/for/athletes`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/for/founders`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/for/biohackers`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/for/students`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/for/entrepreneurs`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/for/adhd`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/for/creatives`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/for/remote-workers`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/for/executives`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/for/high-performers`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/for/parents`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/for/coaches`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    // Static pages
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/setup`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/settings`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    // App inner pages
    { url: `${base}/timeline`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/insights`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]
}
