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
  {
    href: '/blog/habit-tracker-alternatives',
    tag: 'Accountability',
    title: 'The Best Habit Tracker Alternatives in 2026',
    description: 'Traditional habit trackers measure consistency of logging. Not consistency of doing. Here\'s what the difference costs you.',
  },
  {
    href: '/blog/morning-routine-system',
    tag: 'Productivity',
    title: 'How to Build a Morning Routine That Actually Works',
    description: 'Most morning routines are really morning planning sessions. Here\'s the system that gives you a clear answer in 90 seconds.',
  },
  {
    href: '/blog/personal-finance-tracker',
    tag: 'Wealth',
    title: 'The Personal Finance Tracker That Connects to Your Health',
    description: 'Your worst spending weeks follow your lowest sleep weeks. FORGE shows you the connection — and breaks the cycle.',
  },
  {
    href: '/blog/biohacker-app',
    tag: 'Performance',
    title: 'The Best Biohacker App in 2026 (That Actually Connects Your Data)',
    description: 'Most biohacker apps track one thing in isolation. The ideal biohacker stack in 2026 connects HRV, sleep, training, and finance — and uses AI to find the patterns.',
  },
  {
    href: '/blog/ynab-alternative',
    tag: 'Comparison',
    title: 'Best YNAB Alternative in 2026 That Connects to Your Health',
    description: 'YNAB cannot tell you that your overspending weeks follow your worst sleep weeks. FORGE tracks both — and connects them with AI.',
  },
  {
    href: '/blog/habitica-alternative',
    tag: 'Comparison',
    title: 'Best Habitica Alternative in 2026 (If You Want More Than a Streak)',
    description: 'Habitica optimises for logging. FORGE measures whether you actually keep your word to yourself. The Alignment Score is the difference.',
  },
  {
    href: '/blog/vs-notion-life-os',
    tag: 'Comparison',
    title: 'FORGE vs Notion as a Life OS (2026)',
    description: 'Notion is a canvas. FORGE is an intelligence system. The difference is whether the system does the thinking — or you do.',
  },
  {
    href: '/blog/quantified-self-app',
    tag: 'Systems',
    title: 'The Best Quantified Self App in 2026 (Cross-Domain AI)',
    description: 'The quantified self community has more data than ever and less synthesis than ever. The missing layer: cross-domain AI that connects your metrics.',
  },
  {
    href: '/blog/consistency-system',
    tag: 'Accountability',
    title: "Why You Can't Stay Consistent (It's Not Willpower)",
    description: "Willpower is finite and unreliable. Consistency is a systems problem. Here's the structural fix.",
  },
  {
    href: '/blog/daily-structure-app',
    tag: 'Productivity',
    title: 'The Best App for Building Daily Structure in 2026',
    description: 'Structure is not rigidity — it is the elimination of the decision about whether to do the important thing. Here is how to build it.',
  },
  {
    href: '/blog/accountability-app',
    tag: 'Accountability',
    title: 'Best Personal Accountability App 2026 — That Actually Works',
    description: 'Accountability is not reminders. It is measuring whether you kept your word to yourself. The Alignment Score is how FORGE does it.',
  },
  {
    href: '/blog/oura-alternative',
    tag: 'Health',
    title: 'Best Oura Ring Alternative 2026 — No Wearable Required',
    description: 'The Oura Ring gives you data. But data without direction changes nothing. Here is what a smarter system looks like.',
  },
  {
    href: '/blog/todoist-alternative',
    tag: 'Comparison',
    title: 'Best Todoist Alternative 2026 — For People Who Actually Want Results',
    description: 'Task management is not the bottleneck. Execution is. Here is what to use when the list stops working.',
  },
  {
    href: '/blog/self-discipline-app',
    tag: 'Accountability',
    title: 'Best App for Self-Discipline 2026 — That Actually Builds It',
    description: 'Discipline is a measurement problem. Close the gap between your intentions and your actions with an honest score.',
  },
  {
    href: '/blog/goal-tracking-app',
    tag: 'Goals',
    title: 'Best Goal Tracking App 2026 — That Actually Gets You There',
    description: 'Most goal apps track progress. The best ones build the behaviour that produces it. Here is the distinction that matters.',
  },
  {
    href: '/blog/whoop-alternative',
    tag: 'Health',
    title: 'Best Whoop Alternative 2026 — Without the Subscription Trap',
    description: '$239/year for data you can log in 90 seconds. Here are your options — and when Whoop is actually worth it.',
  },
  {
    href: '/blog/journaling-app',
    tag: 'Mindset',
    title: 'Best Journaling App 2026 — Connected to the Rest of Your Life',
    description: "Most journaling apps store your words. The best connect them to your patterns. Here's the difference.",
  },
  {
    href: '/blog/best-life-os-app',
    tag: 'Systems',
    title: 'Best Life OS App 2026 — Ranked and Reviewed',
    description: 'Notion, FORGE, Obsidian, Capacities — the honest comparison of which Life OS is actually worth using.',
  },
  {
    href: '/blog/notion-alternative',
    tag: 'Comparison',
    title: 'Best Notion Alternative in 2026 for Personal Productivity',
    description: "Notion's flexibility is also its biggest weakness. Here's what to use when you want a system that does the thinking — not more setup.",
  },
  {
    href: '/blog/myfitnesspal-alternative',
    tag: 'Comparison',
    title: 'Best MyFitnessPal Alternative in 2026 (That Does More Than Count Calories)',
    description: 'MyFitnessPal counts calories. The best alternative connects your nutrition to your sleep, HRV, workouts, and goals — with AI that shows the patterns.',
  },
  {
    href: '/blog/strava-alternative',
    tag: 'Comparison',
    title: 'Best Strava Alternative in 2026 (For Serious Athletes)',
    description: 'Strava records your training. The best alternatives tell you why performance varies — and connect your workouts to your recovery, nutrition, and goals.',
  },
  {
    href: '/blog/sleep-tracker-app',
    tag: 'Health',
    title: 'Best Sleep Tracker App 2026 — That Actually Changes Your Sleep',
    description: 'Tracking sleep is the easy part. The hard part is connecting sleep data to every other metric. Here are the apps that actually produce results.',
  },
  {
    href: '/blog/fitness-tracker-app',
    tag: 'Fitness',
    title: 'Best Fitness Tracker App 2026 — That Connects Workouts to Recovery',
    description: 'Every app tracks what you did. The one that matters connects it to your recovery state — and tells you whether tomorrow is a push or rest day.',
  },
  {
    href: '/blog/life-planner-app',
    tag: 'Systems',
    title: 'Best Life Planner App 2026 — That Actually Plans Your Life',
    description: 'Most life planner apps are glorified calendars. The one that works connects daily actions to long-term identity — and tells you what to do today.',
  },
  {
    href: '/blog/personal-development-app',
    tag: 'Growth',
    title: 'Best Personal Development App 2026 — That Measures Progress',
    description: 'Personal development is measured by the gap between who you said you would be and who you are. Here\'s the app that makes that gap visible.',
  },
  {
    href: '/blog/weekly-review-template',
    tag: 'Productivity',
    title: 'Weekly Review Template 2026 — AI-Powered Life System',
    description: 'Most weekly reviews change nothing. The AI-powered version in FORGE takes 5 minutes and tells you exactly what shifted — and what to do next week.',
  },
  {
    href: '/blog/health-tracking-app',
    tag: 'Health',
    title: 'Best Health Tracking App in 2026 (That Connects Health to Performance)',
    description: 'Most health tracking apps collect metrics and display charts. The best one connects your health data to your habits, finances, and goals — with AI.',
  },
  {
    href: '/blog/google-fit-alternative',
    tag: 'Comparison',
    title: 'Best Google Fit Alternative in 2026 (That Actually Uses Your Data)',
    description: "Google Fit collects health data passively and shows it in silos. The best alternatives connect that data to your habits, performance, and goals.",
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
