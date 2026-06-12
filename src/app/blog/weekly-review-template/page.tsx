import type { Metadata } from 'next'
import Link from 'next/link'
import { ArticleJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Weekly Review Template 2026 — AI-Powered Life System | FORGE',
  description: 'The weekly review template that actually works: not a checklist, but a system that analyses your health, habits, finances, and goals with AI — and tells you what to change.',
  alternates: { canonical: 'https://forge-five-flax.vercel.app/blog/weekly-review-template' },
  openGraph: {
    title: 'Weekly Review Template 2026 — AI-Powered Life System',
    description: 'Most weekly reviews take 45 minutes and change nothing. FORGE\'s AI Weekly Review takes 5 minutes and tells you exactly what shifted.',
    type: 'article',
  },
}

export default function WeeklyReviewTemplatePage() {
  return (
    <>
      <ArticleJsonLd
        title="Weekly Review Template 2026 — AI-Powered Life System"
        description="The weekly review template that actually works: not a checklist, but a system that analyses your health, habits, finances, and goals with AI — and tells you what to change."
        url="https://forge-five-flax.vercel.app/blog/weekly-review-template"
        datePublished="2026-01-01"
      />
      <article className="max-w-2xl mx-auto px-6 py-12 text-zinc-300">
        <header className="mb-10">
          <p className="text-sm text-orange-400 font-medium mb-3">Systems · Productivity</p>
          <h1 className="text-3xl font-bold text-white leading-tight mb-4">
            Weekly Review Template 2026 (AI-Powered, Takes 5 Minutes)
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            The weekly review is the highest-leverage productivity practice available.
            Most people do it wrong: they review their task list, feel good about checking boxes,
            and change nothing. Here is the review that actually produces course corrections.
          </p>
        </header>

        <section className="space-y-6 leading-relaxed">
          <p>
            David Allen popularised the weekly review in <em>Getting Things Done</em>.
            The practice has been diluted into a hundred different templates, most of which
            share the same flaw: they review activity, not trajectory.
          </p>
          <p>
            The question is not "what did I do this week?" The question is
            "am I closer to who I intend to become than I was seven days ago?"
            Those are different questions with different answers.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">The Problem With Most Weekly Review Templates</h2>
          <p>
            Most weekly review templates are checklists: clear your inbox, review your projects,
            look at your calendar, set priorities. These are maintenance tasks, not growth tasks.
          </p>
          <p>
            A maintenance review tells you what is left to do. A growth review tells you
            whether your actions this week moved you toward your goals — and if not, what
            specifically changed.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">The FORGE Weekly Review — What to Review</h2>

          <div className="space-y-4 my-6">
            {[
              {
                n: '1',
                label: 'Alignment Score',
                body: 'Your word-kept rate for the week. Habit completion % and commitment kept %. This is the most important number. If it is below 70%, the review starts here: what specifically caused the gap?',
              },
              {
                n: '2',
                label: 'Health Trend',
                body: 'Did your sleep hours and quality improve or decline this week? Did your HRV trend up or down? These predict next week\'s execution capacity. A declining health trend means next week will be harder, not easier.',
              },
              {
                n: '3',
                label: 'Domain Scores',
                body: 'Where did you gain ground? Where did you lose it? The Life Score breaks down into Health, Body, Wealth, and Mind — each with a trend. One declining domain is a signal. Two declining domains is a pattern.',
              },
              {
                n: '4',
                label: 'Goal Progress',
                body: 'Did each goal\'s progress % move this week? If a goal did not move, name the reason specifically. "Busy" is not a reason. What specific action was skipped, and what was it replaced with?',
              },
              {
                n: '5',
                label: 'Financial Position',
                body: 'Did cash flow improve or decline relative to the previous week? Is the trend moving toward or away from your financial goals? This review takes 2 minutes and has outsized impact on financial behaviour.',
              },
              {
                n: '6',
                label: 'Oracle AI Review',
                body: 'FORGE\'s AI Weekly Review reads all your data for the week and surfaces cross-domain patterns — things you would not notice reviewing each domain separately. This is the synthesis that most people skip when reviewing manually.',
              },
            ].map(({ n, label, body }) => (
              <div key={n} className="flex gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/30">
                <span className="text-lg font-black text-orange-400/40 flex-shrink-0 w-6">{n}.</span>
                <div>
                  <p className="font-semibold text-white mb-1">{label}</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">The Weekly Review Template (Manual Version)</h2>
          <p>
            If you are not using FORGE yet, here is a manual template that covers the same ground:
          </p>

          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 my-6 font-mono text-xs space-y-3">
            <p className="text-orange-400 font-bold text-sm not-italic">WEEKLY REVIEW — {new Date().toISOString().split('T')[0]}</p>
            <div className="space-y-1 text-zinc-300">
              <p className="text-zinc-500">## ALIGNMENT</p>
              <p>Habits completed this week: ___ / ___ (___ %)</p>
              <p>Commitments I kept: ___ / ___ (___ %)</p>
              <p>If below 70%: What specifically caused the gap? ___</p>
            </div>
            <div className="space-y-1 text-zinc-300">
              <p className="text-zinc-500">## HEALTH</p>
              <p>Average sleep hours: ___</p>
              <p>Average sleep quality (1-10): ___</p>
              <p>Average HRV (if tracked): ___</p>
              <p>Health trend vs last week: Better / Same / Worse</p>
            </div>
            <div className="space-y-1 text-zinc-300">
              <p className="text-zinc-500">## GOALS</p>
              <p>Goal 1: ___ — Progress this week: ___</p>
              <p>Goal 2: ___ — Progress this week: ___</p>
              <p>Goal 3: ___ — Progress this week: ___</p>
            </div>
            <div className="space-y-1 text-zinc-300">
              <p className="text-zinc-500">## FINANCES</p>
              <p>This week income: ___ | expenses: ___</p>
              <p>Net this week: ___ | Trend vs last week: ___</p>
            </div>
            <div className="space-y-1 text-zinc-300">
              <p className="text-zinc-500">## NEXT WEEK FOCUS</p>
              <p>Single highest-leverage change: ___</p>
              <p>Three non-negotiable commitments:</p>
              <p>1. ___  2. ___  3. ___</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">The AI-Powered Version</h2>
          <p>
            The manual template works. The AI-powered version in FORGE adds the layer that
            the manual template cannot: cross-domain pattern recognition.
          </p>
          <p>
            FORGE's AI Weekly Review reads all your data for the week and generates a
            narrative summary: what went well, what declined, and — most importantly —
            what patterns connect the domains. Did your habit completion drop correlate
            with a sleep quality decline? Did a spending spike follow a high-stress week?
            Oracle names these connections specifically.
          </p>
          <p>
            The review takes 5 minutes, not 45. You review Oracle's narrative, confirm or
            challenge it, and set your three non-negotiables for next week.
          </p>

          <div className="border border-zinc-700 rounded-lg p-6 mt-10 bg-zinc-900/50">
            <p className="text-white font-medium mb-2">Get your AI-powered weekly review — free</p>
            <p className="text-zinc-400 text-sm mb-4">
              FORGE automatically generates your weekly narrative from your health, habit,
              finance, and goal data. Unlock with Pro — starts with a free trial.
            </p>
            <Link
              href="/setup"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors"
            >
              Try FORGE Free →
            </Link>
          </div>
        </section>

        <footer className="mt-12 pt-8 border-t border-zinc-800">
          <p className="text-zinc-500 text-sm mb-3">Related:</p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/blog/morning-routine-system" className="text-orange-400 hover:text-orange-300 text-sm">Morning Routine System</Link>
            <Link href="/blog/alignment-score" className="text-orange-400 hover:text-orange-300 text-sm">The Alignment Score</Link>
            <Link href="/blog/consistency-system" className="text-orange-400 hover:text-orange-300 text-sm">Consistency System</Link>
            <Link href="/blog/goal-tracking-app" className="text-orange-400 hover:text-orange-300 text-sm">Goal Tracking App</Link>
            <Link href="/blog/decision-fatigue" className="text-orange-400 hover:text-orange-300 text-sm">Decision Fatigue</Link>
          </div>
        </footer>
      </article>
    </>
  )
}
