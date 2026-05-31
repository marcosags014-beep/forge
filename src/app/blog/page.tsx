import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | FORGE Life OS',
  description: 'Insights on accountability, performance, decision fatigue, HRV tracking, and building a system that actually gets you to who you want to become.',
}

const posts = [
  {
    href: '/blog/alignment-score',
    tag: 'Accountability',
    title: 'The Alignment Score: Why Habit Streaks Are Lying to You',
    description: 'Most productivity apps reward logging. The Alignment Score measures whether you actually keep your word to yourself.',
  },
  {
    href: '/blog/decision-fatigue',
    tag: 'Productivity',
    title: 'Decision Fatigue Is Killing Your Mornings',
    description: 'You are making 35,000 decisions per day. Most happen before 10am. Here is the one system that fixes it.',
  },
  {
    href: '/blog/life-os',
    tag: 'Systems',
    title: 'What Is a Personal Life OS?',
    description: 'One unified system for health, body, wealth, and mind — connected by AI that finds the patterns between them.',
  },
  {
    href: '/blog/hrv-tracking',
    tag: 'Health',
    title: 'HRV: The Metric That Connects Sleep, Money, and Performance',
    description: 'Your HRV predicts not just your workout — but your spending, mood, and decision quality.',
  },
]

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="px-6 md:px-16 py-5 border-b border-border flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">FORGE</Link>
        <Link href="/setup" className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
          Get Started Free
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2">Blog</h1>
        <p className="text-muted-foreground mb-12">Accountability, performance, and systems for becoming who you want to be.</p>

        <div className="space-y-8">
          {posts.map(post => (
            <Link key={post.href} href={post.href} className="block group">
              <article className="p-6 rounded-2xl border border-border hover:border-primary/30 transition-colors bg-card/30 hover:bg-card/60">
                <span className="text-xs text-primary font-semibold uppercase tracking-widest">{post.tag}</span>
                <h2 className="text-lg font-bold mt-2 mb-2 group-hover:text-primary transition-colors">{post.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{post.description}</p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
