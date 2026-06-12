import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FORGE for Remote Workers — Reclaim Structure Without an Office | Life OS',
  description: 'Remote work removes the external structure that keeps most people on track. FORGE replaces it with a personal system that adapts to your life — free, local-first.',
  alternates: { canonical: 'https://forge-five-flax.vercel.app/for/remote-workers' },
  openGraph: {
    title: 'FORGE for Remote Workers — Reclaim Structure Without an Office',
    description: "The office gave you structure by default. Remote work took it away. Here's how to build a better version.",
    type: 'website',
  },
}

export default function ForRemoteWorkers() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12 text-zinc-300">
      <header className="mb-12">
        <p className="text-sm text-orange-400 font-medium mb-3 uppercase tracking-wide">FORGE for</p>
        <h1 className="text-4xl font-bold text-white leading-tight mb-5">
          Remote work removes structure. FORGE gives it back.
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed mb-6">
          The office was an accountability system you never had to design. Fixed hours, peer visibility, physical separation between work and home. Remote work removed all of it. FORGE is the personal structure layer that replaces what the office gave you — on your terms.
        </p>
        <Link href="/setup" className="inline-block bg-orange-500 text-black font-semibold px-6 py-3 rounded-xl hover:bg-orange-400 transition-colors">
          Start Free — No Account Required
        </Link>
      </header>

      <section className="space-y-10">
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">The remote work structure gap</h2>
          <p>
            When the office disappears, so does the passive structure it provided: commutes that created transition rituals, colleagues who noticed when you were off, physical cues that signalled the start and end of work. Remote workers often spend months trying to recreate this artificially with todo lists and time-blocking — and finding it does not work the same way.
          </p>
          <p className="mt-3">
            The reason is that the missing structure was not a productivity system — it was an accountability system. You knew your manager could see whether you were there. Your peers knew when you were working. That visibility created a feedback loop that kept most people reasonably on track. A todo list has no such feedback loop.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">Your daily directive in 90 seconds</h2>
          <p>
            The most time-consuming part of remote work is not the work — it is the morning meta-work: deciding what matters today, figuring out your energy level, calibrating between urgent and important. Oracle AI eliminates this. It reads your health data, your habit history, your goals, and your outstanding commitments — and gives you one clear answer: here is what to focus on today.
          </p>
          <p className="mt-3">
            No 45-minute planning session. No inbox triage before the real work starts. You open FORGE, get your directive, and execute.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">Work-life integration, not separation</h2>
          <p>
            Remote workers do not have work-life balance — they have work-life integration. The boundaries blur because they have to. Your energy at 9am depends on how you slept. Your afternoon focus depends on whether you moved today. Your financial stress is present at your desk in a way it never was in the office. FORGE tracks all of it in one place, so Oracle can see the full picture and tell you what actually needs attention — not just what is next on your task list.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">Alignment Score: your remote accountability metric</h2>
          <p>
            Without external accountability, self-accountability becomes the only kind that exists — and most remote workers have no system for measuring it honestly. The Alignment Score tracks the gap between your stated intentions and your actual behaviour across all six life domains. It is the honest number you need when no one else is watching. It does not judge. It does not nag. It shows you, weekly, whether you are keeping your word to yourself.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">Local-first for digital privacy</h2>
          <p>
            Remote workers are acutely aware of digital boundaries. FORGE stores all your data locally on your device. No employer has access. No third-party analytics company has your health or financial data. You choose if and when to sync to your personal account — nothing is automatic, nothing is shared without your action. Your personal OS, on your terms.
          </p>
        </div>
      </section>

      <div className="mt-14 p-6 bg-zinc-900 border border-zinc-700 rounded-2xl">
        <p className="text-white font-semibold text-lg mb-2">Build the structure the office never gave you well enough.</p>
        <p className="text-zinc-400 text-sm mb-5">FORGE tracks your health, habits, goals, and finances — then tells you what matters today. Free, no account required.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/setup" className="inline-block bg-orange-500 text-black font-semibold px-6 py-3 rounded-xl hover:bg-orange-400 transition-colors text-center">
            Start Free Now
          </Link>
          <Link href="/pricing" className="inline-block bg-zinc-800 text-white font-semibold px-6 py-3 rounded-xl hover:bg-zinc-700 transition-colors text-center">
            See Pricing
          </Link>
        </div>
      </div>
    </main>
  )
}
