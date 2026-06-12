'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Flame, Sparkles, ChevronRight, Heart, Dumbbell, TrendingUp, Target } from 'lucide-react'
import { setProUser, profileStore } from '@/lib/store'

export default function BetaPage() {
  const router = useRouter()
  const [activated, setActivated] = useState(false)

  useEffect(() => {
    // Activate full Pro access for testers
    setProUser('beta-tester', '2099-12-31')
    setActivated(true)
  }, [])

  function enter() {
    const profile = profileStore.get()
    router.push(profile?.setupComplete ? '/' : '/setup')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <Flame className="w-7 h-7 text-primary-foreground" />
          </div>
          <span className="text-3xl font-bold tracking-tight">FORGE</span>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Beta Tester — Full Access Activated
        </div>

        <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
          You&apos;re in.
        </h1>
        <p className="text-zinc-400 leading-relaxed mb-8">
          FORGE is a personal life OS — one system for health, fitness, wealth, and goals,
          connected by AI that finds the patterns between them.
        </p>

        {/* Module grid */}
        <div className="grid grid-cols-2 gap-3 mb-8 text-left">
          {[
            { icon: Heart, label: 'Health', desc: 'HRV, sleep, energy', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
            { icon: Dumbbell, label: 'Fitness', desc: 'Workouts, body, recovery', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
            { icon: TrendingUp, label: 'Wealth', desc: 'Budget, savings, goals', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
            { icon: Target, label: 'Mind', desc: 'Habits, goals, clarity', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
          ].map(({ icon: Icon, label, desc, color, bg }) => (
            <div key={label} className={`p-4 rounded-xl border ${bg}`}>
              <Icon className={`w-5 h-5 mb-2 ${color}`} />
              <p className={`font-semibold text-sm ${color}`}>{label}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={enter}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 rounded-xl transition-colors text-base shadow-lg shadow-primary/20"
        >
          {activated ? 'Enter FORGE' : 'Activating…'}
          <ChevronRight className="w-5 h-5" />
        </button>

        <p className="text-zinc-600 text-xs mt-6">
          Free forever for beta testers. No credit card required.
          Your feedback shapes the product.
        </p>
      </div>
    </div>
  )
}
