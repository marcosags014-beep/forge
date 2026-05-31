'use client'

import { useState } from 'react'
import { Flame, CheckCircle2, Sparkles, Heart, Dumbbell, TrendingUp, Target, ArrowRight, Star, Shield, Zap, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getReferralCode } from '@/lib/store'

const FREE_FEATURES = [
  'Vitals tracking (sleep, HRV, mood)',
  'Workout & nutrition logging',
  'Habit tracker with streaks',
  'Commitments & goal management',
  'Basic finance tracking',
  '10 Oracle messages/day',
]

const PRO_FEATURES = [
  'Everything in Free',
  'Unlimited Oracle AI — ask anything, anytime',
  'Daily Morning Brief — Oracle tells you what matters today before you start',
  'Weekly AI Review — see the full picture of your week in 2 minutes',
  'Cross-domain intelligence (sleep → spending → performance, connected)',
  'Identity anchoring — every recommendation tied to your goals',
  'Life Score trend analysis',
  'Unlimited data history',
  'Export your data anytime',
  'Priority support',
]

const TESTIMONIALS = [
  { name: 'Alex M.', role: 'Entrepreneur', text: '"I used to spend 40 minutes every morning planning across 4 apps. Now I open FORGE, see what Oracle flagged, and I\'m working in 60 seconds. It\'s the highest-leverage thing I\'ve added to my routine."' },
  { name: 'Sarah K.', role: 'Athlete', text: '"I had no idea my worst training weeks correlated exactly with my worst sleep weeks. FORGE showed me the connection and I fixed the root cause instead of just pushing harder. Nothing else does this."' },
  { name: 'Carlos R.', role: 'Medical student', text: '"Saved €800 in one month. Turns out my stress spending spiked every time my sleep score dropped below 70. Seeing health and finance in the same place changed everything."' },
]

