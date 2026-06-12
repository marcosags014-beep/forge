import type { Metadata } from 'next'
import Link from 'next/link'
import { Flame } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About FORGE — The Life OS for Serious People | FORGE',
  description: 'FORGE is an accountability system built on one idea: closing the gap between who you say you want to be and how you actually live. Local-first, free to start.',
  alternates: { canonical: 'https://forge-five-flax.vercel.app/about' },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav className="px-6 md:px-16 py-5 border-b border-border flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <Flame className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold">FORGE</span>
        </Link>
        <Link href="/setup" className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
          Get Started Free
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-6">What FORGE is for</h1>

        <div className="space-y-8 text-zinc-300 leading-relaxed">
          <p className="text-lg text-zinc-400">
            FORGE exists because most productivity and health apps solve the wrong problem.
          </p>

          <p>
            They help you organise tasks, track habits, log workouts, and manage budgets — in separate applications with no connection between them. The insight that your sleep quality predicts your spending behaviour the next day is invisible across five different apps. The pattern that your workout consistency drops every time you have a difficult financial week cannot be seen without a system that tracks both.
          </p>

          <p>
            FORGE tracks six life domains simultaneously — health vitals, training, nutrition, finances, habits, and goals — and uses an AI intelligence layer called Oracle to surface the cross-domain patterns that single-domain apps cannot see. It then tells you, each day, what to focus on based on your actual data and your stated goals.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10">The Alignment Score</h2>
          <p>
            At the core of FORGE is a metric called the Alignment Score: a measure of how consistently your actual daily behaviour matches the commitments and intentions you have stated. It is not a measure of how productive you were, or how healthy you are, or how much you accomplished. It is a measure of whether you kept your word to yourself.
          </p>
          <p>
            Most people who calculate this for the first time are below 40%. Not because they are lazy — but because they have never had a system that honestly measures the gap between intention and execution.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10">Built local-first</h2>
          <p>
            All FORGE data lives on your device by default. Nothing is sent to any server except the text you explicitly type to Oracle — and those queries are processed by Anthropic&apos;s Claude API, not stored. You can use the full app without an account, indefinitely. No login required. No subscription required to start.
          </p>
          <p>
            Optional cloud sync is available for users who want their data backed up and accessible across devices. It is opt-in, free with a FORGE account.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10">The philosophy</h2>
          <p>
            The goal of FORGE is not to make you more productive in a generic sense. It is to help you close the gap between who you say you want to be and how you are actually living. That is a specific, measurable thing — and it is what FORGE is designed to do.
          </p>
          <p>
            Accountability is not reminders. It is not streaks. It is the honest, daily confrontation with the gap between your intentions and your actions — and the system that makes that confrontation possible.
          </p>

          <div className="mt-12 p-6 bg-zinc-900 border border-zinc-700 rounded-2xl">
            <p className="text-white font-semibold mb-2">Ready to see your Alignment Score?</p>
            <p className="text-zinc-400 text-sm mb-4">Takes 90 seconds to set up. Free forever — no account required.</p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/setup" className="inline-block bg-orange-500 text-black font-semibold px-5 py-2.5 rounded-xl hover:bg-orange-400 transition-colors text-sm">
                Start Free
              </Link>
              <Link href="/pricing" className="inline-block bg-zinc-800 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-zinc-700 transition-colors text-sm">
                See Pricing
              </Link>
              <Link href="/blog" className="inline-block bg-transparent text-zinc-400 font-semibold px-5 py-2.5 rounded-xl hover:text-white transition-colors text-sm">
                Read the Blog
              </Link>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-800 flex flex-wrap gap-5 text-sm text-zinc-500">
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms of Service</Link>
            <a href="mailto:support@forge-life.app" className="hover:text-zinc-300 transition-colors">support@forge-life.app</a>
          </div>
        </div>
      </div>
    </main>
  )
}
