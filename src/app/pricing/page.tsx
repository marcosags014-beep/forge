'use client'

import { useState } from 'react'
import {
  Flame, CheckCircle2, Sparkles, ArrowRight, Shield, Zap, Loader2,
  ChevronDown, Lock, RefreshCw, Download, Clock, Brain,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getReferralCode } from '@/lib/store'
import { track } from '@vercel/analytics'

/* ─── Feature lists ──────────────────────────────────────────── */
const FREE_FEATURES = [
  'All 4 tracking domains (Health, Body, Wealth, Mind)',
  'Habit tracker + Alignment Score',
  'Goals & commitments with timestamps',
  '10 Oracle AI queries per day',
  'Insights engine — auto-detects patterns',
  'Weekly Review dashboard',
  'Daily Quote + journaling',
  'Local-first — data never leaves your device',
]

const PRO_FEATURES = [
  { text: 'Everything in Free', highlight: false },
  { text: 'Unlimited Oracle AI — no daily cap', highlight: true },
  { text: 'Daily Morning Brief — Oracle tells you what matters before you start', highlight: true },
  { text: 'AI Weekly Review — full picture of your week in 2 minutes', highlight: false },
  { text: 'Cross-domain intelligence (sleep → spending → performance, connected)', highlight: true },
  { text: 'Identity anchoring — every recommendation tied to your goals', highlight: false },
  { text: 'Unlimited data history', highlight: false },
  { text: 'Export your data anytime (CSV + JSON)', highlight: false },
  { text: 'Priority support', highlight: false },
]

/* ─── FAQ ─────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: 'Where is my data stored?',
    a: 'Entirely on your device, in your browser\'s local storage. We have zero access to your health, financial, or personal data. Nothing is sent to any server — except the text you explicitly send to Oracle for analysis, which is processed by Anthropic\'s Claude API and never stored.',
  },
  {
    q: 'What happens if I clear my browser or switch devices?',
    a: 'Your data lives in your browser. Clearing site data or switching devices will clear it. We recommend using the Export feature (Pro) to back up regularly. A cloud-sync option with end-to-end encryption is on our roadmap.',
  },
  {
    q: 'How does the 7-day free trial work?',
    a: 'You get full Pro access for 7 days with no charge. If you cancel before day 7, you pay nothing. After 7 days, you\'re billed at the plan you selected. Cancel anytime from the billing portal — no questions asked.',
  },
  {
    q: 'Can I use FORGE without a subscription forever?',
    a: 'Yes. The Free tier is genuinely free, permanently. You get full tracking across all 4 domains, 10 Oracle queries per day, and all core features. Pro adds unlimited AI and automated analysis.',
  },
  {
    q: 'How is FORGE different from Habitica, Streaks, or Notion?',
    a: 'Most habit apps measure whether you logged. FORGE measures whether you kept your word. The Alignment Score tracks the gap between commitments made and commitments kept — not streaks. Add cross-domain AI that connects your sleep data to your spending patterns, and it\'s a fundamentally different category.',
  },
  {
    q: 'Is there a team or family plan?',
    a: 'Not yet. Team accounts (coaches + clients, couples, accountability partners) are in active development. Email us at support@forge-life.app and we\'ll add you to the early access list.',
  },
]

/* ─── How it works ────────────────────────────────────────────── */
const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Log in 60 seconds',
    desc: 'Sleep, HRV, energy, mood — the things that actually drive your day. Quick-log from anywhere in the app. No friction.',
    color: 'text-green-400',
  },
  {
    step: '02',
    title: 'Oracle connects the dots',
    desc: 'Your HRV dropped 18% while training load peaked. Your spending spiked. These aren\'t separate events. Oracle sees the pattern and tells you what it means.',
    color: 'text-primary',
  },
  {
    step: '03',
    title: 'One clear priority. You execute.',
    desc: 'No 45-minute morning planning session. Oracle gives you one thing to focus on — based on your actual data, not a generic algorithm.',
    color: 'text-purple-400',
  },
]

