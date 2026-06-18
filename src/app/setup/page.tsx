'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Flame, Sparkles, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { profileStore, habitsStore, goalsStore, generateId, logReferralOnSetupComplete, alignmentHistoryStore } from '@/lib/store'
import { Analytics } from '@/lib/analytics'
import { supabase } from '@/lib/supabase'

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

const IDENTITY_STARTERS = [
  'A high performer who trains 4x/week, sleeps 8h, and spends intentionally',
  'Someone who ships projects instead of planning them',
  'A disciplined athlete who is also financially free',
  'A focused builder who protects deep work time and earns on my own terms',
  'Someone who shows up consistently — in fitness, relationships, and work',
  'A person with elite health habits, financial discipline, and creative output',
]

const OBSTACLE_CHIPS = [
  'Lack of consistency',
  'No clear system',
  'Bad habits I can\'t break',
  'Not enough time',
  'Low motivation',
  'Fear of failure',
  'Don\'t know where to start',
  'Too many distractions',
  'Analysis paralysis',
  'Accountability',
]

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-1.5 mb-10">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-0.5 flex-1 rounded-full transition-all duration-700 ${
            i < step ? 'bg-primary' : 'bg-secondary'
          }`}
        />
      ))}
    </div>
  )
}

interface OracleProfile {
  identityStatement: string
  mainChallenge: string
  firstAction: string
  suggestedHabits: string[]
  oracleIntro: string
}

export default function SetupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const TOTAL = 4

  // Step 1
  const [name, setName] = useState('')
  const [identity, setIdentity] = useState('')

  // Step 2
  const [obstacles, setObstacles] = useState<string[]>([])
  const [customObstacle, setCustomObstacle] = useState('')

  // Step 3
  const [vision, setVision] = useState('')

  // Step 4 — Oracle generation
  const [generating, setGenerating] = useState(false)
  const [profile, setProfile] = useState<OracleProfile | null>(null)
  const [genError, setGenError] = useState(false)
  const [selectedHabits, setSelectedHabits] = useState<string[]>([])

  // Google sign-in (returning user shortcut)
  const [googleLoading, setGoogleLoading] = useState(false)

  useEffect(() => {
    // Redirect existing users away from setup — they already have data
    const existing = profileStore.get()
    if (existing?.setupComplete) {
      router.replace('/')
      return
    }
    Analytics.onboardingStarted()
  }, [])

  function nextStep() {
    Analytics.setupStepCompleted(step)
    setStep(s => s + 1)
  }

  async function generateProfile(visionOverride?: string) {
    setGenerating(true)
    setGenError(false)
    setStep(4)

    const effectiveVision = visionOverride ?? vision
    const allObstacles = [...obstacles, customObstacle].filter(Boolean).join(', ') || 'not specified'

    try {
      const res = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'onboarding',
          message: `New FORGE user onboarding.
Name: ${name || 'not given'}
Who they want to become: "${identity}"
What is stopping them: "${allObstacles}"
What changes in 12 months: "${effectiveVision}"

Return a JSON object with exactly these keys:
- identityStatement: a 1-2 sentence distilled version of who they're becoming (speak to them directly, e.g. "You're becoming...")
- mainChallenge: their primary obstacle in 1 sentence, specific
- firstAction: the single most important thing they should do TODAY, concrete and specific
- suggestedHabits: array of exactly 3 daily habits perfectly matched to their identity vision (short names, e.g. "Morning workout (30 min)")
- oracleIntro: 2 sentence personal welcome from Oracle, direct coach tone, reference their specific vision

