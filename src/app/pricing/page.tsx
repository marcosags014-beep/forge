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
  'Task & goal management',
  'Basic finance tracking',
  '30-day data history',
]

const PRO_FEATURES = [
  'Everything in Free',
  'Oracle AI — full life coach access',
  'Cross-domain insight engine',
  'Weekly AI performance review',
  'Crisis detection & mental health alerts',
  'Life Score with trend analysis',
  'Unlimited data history',
  'Export your data anytime',
  'Priority support',
]

const TESTIMONIALS = [
  { name: 'Alex M.', role: 'Entrepreneur', text: '"Realised my worst business weeks coincide with my lowest HRV. Oracle helped me restructure my schedule around recovery. Revenue up 40%."' },
  { name: 'Sarah K.', role: 'Athlete', text: '"I was overtraining without knowing it. FORGE\'s readiness score stopped me from a serious injury. Nothing else does this."' },
  { name: 'Carlos R.', role: 'Medical student', text: '"Saved €800 in one month by seeing exactly where my stress spending was going. The finance + mood correlation blew my mind."' },
]

export default function PricingPage() {
  const [checkingOut, setCheckingOut] = useState(false)

  async function startCheckout() {
    setCheckingOut(true)
    try {
      const referral = typeof window !== 'undefined' ? getReferralCode() : ''
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referral }),
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
          The all-in-one Life OS — no other app does this
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          One app for<br />
          <span className="text-primary">every domain of your life.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Health, fitness, finance, and goals — unified by AI that sees the connections between them. Stop managing 5 apps. Start building one life.
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
        <p className="text-xs text-muted-foreground mt-4">Free forever tier available. Pro from €14.99/month.</p>
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
            <span className="text-primary font-bold text-lg">FORGE: from free</span>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 md:px-16 py-20 max-w-4xl mx-auto" id="pricing">
        <h2 className="text-3xl font-bold text-center mb-4">Simple, honest pricing.</h2>
        <p className="text-muted-foreground text-center mb-12">No hidden fees. No data selling. Cancel anytime.</p>

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
              <div className="text-3xl font-bold text-primary">
                €14.99<span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">or €99/yr (save 45%)</div>
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
            <p className="text-xs text-center text-muted-foreground">No charge for 7 days. Cancel anytime.</p>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Team & enterprise plans available. <a href="mailto:forge@yourapp.com" className="text-primary hover:underline">Contact us.</a>
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
            { icon: Heart, title: 'Built for real people', desc: 'Not an athlete app. Not a finance bro app. Built for anyone who takes their life seriously.' },
            { icon: Sparkles, title: 'AI that actually knows you', desc: 'Oracle sees all your domains simultaneously. Not generic chatbot advice — specific to your numbers.' },
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
        <h2 className="text-3xl font-bold mb-4">Start building your life today.</h2>
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