/* ─── Scenarios (replacing fake testimonials) ─────────────────── */
const SCENARIOS = [
  {
    who: 'You\'re training hard and wondering why you\'re not recovering',
    what: 'Oracle sees your HRV averaging 38ms (down 22% from baseline) while training load peaked on Tuesday. It flags the pattern before you burn out.',
    metric: 'Recovery risk identified before the injury',
  },
  {
    who: 'Your bank account is negative two weeks before salary',
    what: 'FORGE shows your spending spiked 40% in the same weeks your sleep score dropped below 60. The problem isn\'t willpower. It\'s sleep.',
    metric: 'Root cause identified, not just the symptom',
  },
  {
    who: 'You\'ve "been working on" a goal for 6 months with nothing to show',
    what: 'Your Alignment Score is 31%. You\'ve created 87 commitments since January. You\'ve kept 27. That number is the honest conversation you\'ve been avoiding.',
    metric: 'The integrity gap, made visible and unmistakable',
  },
]

/* ─── FAQ item ────────────────────────────────────────────────── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-border last:border-0">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-left gap-4 hover:text-primary transition-colors">
        <span className="text-sm font-medium leading-snug">{q}</span>
        <ChevronDown className={`w-4 h-4 flex-shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="pb-4 text-sm text-muted-foreground leading-relaxed">{a}</div>
      )}
    </div>
  )
}

/* ─── Email capture ────────────────────────────────────────────── */
function EmailCapture({ source }: { source: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-primary">
        <CheckCircle2 className="w-4 h-4" />
        <span>You&apos;re on the list. Talk soon.</span>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="flex gap-2 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
      <Button type="submit" disabled={status === 'loading'} className="bg-primary text-primary-foreground px-5">
        {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Join'}
      </Button>
    </form>
  )
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function PricingPage() {
  const [plan, setPlan] = useState<'monthly' | 'annual'>('annual')
  const [checkingOut, setCheckingOut] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 4000)
  }

  async function startCheckout() {
    track('checkout_started', { plan })
    setCheckingOut(true)
    try {
      const referral = typeof window !== 'undefined' ? getReferralCode() : ''
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referral, plan }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        showToast('Checkout unavailable — try again in a moment.')
      }
    } catch {
      showToast('Network error — check your connection and try again.')
    } finally {
      setCheckingOut(false)
    }
  }

  const monthlyDisplay = plan === 'annual' ? '8.25' : '14.99'
  const annualTotal = '99'

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-card border border-border rounded-xl px-5 py-3 text-sm shadow-xl">
          {toastMsg}
        </div>
      )}

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-16 py-5 border-b border-border sticky top-0 bg-background/80 backdrop-blur-xl z-40">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
            <Flame className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">FORGE</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Open App
          </Link>
          <Link href="/setup">
            <Button size="sm" className="bg-primary text-primary-foreground">
              Try Free
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero — tight, specific, no fluff */}
      <section className="px-6 md:px-16 pt-20 pb-16 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs text-primary font-semibold mb-8">
          <Sparkles className="w-3 h-3" />
          Personal Life OS · Health · Body · Wealth · Mind
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-[1.08] tracking-tight">
          Stop deciding.<br />
          <span className="text-primary">Just do.</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-4 leading-relaxed">
          FORGE tracks your health, body, money, and goals — then uses AI to tell you exactly what to focus on today. One answer. Every morning. No planning session required.
        </p>

        <p className="text-sm text-muted-foreground mb-10">
          Free to start · No credit card · All data stays on your device
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/setup" onClick={() => track('cta_clicked', { location: 'hero' })}>
            <Button className="bg-primary text-primary-foreground px-8 py-6 text-base gap-2 shadow-lg shadow-primary/25">
              <Flame className="w-5 h-5" />
              Get Started Free
            </Button>
          </Link>
          <a href="#pricing">
            <Button variant="outline" className="px-8 py-6 text-base gap-2">
              See pricing <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </section>

      {/* Social proof bar — honest metrics */}
      <section className="border-y border-border bg-card/40 py-5">
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 text-center">
          {[
            { value: '50+', label: 'Countries' },
            { value: '60s', label: 'Daily log time' },
            { value: '4 domains', label: 'Connected in one AI' },
            { value: '€0', label: 'To start today' },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="text-xl font-bold text-primary">{value}</span>
              <span className="text-xs text-muted-foreground mt-0.5">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works — replaces wrong "replaces tools" section */}
      <section className="px-6 md:px-16 py-20 max-w-4xl mx-auto">
        <p className="text-center text-xs text-muted-foreground uppercase tracking-widest mb-3">How FORGE works</p>
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          From wake-up to clarity in 90 seconds.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map(({ step, title, desc, color }) => (
            <div key={step} className="relative">
              <div className={`text-5xl font-black tabular-nums opacity-10 mb-3 ${color}`}>{step}</div>
              <h3 className={`text-base font-semibold mb-2 ${color}`}>{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Oracle Demo — show don't tell */}
      <section className="px-6 md:px-16 pb-20 max-w-3xl mx-auto">
        <p className="text-center text-xs text-muted-foreground uppercase tracking-widest mb-3">What Oracle actually says</p>
        <h2 className="text-2xl font-bold text-center mb-10">
          Not generic advice. Your data, interpreted.
        </h2>

        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {/* Sample data header */}
          <div className="px-5 py-4 border-b border-border bg-secondary/30">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2 font-semibold">Example snapshot — Sunday morning</p>
            <div className="flex flex-wrap gap-4 text-xs">
              {[
                { label: 'HRV', value: '38ms', note: '−22% vs baseline', color: 'text-red-400' },
                { label: 'Sleep', value: '5.8h', note: '3rd consecutive night', color: 'text-yellow-400' },
                { label: 'Training load', value: 'HIGH', note: 'peaked Tuesday', color: 'text-orange-400' },
                { label: 'Cash flow', value: '−€340', note: 'this week', color: 'text-red-400' },
                { label: 'Habits done', value: '2/5', note: 'today', color: 'text-muted-foreground' },
              ].map(({ label, value, note, color }) => (
                <div key={label} className="flex flex-col">
                  <span className="text-muted-foreground">{label}</span>
                  <span className={`font-semibold ${color}`}>{value}</span>
                  <span className="text-[10px] text-muted-foreground">{note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Oracle response */}
          <div className="px-5 py-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-primary/15 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Oracle · Morning Brief</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed mb-3">
              Your HRV has been below 42ms for three consecutive days while your training load peaked Tuesday — this is the pattern that precedes overtraining injuries. The €340 cash outflow this week follows the same sleep-deficit weeks where your spending typically spikes 38%.
            </p>
            <p className="text-sm font-semibold text-foreground mb-1">Today&apos;s single priority:</p>
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-primary/8 border border-primary/20">
              <span className="text-primary text-base leading-none mt-0.5">→</span>
              <p className="text-sm text-foreground leading-relaxed">
                <strong>Recovery session only.</strong> No new training. No financial decisions. Sleep before midnight. Your nervous system is in deficit — protect it and the spending pattern corrects automatically within 48h.
              </p>
            </div>
          </div>

          <div className="px-5 py-3 border-t border-border bg-secondary/20">
            <p className="text-[10px] text-muted-foreground italic">This is a realistic example. Your Oracle brief is generated from your actual logged data every morning.</p>
          </div>
        </div>
      </section>

      {/* The Alignment Score — the real differentiator */}
      <section className="px-6 md:px-16 py-16 bg-card/30 border-y border-border">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs text-primary uppercase tracking-widest font-semibold mb-3">The metric no other app tracks</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Your Alignment Score.<br />
            <span className="text-muted-foreground font-normal">How often you actually keep your word to yourself.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Every task you create is a commitment with a timestamp. Every day it stays incomplete is a registered breach.
            Most people who calculate this for the first time are below 40%. Not because they're lazy — because no system was counting.
          </p>
          <div className="grid grid-cols-3 gap-4 text-center max-w-xl mx-auto">
            {[
              { label: 'Habit Rate', desc: 'Daily habits completed', weight: '60%' },
              { label: 'Kept Rate', desc: 'Tasks closed on time', weight: '40%' },
              { label: 'Life Score', desc: 'Multiplied by alignment', weight: '×0.2' },
            ].map(({ label, desc, weight }) => (
              <div key={label} className="forge-card text-left">
                <div className="text-primary font-bold text-lg mb-0.5">{weight}</div>
                <div className="text-sm font-medium">{label}</div>
                <div className="text-[11px] text-muted-foreground mt-1">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scenarios — replacing fake testimonials */}
      <section className="px-6 md:px-16 py-20 max-w-4xl mx-auto">
        <p className="text-center text-xs text-muted-foreground uppercase tracking-widest mb-3">What FORGE surfaces</p>
        <h2 className="text-2xl font-bold text-center mb-12">
          Insights your separate apps could never show you.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SCENARIOS.map(({ who, what, metric }) => (
            <div key={metric} className="forge-card flex flex-col gap-4">
              <p className="text-xs text-primary font-semibold uppercase tracking-wide leading-relaxed">{who}</p>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{what}</p>
              <div className="pt-3 border-t border-border">
                <p className="text-xs font-semibold text-foreground">{metric}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 md:px-16 py-20 max-w-4xl mx-auto" id="pricing">
        <h2 className="text-3xl font-bold text-center mb-2">Simple pricing.</h2>
        <p className="text-muted-foreground text-center mb-10">
          Start free. Upgrade when FORGE earns it.
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-center mb-10">
          <div className="forge-tabs">
            <button onClick={() => setPlan('monthly')} className={`forge-tab ${plan === 'monthly' ? 'forge-tab-active' : ''}`}>
              Monthly
            </button>
            <button onClick={() => setPlan('annual')} className={`forge-tab ${plan === 'annual' ? 'forge-tab-active' : ''}`}>
              Annual
              <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded-full">−45%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

          {/* Free */}
          <div className="forge-card flex flex-col gap-5 p-7">
            <div>
              <div className="text-base font-semibold text-muted-foreground mb-1">Free</div>
              <div className="text-4xl font-bold">€0</div>
              <div className="text-sm text-muted-foreground mt-1">Forever. No credit card ever required.</div>
            </div>
            <ul className="space-y-2.5 flex-1">
              {FREE_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/setup" className="block" onClick={() => track('cta_clicked', { location: 'pricing_free' })}>
              <Button variant="outline" className="w-full">Start Free — No Card</Button>
            </Link>
          </div>

          {/* Pro */}
          <div className="relative forge-card flex flex-col gap-5 p-7 border-primary/30 bg-gradient-to-b from-primary/5 to-transparent">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-primary/30">
                <Sparkles className="w-3 h-3" />
                Recommended
              </div>
            </div>

            <div>
              <div className="text-base font-semibold text-muted-foreground mb-1">Pro</div>
              <div className="flex items-end gap-2">
                <div className="text-4xl font-bold text-primary">€{monthlyDisplay}</div>
                <div className="text-sm text-muted-foreground mb-1.5">/month</div>
                {plan === 'annual' && (
                  <div className="text-sm text-muted-foreground mb-1.5 line-through">€14.99</div>
                )}
              </div>
              {plan === 'annual' ? (
                <div className="text-sm text-green-400 font-medium mt-1">€{annualTotal}/year — save €81</div>
              ) : (
                <div className="text-sm text-muted-foreground mt-1">
                  Save €81/year by switching to annual →
                </div>
              )}
            </div>

            <ul className="space-y-2.5 flex-1">
              {PRO_FEATURES.map(({ text, highlight }) => (
                <li key={text} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${highlight ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={highlight ? 'text-foreground font-medium' : 'text-muted-foreground'}>{text}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-3">
              <Button onClick={startCheckout} disabled={checkingOut}
                className="w-full bg-primary text-primary-foreground gap-2 py-6 text-base shadow-xl shadow-primary/20">
                {checkingOut
                  ? <><Loader2 className="w-4 h-4 animate-spin" />Redirecting…</>
                  : <><Zap className="w-4 h-4" />Start 7-Day Free Trial</>
                }
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                No charge for 7 days. Cancel in 10 seconds from billing portal.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Team & coach accounts coming soon.{' '}
          <a href="mailto:support@forge-life.app" className="text-primary hover:underline">
            Join the waitlist.
          </a>
        </p>
      </section>

      {/* Trust architecture — specific and verifiable */}
      <section className="px-6 md:px-16 py-16 bg-card/30 border-y border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-10">How your data is protected.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: Lock,
                title: 'Zero server storage',
                desc: 'Your health, financial, and personal data is stored exclusively in your browser\'s localStorage. We have no database of user data. We cannot access, sell, or lose your data — because we never have it.',
              },
              {
                icon: Shield,
                title: 'Oracle AI — what gets sent',
                desc: 'When you ask Oracle a question, the text of your query and your anonymised data snapshot are sent to Anthropic\'s API for processing. Anthropic does not store these beyond the API request. Your name is never included.',
              },
              {
                icon: Download,
                title: 'Export everything, anytime',
                desc: 'Pro users can export their full data as CSV and JSON at any time. Free users can export via the Settings page. Your data is always yours — no lock-in.',
              },
              {
                icon: RefreshCw,
                title: 'Browser limitation: back up regularly',
                desc: 'Because data lives in your browser, clearing site data or switching devices will clear it. We recommend weekly exports as backup. Cloud sync with end-to-end encryption is on our roadmap.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="forge-card flex gap-4">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">{title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-domain intelligence — visual */}
      <section className="px-6 md:px-16 py-20 max-w-3xl mx-auto text-center">
        <p className="text-xs text-primary uppercase tracking-widest font-semibold mb-3">The core insight</p>
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Your domains aren't independent.<br />
          <span className="text-muted-foreground font-normal">Most apps don't know that.</span>
        </h2>
        <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto text-left mb-8">
          {[
            { from: 'Low HRV', to: 'Spending spikes 24-48h later', icon: '→' },
            { from: 'Sleep debt accumulating', to: 'Workout output drops by day 3', icon: '→' },
            { from: 'Training consistency high', to: 'Goal adherence improves same week', icon: '→' },
            { from: 'Savings rate increasing', to: 'Habit completion rises (identity shift)', icon: '→' },
          ].map(({ from, to }) => (
            <div key={from} className="forge-card text-xs space-y-1">
              <div className="text-muted-foreground">{from}</div>
              <div className="text-primary font-medium leading-snug">{to}</div>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Oracle sees all four domains at once. It names these patterns with your actual numbers — not generic advice.
        </p>
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-16 py-16 bg-card/30 border-y border-border">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Common questions.</h2>
          <div>
            {FAQS.map(faq => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 md:px-16 py-24 text-center">
        <div className="max-w-xl mx-auto">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/30">
            <Brain className="w-6 h-6 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            What would your Alignment Score be?
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Most people who calculate it for the first time are below 40%. The number isn't a judgement — it's a starting point. Takes 90 seconds to set up.
          </p>
          <Link href="/setup">
            <Button className="bg-primary text-primary-foreground px-10 py-6 text-base gap-2 shadow-xl shadow-primary/25">
              <Flame className="w-5 h-5" />
              Start Free — No Credit Card
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-4">
            Free forever tier available. Pro from €8.25/month billed annually.
          </p>
        </div>
      </section>

      {/* Email capture — for visitors not ready to commit */}
      <section className="px-6 md:px-16 py-16 border-t border-border bg-card/20">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-xs text-primary uppercase tracking-widest font-semibold mb-3">Not ready to start yet?</p>
          <h2 className="text-xl font-bold mb-2">Get the FORGE weekly brief.</h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            One email per week. Performance frameworks, cross-domain insights, and system updates. No spam. Unsubscribe anytime.
          </p>
          <EmailCapture source="pricing-footer" />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-16 py-10 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <Flame className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-bold text-sm">FORGE</span>
                <span className="text-xs text-muted-foreground ml-2">Life OS</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-5 text-xs text-muted-foreground">
              <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
              <Link href="/setup" className="hover:text-foreground transition-colors">Get Started</Link>
              <Link href="/" className="hover:text-foreground transition-colors">Open App</Link>
              <a href="mailto:support@forge-life.app" className="hover:text-foreground transition-colors">Support</a>
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">© 2026 FORGE. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">
              Local-first · No account required · GDPR compliant
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