Return ONLY the JSON. No markdown, no explanation.`,
        }),
      })

      const data = await res.json()
      const parsed: OracleProfile = JSON.parse(
        data.content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      )
      setProfile(parsed)
      setSelectedHabits(parsed.suggestedHabits)
    } catch {
      setGenError(true)
      setProfile({
        identityStatement: `You're becoming the person you described — someone who shows up, executes, and builds the life they want.`,
        mainChallenge: 'The gap between intention and execution.',
        firstAction: 'Log today\'s energy level in FORGE and commit to one action from your vision.',
        suggestedHabits: ['Daily check-in (2 min)', 'One focused task completed', 'Evening reflection'],
        oracleIntro: `Welcome to FORGE, ${name || 'builder'}. I've noted your vision. Every recommendation I make will be designed to close the gap between where you are and who you want to become.`,
      })
      setSelectedHabits(['Daily check-in (2 min)', 'One focused task completed', 'Evening reflection'])
    } finally {
      setGenerating(false)
    }
  }

  // Persists all setup data to localStorage — called before navigation OR before OAuth redirect.
  // Must be separate from finish() so the Google button can save without triggering router.push.
  function persistSetup() {
    const allObstacles = [...obstacles, customObstacle].filter(Boolean)
    const existing = profileStore.get()
    profileStore.save({
      name: name.trim() || 'You',
      primaryGoal: identity.slice(0, 60) || 'performance',
      identity: identity.trim() || undefined,
      vision: vision.trim() || undefined,
      obstacles: allObstacles.length > 0 ? allObstacles : undefined,
      oracleIdentity: profile?.identityStatement || undefined,
      setupComplete: true,
      joinedAt: existing?.joinedAt ?? new Date().toISOString(),
    })
    selectedHabits.forEach(h =>
      habitsStore.save({ id: generateId(), name: h.trim(), category: 'mind', completions: [] })
    )
    if (vision.trim()) {
      goalsStore.save({
        id: generateId(),
        title: vision.length > 80 ? vision.slice(0, 80) + '…' : vision,
        category: 'personal',
        targetDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
        status: 'active',
        progress: 0,
        milestones: [],
        notes: `12-month vision set during onboarding: "${vision}"`,
      })
    }
    alignmentHistoryStore.record()
    logReferralOnSetupComplete()
    Analytics.onboardingCompleted({ focus: identity.slice(0, 40) })
  }

  function finish() {
    persistSetup()
    router.push('/')
  }

  async function signInWithGoogle() {
    if (!supabase) return
    setGoogleLoading(true)
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { access_type: 'offline', prompt: 'select_account' },
        },
      })
    } catch {
      setGoogleLoading(false)
    }
  }

  function toggleObstacle(o: string) {
    setObstacles(prev =>
      prev.includes(o) ? prev.filter(x => x !== o) : [...prev, o]
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Flame className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold tracking-tight">FORGE</span>
        </div>

        {/* Returning user shortcut — only show on step 1 */}
        {step === 1 && (
          <div className="mb-8 text-center">
            <p className="text-xs text-muted-foreground mb-3">Already have an account?</p>
            <button
              onClick={signInWithGoogle}
              disabled={googleLoading}
              className="inline-flex items-center gap-2.5 bg-white hover:bg-gray-50 text-gray-900 font-semibold text-sm py-2.5 px-5 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
              ) : (
                <GoogleIcon />
              )}
              {googleLoading ? 'Redirecting…' : 'Continue with Google'}
            </button>
            <div className="flex items-center gap-3 mt-6 mb-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[11px] text-muted-foreground uppercase tracking-wider">or start fresh</span>
              <div className="flex-1 h-px bg-border" />
            </div>
          </div>
        )}

        <ProgressBar step={step} total={TOTAL} />

        {/* ── Step 1: Who you want to become ── */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <p className="text-xs text-primary uppercase tracking-widest font-semibold mb-2">Step 1 of 3</p>
            <h2 className="text-2xl font-bold mb-2">Who do you want to become?</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              This is the foundation of everything. Oracle will hold you accountable to this every day.
              Be specific — a vague identity gets vague results.
            </p>

            <div className="space-y-4 mb-8">
              <div className="space-y-1.5">
                <label className="forge-label">Your name (optional)</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="What should Oracle call you?"
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="forge-label">I am becoming…</label>
                {!identity && (
                  <div className="mb-2">
                    <p className="text-xs text-muted-foreground mb-2">Tap an example to get started:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {IDENTITY_STARTERS.map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setIdentity(s)}
                          className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-primary/5 transition-all text-left"
                        >
                          {s.length > 45 ? s.slice(0, 45) + '…' : s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <textarea
                  value={identity}
                  onChange={e => setIdentity(e.target.value)}
                  placeholder="A high-performing athlete who is financially free, sleeps 8 hours, and shows up for what matters every single day."
                  rows={4}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none leading-relaxed"
                />
                <p className="text-xs text-muted-foreground">Write it in present tense as if you&apos;re already there.</p>
              </div>
            </div>

            <Button
              onClick={nextStep}
              disabled={!identity.trim()}
              className="w-full bg-primary text-primary-foreground py-6 text-base gap-2 shadow-lg shadow-primary/20 disabled:opacity-40"
            >
              This is who I&apos;m becoming <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* ── Step 2: What's stopping you ── */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <p className="text-xs text-primary uppercase tracking-widest font-semibold mb-2">Step 2 of 3</p>
            <h2 className="text-2xl font-bold mb-2">What is stopping you?</h2>
            <p className="text-muted-foreground mb-8">
              Naming your obstacles is the first step to defeating them. Oracle will factor these into every recommendation.
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {OBSTACLE_CHIPS.map(o => (
                <button
                  key={o}
                  type="button"
                  onClick={() => toggleObstacle(o)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    obstacles.includes(o)
                      ? 'bg-primary/15 border-primary/40 text-primary'
                      : 'bg-card border-border text-muted-foreground hover:border-primary/20 hover:text-foreground'
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>

            <textarea
              value={customObstacle}
              onChange={e => setCustomObstacle(e.target.value)}
              placeholder="Anything else? Be honest with yourself."
              rows={2}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none mb-8"
            />

            <Button
              onClick={nextStep}
              className="w-full bg-primary text-primary-foreground py-6 text-base gap-2 shadow-lg shadow-primary/20"
            >
              I know my obstacles <ChevronRight className="w-4 h-4" />
            </Button>
            <button
              onClick={nextStep}
              className="w-full text-xs text-muted-foreground hover:text-foreground mt-3 py-2 transition-colors"
            >
              Skip this step
            </button>
          </div>
        )}

        {/* ── Step 3: 12-month vision ── */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <p className="text-xs text-primary uppercase tracking-widest font-semibold mb-2">Step 3 of 3</p>
            <h2 className="text-2xl font-bold mb-2">What changes in 12 months?</h2>
            <p className="text-muted-foreground mb-8">
              Describe your life after doing the work. Be specific — Oracle will turn this into your first action plan.
            </p>

            <textarea
              value={vision}
              onChange={e => setVision(e.target.value)}
              placeholder="In 12 months I'm running 3x per week, saving €500 every month, sleeping 8 hours, and feeling like the person I've always wanted to be. My Alignment Score is above 80% and I've finally proved to myself that I can follow through."
              rows={6}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none leading-relaxed mb-8"
            />

            <Button
              onClick={() => generateProfile()}
              disabled={!vision.trim()}
              className="w-full bg-primary text-primary-foreground py-6 text-base gap-2 shadow-lg shadow-primary/20 disabled:opacity-40"
            >
              <Sparkles className="w-5 h-5" />
              Generate my identity plan
            </Button>
            <button
              onClick={() => { const fallback = 'Building a better version of myself.'; setVision(fallback); generateProfile(fallback) }}
              className="w-full text-xs text-muted-foreground hover:text-foreground mt-3 py-2 transition-colors"
            >
              Skip and generate anyway
            </button>
          </div>
        )}

        {/* ── Step 4: Oracle generates profile ── */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">

            {generating && (
              <div className="text-center py-12">
                <div className="relative w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                </div>
                <h2 className="text-xl font-bold mb-3">Oracle is reading your vision…</h2>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
                  Analyzing your identity, obstacles, and 12-month vision to build your personal plan.
                </p>
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-xs text-muted-foreground">Usually takes 5–10 seconds</span>
                </div>
              </div>
            )}

            {!generating && profile && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-1">Your plan is ready.</h2>
                  <p className="text-muted-foreground text-sm">
                    {genError ? 'Default plan loaded — Oracle will personalize it as you log data.' : 'Oracle has processed your vision.'}
                  </p>
                </div>

                {/* Oracle intro */}
                <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Oracle</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{profile.oracleIntro}</p>
                </div>

                {/* Identity */}
                <div className="bg-card border border-border rounded-2xl p-4">
                  <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 font-semibold">Your identity</div>
                  <p className="text-sm font-medium leading-relaxed">{profile.identityStatement}</p>
                </div>

                {/* Challenge + First action */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-500/5 border border-red-500/15 rounded-2xl p-3">
                    <div className="text-[10px] text-red-400 uppercase tracking-widest mb-1.5 font-semibold">Main challenge</div>
                    <p className="text-xs text-foreground leading-relaxed">{profile.mainChallenge}</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/15 rounded-2xl p-3">
                    <div className="text-[10px] text-green-400 uppercase tracking-widest mb-1.5 font-semibold">First action today</div>
                    <p className="text-xs text-foreground leading-relaxed">{profile.firstAction}</p>
                  </div>
                </div>

                {/* Suggested habits */}
                <div className="bg-card border border-border rounded-2xl p-4">
                  <div className="text-xs text-muted-foreground uppercase tracking-widest mb-3 font-semibold">Your starter habits (tap to deselect)</div>
                  <div className="space-y-2">
                    {profile.suggestedHabits.map(h => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setSelectedHabits(prev =>
                          prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h]
                        )}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm font-medium text-left transition-all ${
                          selectedHabits.includes(h)
                            ? 'bg-primary/10 border-primary/30 text-primary'
                            : 'bg-secondary/50 border-border text-muted-foreground line-through'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                          selectedHabits.includes(h) ? 'bg-primary border-primary' : 'border-muted-foreground'
                        }`} />
                        {h}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={finish}
                  className="w-full bg-primary text-primary-foreground py-6 text-base gap-2 shadow-xl shadow-primary/20 mt-2"
                >
                  <Flame className="w-5 h-5" />
                  Enter FORGE
                </Button>

                <p className="text-[11px] text-muted-foreground text-center">
                  These habits start today. Oracle tracks your alignment from day one.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
