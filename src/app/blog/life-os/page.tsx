import Link from 'next/link'
import type { Metadata } from 'next'
import { ArticleJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'What Is a Personal Life OS? | FORGE',
  description: 'A Personal Life Operating System (Life OS) is a unified system for tracking, analysing, and optimising every domain of your life simultaneously. Here is what it is, why it matters, and how to build one.',
  openGraph: {
    title: 'What Is a Personal Life OS?',
    description: 'One system for health, body, wealth, and mind — connected by AI that finds the patterns between them.',
    type: 'article',
  },
}

export default function LifeOSPost() {
  return (
    <>
      <ArticleJsonLd
        title="What Is a Personal Life OS? | FORGE"
        description="One unified system for health, body, wealth, and mind — connected by AI that finds the patterns between them. Here is what a life OS actually is."
        url="https://forge-five-flax.vercel.app/blog/life-os"
        datePublished="2026-01-01"
      />
      <div className="min-h-screen bg-background text-foreground">
      <nav className="px-6 md:px-16 py-5 border-b border-border">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to FORGE</Link>
      </nav>

      <article className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-8">
          <span className="text-xs text-primary font-semibold uppercase tracking-widest">Systems</span>
          <h1 className="text-3xl md:text-4xl font-bold mt-3 mb-4 leading-tight">
            What Is a Personal Life OS?
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Your phone has an operating system that coordinates all its hardware and software into one coherent experience. Your life needs the same thing.
          </p>
        </div>

        <div className="space-y-6 text-foreground/90 leading-relaxed">
          <p>
            A Personal Life Operating System — or Life OS — is a unified framework for tracking, measuring, and optimising every significant domain of your life simultaneously.
          </p>
          <p>
            The key word is <em>simultaneously</em>. Most people optimise domains in isolation: they go on a fitness kick, or a financial discipline phase, or a deep work sprint. What they do not do is manage all four at once — because there has never been a system designed to do that.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">The Four Domains</h2>
          <p>A complete Life OS covers four fundamental areas:</p>
          <ul className="list-disc list-inside space-y-3 pl-4">
            <li><strong>Health:</strong> Sleep quality and duration, heart rate variability (HRV), resting heart rate, daily energy levels, mood. These are the inputs that determine your capacity for everything else.</li>
            <li><strong>Body:</strong> Workouts (type, volume, intensity), nutrition (calories, macros), body composition. Physical performance and how you fuel it.</li>
            <li><strong>Wealth:</strong> Income and expense tracking, cash flow, savings rate, financial goals. The resource base that funds the life you want.</li>
            <li><strong>Mind:</strong> Life goals and their progress, daily habits and completion rate, priority tasks, journaling. The direction-setting and accountability layer.</li>
          </ul>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">Why the Domains Cannot Be Separated</h2>
          <p>
            The reason siloed apps fail is that life domains are not independent variables. They interact constantly:
          </p>
          <p>
            Poor sleep raises cortisol. Elevated cortisol increases impulsive spending. Impulsive spending creates financial stress. Financial stress reduces sleep quality. You are back where you started — but now your workout performance has dropped too because your recovery is compromised.
          </p>
          <p>
            None of your individual apps can see this loop. Only a system that ingests all four domains can surface it.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">The Scoring Layer</h2>
          <p>
            A Life OS needs a single number that reflects your overall state — not because life can be reduced to one number, but because humans need a dashboard reading. Pilots do not read every instrument simultaneously; they watch the altitude and heading and dive deeper when something is off.
          </p>
          <p>
            FORGE&apos;s Life Score is calculated as:
          </p>
          <p>
            <code className="bg-secondary px-2 py-0.5 rounded text-sm block p-3 my-2">Life Score = (health×0.30 + body×0.20 + wealth×0.25 + mind×0.25) × alignment multiplier</code>
          </p>
          <p>
            The alignment multiplier (0.80–1.00) is driven by your Alignment Score — how consistently you keep the commitments you make to yourself. A person with perfect domain scores but zero follow-through is not performing at a high level. The system reflects this.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">The Intelligence Layer</h2>
          <p>
            Data without intelligence is surveillance. The final component of a Life OS is an AI layer that analyses the data across all domains and surfaces actionable insights — not generic advice, but specific observations tied to your actual numbers.
          </p>
          <p>
            &ldquo;Your HRV has dropped 20% over the last three days and your workout intensity has been at 90%+ each session. Your body is signalling overtraining. Today should be mobility and recovery work.&rdquo;
          </p>
          <p>
            That is what cross-domain intelligence looks like. Not &ldquo;remember to rest.&rdquo; A specific observation, a specific cause, a specific action.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">Building Your Life OS</h2>
          <p>
            You can build a Life OS from scratch using Notion, spreadsheets, and multiple APIs — and many people do. The trade-off is time and maintenance overhead.
          </p>
          <p>
            FORGE is a pre-built Life OS: four domains, unified scoring, AI intelligence, and an accountability layer — all in one app. Free tier covers everything except unlimited AI queries.
          </p>

          <div className="mt-12 p-6 rounded-2xl border border-primary/20 bg-primary/5">
            <p className="text-sm font-semibold mb-2">Start your Life OS today</p>
            <p className="text-sm text-muted-foreground mb-4">Free. No account. All data stays on your device.</p>
            <Link href="/setup" className="inline-flex items-center gap-2 text-sm font-bold text-primary-foreground bg-primary px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors">
              Set up FORGE →
            </Link>
          </div>
        </div>
      </article>
    </div>
    </>
  )
}