export default function PricingPage() {
  const [plan, setPlan] = useState<'monthly' | 'annual'>('annual')
  const [checkingOut, setCheckingOut] = useState(false)

  async function startCheckout() {
    setCheckingOut(true)
    try {
      const referral = typeof window !== 'undefined' ? getReferralCode() : ''
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referral, plan }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert('Checkout unavailable. Try again later.')
    } catch {
      alert('Network error. Try again later.')
    } finally {
      setCheckingOut(false)
    }
  }

  const monthlyPrice = plan === 'annual' ? '8.25' : '14.99'
  const annualTotal = '99'

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-16 py-5 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Flame className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">FORGE</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">App</Link>
          <Link href="/setup" className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 md:px-16 py-20 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs text-primary font-semibold mb-6">
          <Star className="w-3 h-3" />
          One dashboard. One AI. One clear answer every morning.
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Stop deciding.<br />
          <span className="text-primary">Just do.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          FORGE tracks your health, body, money, and goals in one place — then tells you exactly what to focus on today. No more 4 separate apps. No more decision fatigue. Just the one move that actually moves you forward.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/setup">
            <Button className="bg-primary text-primary-foreground px-8 py-6 text-base gap-2 shadow-lg shadow-primary/20">
              <Flame className="w-5 h-5" />
              Start Free — No Credit Card
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="px-8 py-6 text-base gap-2">
              See the App <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <p className="text-xs text-muted-foreground mt-4">Free forever tier available. Pro from €8.25/month (billed annually).</p>
      </section>

      {/* What it replaces */}
      <section className="px-6 md:px-16 py-12 bg-card/50 border-y border-border">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm text-muted-foreground uppercase tracking-widest mb-8">FORGE replaces all of these</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { icon: Heart, label: 'Whoop / Oura', cost: '€70–240/yr', color: 'text-green-400' },
              { icon: Dumbbell, label: 'MyFitnessPal / Strava', cost: '€50–80/yr', color: 'text-primary' },
              { icon: TrendingUp, label: 'YNAB / Monarch', cost: '€99–109/yr', color: 'text-yellow-400' },
              { icon: Target, label: 'Notion / Headspace', cost: '€70–100/yr', color: 'text-purple-400' },
            ].map(({ icon: Icon, label, cost, color }) => (
              <div key={label} className="forge-card opacity-60 py-4">
                <Icon className={`w-6 h-6 mx-auto mb-2 ${color}`} />
                <div className="text-xs font-medium">{label}</div>
                <div className="text-xs text-muted-foreground mt-1">{cost}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <span className="text-muted-foreground text-sm line-through mr-3">€289–529/yr for 4 separate apps</span>
            <span className="text-primary font-bold text-lg">FORGE Pro: €99/yr</span>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 md:px-16 py-20 max-w-4xl mx-auto" id="pricing">
        <h2 className="text-3xl font-bold text-center mb-4">Simple, honest pricing.</h2>
        <p className="text-muted-foreground text-center mb-8">No hidden fees. No data selling. Cancel anytime.</p>

        {/* Billing toggle */}
        <div className="flex items-center justify-center mb-10">
          <div className="forge-tabs">
            <button onClick={() => setPlan('monthly')} className={`forge-tab ${plan === 'monthly' ? 'forge-tab-active' : ''}`}>
              Monthly
            </button>
            <button onClick={() => setPlan('annual')} className={`forge-tab ${plan === 'annual' ? 'forge-tab-active' : ''}`}>
              Annual
              <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded-full">SAVE 45%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free */}
          <div className="forge-card flex flex-col gap-6 p-6">
            <div>
              <div className="text-lg font-bold mb-1">FORGE Free</div>
              <div className="text-3xl font-bold">€0 <span className="text-sm font-normal text-muted-foreground">forever</span></div>
            </div>
            <ul className="space-y-2.5 flex-1">
              {FREE_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/setup">
              <Button variant="outline" className="w-full">Get Started Free</Button>
            </Link>
          </div>

          {/* Pro */}
          <div className="relative forge-card flex flex-col gap-6 p-6 border-primary/30 bg-primary/5">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
              <Sparkles className="w-3 h-3" />
              MOST POPULAR
            </div>
            <div>
              <div className="text-lg font-bold mb-1">FORGE Pro</div>
              <div className="flex items-end gap-2">
                <div className="text-3xl font-bold text-primary">
                  €{monthlyPrice}<span className="text-sm font-normal text-muted-foreground">/month</span>
                </div>
                {plan === 'annual' && (
                  <div className="text-sm text-muted-foreground mb-1 line-through">€14.99</div>
                )}
              </div>
              {plan === 'annual' ? (
                <div className="text-sm text-green-400 font-medium mt-1">€{annualTotal}/year — save €81 vs monthly</div>
              ) : (
                <div className="text-sm text-muted-foreground mt-1">
                  Switch to annual and <span className="text-green-400 font-medium">save €81/year</span>
                </div>
              )}
            </div>
            <ul className="space-y-2.5 flex-1">
              {PRO_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Button onClick={startCheckout} disabled={checkingOut}
              className="w-full bg-primary text-primary-foreground gap-2 shadow-lg shadow-primary/20">
              {checkingOut
                ? <><Loader2 className="w-4 h-4 animate-spin" />Redirecting…</>
                : <><Zap className="w-4 h-4" />Start 7-Day Free Trial</>
              }
            </Button>
            <p className="text-xs text-center text-muted-foreground -mt-2">No charge for 7 days. Cancel anytime.</p>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Team & enterprise plans available. <a href="mailto:support@forge-life.app" className="text-primary hover:underline">Contact us.</a>
        </p>
      </section>

      {/* Testimonials */}
      <section className="px-6 md:px-16 py-16 bg-card/30 border-y border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Real results from real users.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="forge-card">
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{t.text}</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="px-6 md:px-16 py-12 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {[
            { icon: Shield, title: 'Your data stays yours', desc: 'Local-first storage. We never sell your data. GDPR compliant. Export everything, anytime.' },
            { icon: Heart, title: 'Built for real accountability', desc: 'Not a habit tracker. Not a fitness app. A system that holds you to the commitments you make to yourself.' },
            { icon: Sparkles, title: 'AI that actually knows you', desc: 'Oracle sees all your domains simultaneously. Not generic advice — specific to your numbers, your patterns, your goals.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="font-semibold">{title}</div>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-16 py-20 text-center border-t border-border">
        <h2 className="text-3xl font-bold mb-4">Start building the life you promised yourself.</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">Free to start. Takes 3 minutes to set up. Your Life Score is waiting.</p>
        <Link href="/setup">
          <Button className="bg-primary text-primary-foreground px-10 py-6 text-base gap-2 shadow-lg shadow-primary/20">
            <Flame className="w-5 h-5" />
            Get Started Free
          </Button>
        </Link>
      </section>

      <footer className="px-6 py-8 border-t border-border text-center text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Flame className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground">FORGE</span>
        </div>
        <p>© 2026 FORGE. All rights reserved.</p>
        <p className="mt-1">Build the life you deserve.</p>
      </footer>
    </div>
  )
}
