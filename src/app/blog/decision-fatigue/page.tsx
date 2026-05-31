import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Decision Fatigue Is Killing Your Mornings (Here Is How to Fix It) | FORGE',
  description: 'The average knowledge worker makes 35,000 decisions per day. Most of them happen before 10am. Decision fatigue is why your best intentions evaporate by noon — and how a single dashboard fixes it.',
  openGraph: {
    title: 'Decision Fatigue Is Killing Your Mornings',
    description: 'Stop spending 30 minutes deciding what to focus on. FORGE tells you in 5 seconds.',
    type: 'article',
  },
}

export default function DecisionFatiguePost() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="px-6 md:px-16 py-5 border-b border-border">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to FORGE</Link>
      </nav>

      <article className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-8">
          <span className="text-xs text-primary font-semibold uppercase tracking-widest">Productivity</span>
          <h1 className="text-3xl md:text-4xl font-bold mt-3 mb-4 leading-tight">
            Decision Fatigue Is Killing Your Mornings
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            You are making 35,000 decisions per day. Most happen before 10am. Here is why that destroys performance — and the one system that fixes it.
          </p>
        </div>

        <div className="space-y-6 text-foreground/90 leading-relaxed">
          <p>
            You wake up. You open your phone. The decisions start immediately.
          </p>
          <p>
            Should I check my sleep score? Did I recover enough to train hard today? What does my schedule look like? Did I hit my calorie target yesterday? What is the most important thing to work on this morning? Am I on track for my financial goals this month?
          </p>
          <p>
            By the time you have breakfast, you have already burned through cognitive resources that could have gone toward the work that actually matters.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">The Hidden Cost of Four Separate Apps</h2>
          <p>
            The average person serious about self-improvement uses at least four tracking systems: a health app (Oura, Whoop, Apple Health), a fitness tracker (MyFitnessPal, Strava), a financial app (YNAB, Copilot), and some combination of Notion, Todoist, or a habit tracker.
          </p>
          <p>
            None of these apps know about the others. Each morning you become your own data analyst, trying to synthesize four separate datasets into one coherent picture of what you should do today.
          </p>
          <p>
            That synthesis is the hidden cost. It is not the 5 minutes in each app. It is the 20–30 minutes of cognitive overhead trying to connect the dots — and the constant background hum of wondering whether you are focusing on the right thing.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">What Cross-Domain Intelligence Actually Means</h2>
          <p>
            Your health data, body data, financial data, and goal data do not exist in isolation. They are deeply interconnected:
          </p>
          <ul className="list-disc list-inside space-y-3 pl-4">
            <li><strong>Sleep quality → spending patterns.</strong> Research consistently shows that sleep deprivation increases impulsive spending. Low HRV days correlate with higher discretionary purchases.</li>
            <li><strong>Training load → cognitive performance.</strong> Overtraining reduces mental clarity. The day after a max-effort session, your best work is recovery — not deep focus.</li>
            <li><strong>Financial stress → workout consistency.</strong> When cash flow is negative, workout frequency drops within 2 weeks. The domains talk to each other whether your apps do or not.</li>
            <li><strong>Goal alignment → energy levels.</strong> People working on things that connect to their stated identity report higher energy and better sleep quality.</li>
          </ul>
          <p>
            An AI that sees all four domains simultaneously can surface these connections. One that only sees your sleep data cannot.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">The 60-Second Morning Protocol</h2>
          <p>
            FORGE is designed around one principle: the morning check-in should take 60 seconds, not 45 minutes.
          </p>
          <p>
            You log your vitals (sleep hours, HRV if you have it, energy level, mood — 30 seconds). The AI (Oracle) has already reviewed everything else and surfaced one clear priority. You read it. You close the app. You go do the thing.
          </p>
          <p>
            The decision has already been made — by an intelligence that looked at all four domains simultaneously while you were sleeping.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">Stop Deciding. Start Doing.</h2>
          <p>
            Decision fatigue is not a discipline problem. It is a systems problem. The solution is not more willpower — it is fewer decisions, made in advance, by a system that has better information than you do in any given moment.
          </p>
          <p>
            That is what FORGE is built for.
          </p>

          <div className="mt-12 p-6 rounded-2xl border border-primary/20 bg-primary/5">
            <p className="text-sm font-semibold mb-2">Eliminate morning decision fatigue with FORGE</p>
            <p className="text-sm text-muted-foreground mb-4">Free. No account required. Your data stays on your device.</p>
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-primary-foreground bg-primary px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors">
              Open FORGE →
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
