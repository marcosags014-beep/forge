'use client'
// Analytics wrapper — PostHog with graceful no-op when key is absent
// All events defined here; call capture() from anywhere in the app

import posthog from 'posthog-js'

export function initAnalytics() {
  if (typeof window === 'undefined') return
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) return
  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: false,
  })
}

export function capture(event: string, props?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  try { posthog.capture(event, props) } catch { /* silent — analytics must never crash the app */ }
}

export function identifyUser(id: string, traits?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  try { posthog.identify(id, traits) } catch {}
}

// ── Named event helpers (prevents typos) ─────────────────

export const Analytics = {
  onboardingStarted:   ()                           => capture('onboarding_started'),
  onboardingCompleted: (p: { focus?: string })      => capture('onboarding_completed', p),
  setupStepCompleted:  (step: number)               => capture('setup_step_completed', { step }),

  firstGoalCreated:    ()                           => capture('first_goal_created'),
  firstCheckIn:        ()                           => capture('first_check_in'),

  habitCompleted:      (name: string)               => capture('habit_completed', { name }),
  vitalLogged:         ()                           => capture('vital_logged'),
  workoutLogged:       ()                           => capture('workout_logged'),
  transactionLogged:   (type: 'income' | 'expense') => capture('transaction_logged', { type }),
  journalSaved:        (wordCount: number)          => capture('journal_saved', { word_count: wordCount }),

  oracleMessageSent:   (mode: string, isNew: boolean) => capture('oracle_message_sent', { mode, is_new_conversation: isNew }),
  oracleActionAdded:   (type: 'habit' | 'goal')    => capture('oracle_action_added', { type }),

  upgradeClicked:      (source: string)             => capture('upgrade_clicked', { source }),
  upgradePurchased:    (plan: string)               => capture('upgrade_purchased', { plan }),

  featureUsed:         (module: string)             => capture('feature_used', { module }),

  // Retention milestones — call these from a daily check-in trigger
  d1Active:            ()                           => capture('d1_active'),
  d7Active:            ()                           => capture('d7_active'),
  d30Active:           ()                           => capture('d30_active'),
}
