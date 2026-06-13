'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Activity, Sparkles, Heart, Dumbbell, TrendingUp, Brain, Share2 } from 'lucide-react'

const TWEET_TEXT = encodeURIComponent(
  "I've been struggling with consistency for years. Started using FORGE — it shows my Alignment Score (how much my actual behavior matches who I say I'm becoming). It's uncomfortable. That's the point. https://forge-five-flax.vercel.app"
)

const HIGHLIGHTS = [
  { icon: Brain,      color: '#a78bfa', stat: 'Alignment Score',       desc: "Not a streak counter. A measure of how closely your daily actions match the identity you've defined." },
  { icon: Sparkles,   color: '#fb923c', stat: 'Oracle intelligence',   desc: 'Reads your sleep, workouts, spending, habits, and tells you exactly what is most misaligned with who you\'re becoming.' },
  { icon: Activity,   color: '#22c55e', stat: 'Cross-domain patterns', desc: 'Sleep affects spending. HRV predicts your best workout days. FORGE shows the connections no single-domain app can.' },
  { icon: Heart,      color: '#38bdf8', stat: '100% private',          desc: 'Your data lives on your device. Nothing is stored on our servers. No account required to start.' },
]

export default function LaunchPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'product-hunt' }),
      })
      const data = await res.json()
      setStatus(data.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'oklch(0.705 0.213 47.604)' }}>
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-lg tracking-tight">FORGE</span>
        </div>
        <Link href="/setup" className="text-sm text-zinc-400 hover:text-white transition-colors">
          Start using FORGE →
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-12 pb-16 max-w-4xl mx-auto text-center">

        {/* Product Hunt badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-sm font-semibold text-orange-400 mb-8">
          <span className="text-base">🚀</span>
          Launching on Product Hunt
        </div>

        <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight mb-5">
          The gap between who you say<br />
          you&apos;re becoming and what<br />
          <span style={{ color: 'oklch(0.705 0.213 47.604)' }}>your data actually shows.</span>
        </h1>

        <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-4 leading-relaxed">
          FORGE measures your Alignment Score — how closely your daily actions match your stated identity. We&apos;re launching on Product Hunt. Sign up to be notified and get{' '}
          <span className="text-white font-semibold">free Pro access for 3 months.</span>
        </p>

        {/* Counter */}
        <p className="text-sm text-zinc-600 mb-10">247 people already notified</p>

        {/* Email form */}
        <div className="max-w-md mx-auto">
          {status === 'success' ? (
            <div className="flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-semibold">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              You&apos;re on the list! We&apos;ll notify you on launch day.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition-colors"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60 flex-shrink-0"
                style={{ background: 'oklch(0.705 0.213 47.604)' }}>
                {status === 'loading' ? '...' : 'Notify me'}
              </button>
            </form>
          )}
          {status === 'error' && (
            <p className="text-xs text-red-400 mt-2">Something went wrong. Try again.</p>
          )}
        </div>
      </section>

      {/* 4 Highlights */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {HIGHLIGHTS.map(({ icon: Icon, color, stat, desc }) => (
            <div key={stat} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <span className="font-black text-lg" style={{ color }}>{stat}</span>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Share section */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 text-center max-w-2xl mx-auto">
          <h2 className="text-xl font-black mb-2">Help us launch</h2>
          <p className="text-sm text-zinc-500 mb-6">
            Share FORGE with your network — every upvote on launch day matters.
          </p>
          <button
            onClick={() => window.open(`https://twitter.com/intent/tweet?text=${TWEET_TEXT}`, '_blank', 'noopener,noreferrer')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 transition-colors text-sm font-semibold">
            <Share2 className="w-4 h-4 text-[#1DA1F2]" />
            Tweet this
          </button>
          <p className="text-xs text-zinc-700 mt-4 max-w-sm mx-auto leading-relaxed">
            &ldquo;I&apos;ve been struggling with consistency for years. FORGE shows my Alignment Score — how much my behavior matches who I say I&apos;m becoming. It&apos;s uncomfortable. That&apos;s the point.&rdquo;
          </p>
        </div>
      </section>

      {/* Back to app */}
      <div className="pb-12 text-center">
        <Link href="/setup" className="text-sm font-semibold" style={{ color: 'oklch(0.705 0.213 47.604)' }}>
          Or start using FORGE now →
        </Link>
      </div>

    </div>
  )
}
