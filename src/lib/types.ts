export interface VitalEntry {
  id: string
  date: string
  sleepHours: number
  sleepQuality: number // 1-10
  hrv?: number // ms — optional (not all users have wearables)
  rhr?: number // bpm — optional
  energy: number // 1-10
  mood: number // 1-10
  notes?: string
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
  identity?: string   // "Who I want to become" — drives Oracle context
  setupComplete: boolean
  joinedAt: string
}

// ── Projection ──────────────────────────────────────────
export interface Projection {
  text: string
  type: 'positive' | 'warning' | 'neutral'
  icon: string
}

// ── Journal ─────────────────────────────────────────────
export interface JournalEntry {
  id: string
  date: string
  content: string
  mood?: number
}
