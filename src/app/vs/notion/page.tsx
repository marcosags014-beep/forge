import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FORGE vs Notion for Life Tracking — Which Is Actually Better? | FORGE',
  description: "Notion is flexible. FORGE is focused. If you've tried building a life OS in Notion and abandoned it, here's why the comparison matters — and what you should use instead.",
  alternates: { canonical: 'https://forge-five-flax.vercel.app/vs/notion' },
  openGraph: {
    title: 'FORGE vs Notion for Life Tracking — Which Is Actually Better?',
    description: 'Notion gives you infinite canvas. FORGE gives you a daily answer. Very different products.',
    type: 'article',
  },
}

const rows = [
  { feature: 'Setup time', notion: 'Days to weeks (template required)', forge: 'Under 3 minutes' },
  { feature: 'AI intelligence', notion: 'Notion AI (text generation only)', forge: 'Oracle AI with your actual data' },
  { feature: 'Health tracking', notion: 'Manual database, no scoring', forge: 'HRV, sleep, energy — scored daily' },
  { feature: 'Finance tracking', notion: 'Manual, no insights', forge: 'Transactions, savings rate, projections' },
  { feature: 'Habit tracking', notion: 'Checkbox database, no patterns', forge: 'Consistency rate, streaks, Alignment Score' },
  { feature: 'Cross-domain insights', notion: 'Not possible (siloed databases)', forge: 'Oracle reads all 6 domains simultaneously' },
  { feature: 'Daily directive', notion: 'You decide what to look at', forge: 'Oracle tells you what matters today' },
  { feature: 'Mobile PWA', notion: 'App available, heavy', forge: 'Lightweight PWA, installable, offline-ready' },
  { feature: 'Data privacy', notion: 'Cloud-only, Notion servers', forge: 'Local-first, device storage by default' },
  { feature: 'Price', notion: 'Free (limited) / $8–$16/month', forge: 'Free / €9.99/month Pro' },
]

export default function ForgeVsNotion() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12 text-zinc-300">
      <header className="mb-10">
        <p className="text-sm text-orange-400 font-medium mb-3">Comparison</p>
        <h1 className="text-3xl font-bold text-white leading-tight mb-4">
          FORGE vs Notion for Life Tracking
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed">
          Notion is one of the most popular tools for building a personal life OS. It is also one of the most commonly abandoned. Here is why — and what FORGE does differently.
        </p>
      </header>

      <section className="space-y-6 leading-relaxed">
        <h2 className="text-xl font-semibold text-white">The Notion Life OS trap</h2>
        <p>
          Every year, thousands of people build elaborate Notion life dashboards. They spend days setting up templates, linking databases, creating habit trackers, finance pages, and goal systems. The dashboard looks exactly right. Within three to six weeks, most of them have stopped updating it.
        </p>
        <p>
          This is not a discipline problem. It is a product design problem. Notion is a tool for organising information. It is excellent at that. But a life OS needs to do something different: it needs to reduce the cognitive load of deciding what to focus on, not add to it. A blank Notion page every morning is still a blank page. There is no intelligence layer that reads your data and tells you what matters today.
        </p>

        <h2 className="text-xl font-semibold text-white">What Notion does well</h2>
        <p>
          Notion excels at knowledge management, project planning, note-taking, and flexible information architecture. If you are a freelancer managing clients, a student organising research, or a team running a small business, Notion is exceptional. It is the right tool for those jobs.
        </p>
        <p>
          For personal life tracking — health, habits, finance, goals — it is a workable but suboptimal choice. The flexibility that makes it powerful for complex knowledge work becomes friction when you just need to log yesterday&apos;s HRV and get a clear directive for today.
        </p>

        <h2 className="text-xl font-semibold text-white">What FORGE does differently</h2>
        <p>
          FORGE is purpose-built for one job: connect your health, habits, finances, and goals, and tell you what to focus on each day based on the actual patterns in your data. It is opinionated where Notion is flexible. It surfaces cross-domain insights that are impossible in siloed databases. And it ships with an AI intelligence layer — Oracle — that reads all six life domains simultaneously and produces specific, contextual guidance.
        </p>
        <p>
          You cannot build that in Notion. Not because Notion is limited, but because that is not what Notion is.
        </p>

        {/* Comparison table */}
        <h2 className="text-xl font-semibold text-white mt-8">Feature comparison</h2>
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-4 py-3 text-zinc-400 font-medium w-1/3">Feature</th>
                <th className="text-left px-4 py-3 text-zinc-400 font-medium w-1/3">Notion</th>
                <th className="text-left px-4 py-3 text-orange-400 font-medium w-1/3">FORGE</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={`border-b border-zinc-800/50 ${i % 2 === 0 ? 'bg-zinc-900/30' : ''}`}>
                  <td className="px-4 py-3 text-zinc-300 font-medium">{row.feature}</td>
                  <td className="px-4 py-3 text-zinc-400">{row.notion}</td>
                  <td className="px-4 py-3 text-zinc-200">{row.forge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-semibold text-white">When to choose Notion</h2>
        <p>
          Choose Notion if your primary need is knowledge management, project organisation, or a flexible workspace for complex information. If you want to build your own system from scratch and enjoy the design process, Notion is the right choice.
        </p>

        <h2 className="text-xl font-semibold text-white">When to choose FORGE</h2>
        <p>
          Choose FORGE if you want a system that tells you what to focus on today, measures your consistency, connects your health and habits to your goals, and gets smarter the more data you put in. If you have already tried Notion life OS templates and stopped using them, FORGE is the alternative designed for that exact failure mode.
        </p>
        <p>
          FORGE is free with no account required. Notion&apos;s free tier has limited collaboration features. For personal use, both are effectively free — the difference is in what they are designed to do.
        </p>
      </section>

      <div className="mt-12 p-6 bg-zinc-900 border border-zinc-700 rounded-2xl text-center">
        <p className="text-white font-semibold text-lg mb-2">Stop building systems. Start executing.</p>
        <p className="text-zinc-400 text-sm mb-4">FORGE is ready in 3 minutes. No template required. Free — no account needed.</p>
        <Link href="/setup" className="inline-block bg-orange-500 text-black font-semibold px-6 py-3 rounded-xl hover:bg-orange-400 transition-colors">
          Start Free — No Account Required
        </Link>
      </div>
    </main>
  )
}
