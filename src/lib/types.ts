export interface VitalEntry {
  id: string
  date: string
  sleepHours: number
  sleepQuality: number // 1-10
  hrv?: number // ms — optional (not all users have wearables)
  rhr?: number // bpm — optional
  energy: number // 1-10
  mood: number // 1-10
  feeling?: number // 1-10 — end-of-day calibration score (feeds Oracle correlation)
  wakeTime?: string // HH:MM — drives peak alertness window
  steps?: number    // daily step count
  waterLiters?: number // daily water intake in L
  notes?: string
}

// ── Life Score History ───────────────────────────────────
export interface LifeScoreSnapshot {
  date: string   // YYYY-MM-DD
  overall: number
  health: number
  body: number
  wealth: number
  mind: number
}

export interface WorkoutSet {
  reps: number
  weight: number // kg
}

export interface Exercise {
  name: string
  sets: WorkoutSet[]
}

export interface WorkoutEntry {
  id: string
  date: string
  exercises: Exercise[]
  duration: number // minutes
  notes?: string
}

export interface NutritionEntry {
  id: string
  date: string
  calories: number
  protein: number // g
  carbs: number // g
  fat: number // g
  water: number // L
  meals: string[]
}

export interface BodyMetric {
  id: string
  date: string
  weight: number // kg
  bodyFat?: number // %
}

export interface Transaction {
  id: string
  date: string
  amount: number
  category: string
  type: 'income' | 'expense'
  description: string
}

export interface Milestone {
  id: string
  title: string
  completed: boolean
}

export interface Goal {
  id: string
  title: string
  category: 'health' | 'fitness' | 'finance' | 'career' | 'personal'
  targetDate: string
  status: 'active' | 'completed' | 'paused'
  progress: number // 0-100
  milestones: Milestone[]
  notes?: string
}

export interface Habit {
  id: string
  name: string
  category: string
  completions: string[] // ISO date strings
}

export interface Task {
  id: string
  title: string
  priority: 'high' | 'medium' | 'low'
  dueDate?: string
  completed: boolean
  goalId?: string
  createdAt?: string  // ISO date — tracks when commitment was made
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export type DailyCall = 'GREEN' | 'YELLOW' | 'RED'

// ── Life Score ──────────────────────────────────────────
export interface DomainScore {
  score: number      // 0-100
  trend: 'up' | 'down' | 'flat'
  label: string
}

export interface LifeScores {
  overall: number
  health: DomainScore
  body: DomainScore
  wealth: DomainScore
  mind: DomainScore
}

// ── Insights ────────────────────────────────────────────
export type InsightSeverity = 'info' | 'warning' | 'alert' | 'win'

export interface InsightCard {
  id: string
  title: string
  body: string
  severity: InsightSeverity
  domain: 'health' | 'body' | 'wealth' | 'mind' | 'cross'
  action?: string
  actionHref?: string
}

// ── Achievements ────────────────────────────────────────
export interface Achievement {
  id: string
  emoji: string
  title: string
  description: string
  unlockedAt?: string   // ISO date if earned
}

// ── User Profile ────────────────────────────────────────
export interface UserProfile {
  name: string
  primaryGoal: string
  identity?: string        // "I am becoming…" — drives Oracle context
  vision?: string          // 12-month future state
  obstacles?: string[]     // what's been stopping them
  oracleIdentity?: string  // Oracle's distilled identity statement from onboarding
  setupComplete: boolean
  joinedAt: string
}

// ── Alignment Score History ──────────────────────────────
export interface AlignmentSnapshot {
  date: string   // YYYY-MM-DD
  score: number  // 0-100
  habitRate: number
  keptRate: number
}

// ── Projection ──────────────────────────────────────────
export interface Projection {
  text: string
  type: 'positive' | 'warning' | 'neutral'
  icon: string
}

// ── Supplements ─────────────────────────────────────────
export interface SupplementEntry {
  id: string
  date: string       // YYYY-MM-DD
  name: string
  doseMg: number
  timing: 'morning' | 'pre-workout' | 'post-workout' | 'evening' | 'with-meal'
}

// ── Learning / Studies ───────────────────────────────────
export type LearningType = 'book' | 'course' | 'podcast' | 'video' | 'article'
export type LearningStatus = 'backlog' | 'in-progress' | 'done'

export interface LearningItem {
  id: string
  title: string
  author?: string
  type: LearningType
  status: LearningStatus
  progress: number   // 0-100
  notes?: string
  startedAt?: string
  completedAt?: string
  addedAt: string
}

// ── Subscriptions ───────────────────────────────────────
export interface Subscription {
  id: string
  name: string
  amount: number      // always stored as monthly equivalent
  cycle: 'monthly' | 'annual'
  category: 'streaming' | 'fitness' | 'software' | 'news' | 'food' | 'finance' | 'other'
  color?: string
}

// ── Journal ─────────────────────────────────────────────
export interface JournalEntry {
  id: string
  date: string
  content: string
  mood?: number
}

// ── Body Measurements ───────────────────────────────────
export interface BodyMeasurement {
  id: string
  date: string      // YYYY-MM-DD
  waist?: number    // cm
  chest?: number    // cm
  hips?: number     // cm
  arms?: number     // cm (bicep)
  thighs?: number   // cm
  neck?: number     // cm
  note?: string
}

// ── Body Photos ──────────────────────────────────────────
export interface BodyPhoto {
  id: string
  date: string        // YYYY-MM-DD
  thumbnail: string   // base64 JPEG ~300px wide
  analysis?: string   // Oracle's assessment text
}

// ── Net Worth ────────────────────────────────────────────
export interface NetWorthEntry {
  id: string
  date: string       // YYYY-MM-DD
  assets: number     // €
  liabilities: number // €
  note?: string
}

export type TimelineCategory = 'meal' | 'workout' | 'stimulant' | 'note' | 'energy'

export interface TimelineEntry {
  id: string
  date: string       // YYYY-MM-DD
  time: string       // HH:MM (24h)
  category: TimelineCategory
  title: string
  detail?: string
  energy?: number    // 1-10 for energy check-ins
  caffeineMg?: number // mg — for stimulant entries, drives pharmacokinetics curve
  planned?: boolean  // true = Oracle/user-planned (not yet happened)
  source?: 'oracle' | 'user'
}
