import Link from 'next/link'
import type { Metadata } from 'next'
import { ArticleJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'The Alignment Score: Why Habit Streaks Are Lying to You | FORGE',
  description: 'Most productivity apps reward logging. FORGE measures something harder: whether you actually do what you say you will. The Alignment Score is the gap between your commitments and your execution.',
  openGraph: {
    title: 'The Alignment Score: Why Habit Streaks Are Lying to You',
    description: 'Most apps reward logging. The Alignment Score measures whether you keep your word to yourself.',
    type: 'article',
  },
}

export default function AlignmentScorePost() {
  return (
    <>
      <ArticleJsonLd
        title="The Alignment Score: Why Habit Streaks Are Lying to You | FORGE"
        description="Most productivity apps reward logging. FORGE measures whether you actually do what you say you will. The Alignment Score is the gap between your commitments and your execution."
        url="https://forge-five-flax.vercel.app/blog/alignment-score"
        datePublished="2026-01-01"
      />
      <div className="min-h-screen bg-background text-foreground">
      <nav className="px-6 md:px-16 py-5 border-b border-border">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to FORGE</Link>
      </nav>

      <article className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-8">
          <span className="text-xs text-primary font-semibold uppercase tracking-widest">Accountability</span>
          <h1 className="text-3xl md:text-4xl font-bold mt-3 mb-4 leading-tight">
            The Alignment Score: Why Habit Streaks Are Lying to You
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Most productivity apps measure consistency. FORGE measures integrity — the gap between what you commit to and what you actually do.
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-foreground/90 leading-relaxed">
          <p>
            Habit trackers are built around a comforting lie: that logging counts as doing.
          </p>
          <p>
            You mark a habit complete. You see a streak. You feel good. But streaks measure consistency of logging — not consistency of becoming. You can maintain a 90-day streak on a habit that is not moving you toward who you want to be.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">The Intention-Execution Gap</h2>
          <p>
            Every goal has two versions: the one you intend and the one you execute. Most tracking systems only measure one side. FORGE measures the gap between both.
          </p>
          <p>
            When you create a task in FORGE, it is timestamped as a commitment — not a to-do. Every day that task remains incomplete past its creation date, it registers as a broken promise. Not a missed item. A commitment you made to yourself and did not keep.
          </p>
          <p>
            Your <strong>Alignment Score</strong> is the percentage of your commitments you actually follow through on. It is calculated from two inputs:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Habit Rate (60% weight):</strong> How consistently you complete your daily habits</li>
            <li><strong>Word Kept Rate (40% weight):</strong> What percentage of past-due tasks you completed vs abandoned</li>
          </ul>
          <p>
            The formula: <code className="bg-secondary px-2 py-0.5 rounded text-sm">Alignment = habitRate × 0.6 + keptRate × 0.4</code>
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">Why This Number Hits Different</h2>
          <p>
            The first time most people see their Alignment Score, they are surprised. People who consider themselves disciplined routinely score below 50%. Not because they are lazy — because they have never had a system that held them to their own word.
          </p>
          <p>
            A score of 34% does not mean you are a failure. It means 66% of the commitments you made to yourself did not get executed. That gap is where your potential is leaking.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">How It Affects Your Life Score</h2>
          <p>
            In FORGE, the Alignment Score is not a standalone metric. It acts as a multiplier on your overall Life Score:
          </p>
          <p>
            <code className="bg-secondary px-2 py-0.5 rounded text-sm">Life Score = domain composite × (0.80 + alignmentScore/100 × 0.20)</code>
          </p>
          <p>
            This means you cannot hack your Life Score with good sleep and solid workouts if your alignment is low. The system is designed to reflect reality: a person who hits the gym but ignores their financial commitments and drops their goals is not performing at a high level — no matter how good their HRV looks.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">The Oracle Connection</h2>
          <p>
            Every time you talk to Oracle — FORGE&apos;s AI — it knows your Alignment Score. If your score is below 70%, Oracle is instructed to address the intention-execution gap directly. Not gently. If you have overdue commitments, it names them.
          </p>
          <p>
            This is the design philosophy behind FORGE: data without accountability is just surveillance. The Alignment Score makes the data mean something.
          </p>

          <div className="mt-12 p-6 rounded-2xl border border-primary/20 bg-primary/5">
            <p className="text-sm font-semibold mb-2">Track your Alignment Score in FORGE</p>
            <p className="text-sm text-muted-foreground mb-4">Free. No account. All data stays on your device.</p>
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-primary-foreground bg-primary px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors">
              Open FORGE →
            </Link>
          </div>
        </div>
      </article>
    </div>
    </>
  )
}
