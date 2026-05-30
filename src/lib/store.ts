import type {
  VitalEntry, WorkoutEntry, NutritionEntry, BodyMetric,
  Transaction, Goal, Habit, Task, ChatMessage,
  LifeScores, InsightCard, Achievement, UserProfile, JournalEntry
} from './types'

// ── Core store helpers ───────────────────────────────────
function getStore<T>(key: string): T[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(`forge_${key}`)
    return data ? JSON.parse(data) : []
  } catch { return [] }
}

function setStore<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(`forge_${key}`, JSON.stringify(data))
}

function getOne<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const data = localStorage.getItem(`forge_${key}`)
    return data ? JSON.parse(data) : null
  } catch { return null }
}

function setOne<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(`forge_${key}`, JSON.stringify(data))
}

// ── Domain stores ────────────────────────────────────────
const CAP = 365

export const vitalsStore = {
  getAll: () => getStore<VitalEntry>('vitals'),
  save: (entry: VitalEntry) => {
    const all = getStore<VitalEntry>('vitals')
    const idx = all.findIndex(e => e.date === entry.date)
    if (idx >= 0) all[idx] = entry; else all.unshift(entry)
    if (all.length > CAP) all.length = CAP
    setStore('vitals', all)
  },
  getLast: () => getStore<VitalEntry>('vitals')[0] ?? null,
  getRecent: (n: number) => getStore<VitalEntry>('vitals').slice(0, n),
}

export const workoutsStore = {
  getAll: () => getStore<WorkoutEntry>('workouts'),
  save: (entry: WorkoutEntry) => {
    const all = getStore<WorkoutEntry>('workouts')
    all.unshift(entry)
    if (all.length > CAP) all.length = CAP
    setStore('workouts', all)
  },
  getRecent: (n: number) => getStore<WorkoutEntry>('workouts').slice(0, n),
}

export const nutritionStore = {
  getAll: () => getStore<NutritionEntry>('nutrition'),
  save: (entry: NutritionEntry) => {
    const all = getStore<NutritionEntry>('nutrition')
    const idx = all.findIndex(e => e.date === entry.date)
    if (idx >= 0) all[idx] = entry; else all.unshift(entry)
    setStore('nutrition', all)
  },
  getLast: () => getStore<NutritionEntry>('nutrition')[0] ?? null,
}

export const bodyStore = {
  getAll: () => getStore<BodyMetric>('body'),
  save: (metric: BodyMetric) => {
    const all = getStore<BodyMetric>('body')
    all.unshift(metric)
    if (all.length > CAP) all.length = CAP
    setStore('body', all)
  },
  getLast: () => getStore<BodyMetric>('body')[0] ?? null,
}

export const financeStore = {
  getAll: () => getStore<Transaction>('finance'),
  save: (tx: Transaction) => {
    const all = getStore<Transaction>('finance')
    all.unshift(tx)
    if (all.length > CAP) all.length = CAP
    setStore('finance', all)
  },
  getBalance: () =>
    getStore<Transaction>('finance').reduce(
      (sum, tx) => tx.type === 'income' ? sum + tx.amount : sum - tx.amount, 0
    ),
  getMonthly: () => {
    const all = getStore<Transaction>('finance')
    const thisMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
    return all.filter(tx => tx.date.startsWith(thisMonth))
  },
  getSavingsRate: () => {
    const monthly = getStore<Transaction>('finance').filter(
      tx => tx.date.startsWith(new Date().toISOString().slice(0, 7))
    )
    const income = monthly.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expenses = monthly.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    if (income === 0) return 0
    return Math.max(0, ((income - expenses) / income) * 100)
  },
}

export const goalsStore = {
  getAll: () => getStore<Goal>('goals'),
  save: (goal: Goal) => {
    const all = getStore<Goal>('goals')
    const idx = all.findIndex(g => g.id === goal.id)
    if (idx >= 0) all[idx] = goal; else all.unshift(goal)
    setStore('goals', all)
  },
  delete: (id: string) => setStore('goals', getStore<Goal>('goals').filter(g => g.id !== id)),
  avgProgress: () => {
    const active = getStore<Goal>('goals').filter(g => g.status === 'active')
    if (!active.length) return 0
    return Math.round(active.reduce((s, g) => s + g.progress, 0) / active.length)
  },
}

export const habitsStore = {
  getAll: () => getStore<Habit>('habits'),
  save: (habit: Habit) => {
    const all = getStore<Habit>('habits')
    const idx = all.findIndex(h => h.id === habit.id)
    if (idx >= 0) all[idx] = habit; else all.unshift(habit)
    setStore('habits', all)
  },
  toggle: (id: string, date: string) => {
    const all = getStore<Habit>('habits')
    const habit = all.find(h => h.id === id)
    if (!habit) return
    const idx = habit.completions.indexOf(date)
    if (idx >= 0) habit.completions.splice(idx, 1); else habit.completions.push(date)
    setStore('habits', all)
  },
  delete: (id: string) => setStore('habits', getStore<Habit>('habits').filter(h => h.id !== id)),
  completionRateFor: (days: number) => {
    const habits = getStore<Habit>('habits')
    if (!habits.length) return 0
    let total = 0, done = 0
    for (let i = 0; i < days; i++) {
      const d = new Date(); d.setDate(d.getDate() - i)
      const ds = d.toISOString().split('T')[0]
      total += habits.length
      done += habits.filter(h => h.completions.includes(ds)).length
    }
    return total ? Math.round((done / total) * 100) : 0
  },
}

export const tasksStore = {
  getAll: () => getStore<Task>('tasks'),
  save: (task: Task) => {
    const all = getStore<Task>('tasks')
    const idx = all.findIndex(t => t.id === task.id)
    if (idx >= 0) all[idx] = task; else all.unshift(task)
    setStore('tasks', all)
  },
  toggle: (id: string) => {
    const all = getStore<Task>('tasks')
    const task = all.find(t => t.id === id)
    if (task) task.completed = !task.completed
    setStore('tasks', all)
  },
  delete: (id: string) => setStore('tasks', getStore<Task>('tasks').filter(t => t.id !== id)),
}

export const chatStore = {
  getMessages: () => getStore<ChatMessage>('chat'),
  addMessage: (msg: ChatMessage) => {
    const all = getStore<ChatMessage>('chat'); all.push(msg); setStore('chat', all)
  },
  clear: () => setStore('chat', []),
}

export const journalStore = {
  getAll: () => getStore<JournalEntry>('journal'),
  save: (entry: JournalEntry) => {
    const all = getStore<JournalEntry>('journal')
    const idx = all.findIndex(e => e.date === entry.date)
    if (idx >= 0) all[idx] = entry; else all.unshift(entry)
    if (all.length > CAP) all.length = CAP
    setStore('journal', all)
  },
  getLast: () => getStore<JournalEntry>('journal')[0] ?? null,
}

export const profileStore = {
  get: () => getOne<UserProfile>('profile'),
  save: (p: UserProfile) => setOne('profile', p),
}

export const achievementsStore = {
  getUnlocked: () => getStore<Achievement>('achievements'),
  unlock: (a: Achievement) => {
    const all = getStore<Achievement>('achievements')
    if (!all.find(x => x.id === a.id)) {
      all.push({ ...a, unlockedAt: new Date().toISOString() })
      setStore('achievements', all)
    }
  },
}

// ── Computed scores ──────────────────────────────────────
export function calculateReadiness(vital: VitalEntry | null): number {
  if (!vital) return 0
  const sleepScore = Math.min(100, (vital.sleepHours / 8) * 100 * (vital.sleepQuality / 10))
  const hrvScore = Math.min(100, ((vital.hrv ?? 0) / 100) * 100)
  const energyScore = (vital.energy / 10) * 100
  const moodScore = (vital.mood / 10) * 100
  return Math.round(sleepScore * 0.35 + hrvScore * 0.30 + energyScore * 0.20 + moodScore * 0.15)
}

export function getDailyCall(readiness: number): 'GREEN' | 'YELLOW' | 'RED' {
  if (readiness >= 75) return 'GREEN'
  if (readiness >= 50) return 'YELLOW'
  return 'RED'
}

export function calculateLifeScores(): LifeScores {
  const vital = vitalsStore.getLast()
  const prevVital = vitalsStore.getRecent(2)[1] ?? null

  // Health score
  const healthScore = calculateReadiness(vital)
  const prevHealthScore = calculateReadiness(prevVital)
  const healthTrend = healthScore > prevHealthScore + 3 ? 'up' : healthScore < prevHealthScore - 3 ? 'down' : 'flat'

  // Body score
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7)
  const workoutsThisWeek = workoutsStore.getAll().filter(w => w.date >= weekAgo.toISOString().split('T')[0]).length
  const twoWeeksAgo = new Date(); twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
  const workoutsPrevWeek = workoutsStore.getAll().filter(w =>
    w.date >= twoWeeksAgo.toISOString().split('T')[0] && w.date < weekAgo.toISOString().split('T')[0]
  ).length
  const bodyScore = Math.min(100, Math.round((workoutsThisWeek / 4) * 100))
  const bodyTrend = workoutsThisWeek > workoutsPrevWeek ? 'up' : workoutsThisWeek < workoutsPrevWeek ? 'down' : 'flat'

  // Wealth score
  const savingsRate = financeStore.getSavingsRate()
  const balance = financeStore.getBalance()
  const wealthScore = balance > 0
    ? Math.min(100, Math.round(20 + savingsRate * 0.8))
    : Math.max(0, Math.round(50 + (balance / 1000) * 10))
  const wealthTrend = savingsRate > 20 ? 'up' : savingsRate > 0 ? 'flat' : 'down'

  // Mind score
  const habitRate = habitsStore.completionRateFor(7)
  const goalProgress = goalsStore.avgProgress()
  const mindScore = Math.round(habitRate * 0.6 + goalProgress * 0.4)
  const prevHabitRate = habitsStore.completionRateFor(14)
  const mindTrend = habitRate > prevHabitRate + 5 ? 'up' : habitRate < prevHabitRate - 5 ? 'down' : 'flat'

  const overall = Math.round(
    healthScore * 0.30 + bodyScore * 0.20 + wealthScore * 0.25 + mindScore * 0.25
  )

  return {
    overall,
    health:  { score: healthScore,  trend: healthTrend,  label: 'Health' },
    body:    { score: bodyScore,     trend: bodyTrend,    label: 'Body' },
    wealth:  { score: wealthScore,   trend: wealthTrend,  label: 'Wealth' },
    mind:    { score: mindScore,     trend: mindTrend,    label: 'Mind' },
  }
}

// ── Insights engine (client-side, no AI) ────────────────
export function generateInsights(): InsightCard[] {
  const cards: InsightCard[] = []
  const vitals = vitalsStore.getRecent(14)
  const habits = habitsStore.getAll()
  const todayStr = today()

  // Crisis detection — 3+ days of mood ≤ 3
  const recentMoods = vitals.slice(0, 4).map(v => v.mood)
  const lowMoodDays = recentMoods.filter(m => m <= 3).length
  if (lowMoodDays >= 3) {
    cards.push({
      id: 'crisis_mood',
      title: 'Your mood has been low for several days',
      body: "You've logged mood ≤3 for 3+ consecutive days. This matters. Consider talking to someone you trust, or reaching out to a professional — it's a sign of strength, not weakness.",
      severity: 'alert',
      domain: 'health',
      action: 'Log today\'s mood',
      actionHref: '/vitals',
    })
  }

  // Sleep debt alert
  if (vitals.length >= 3) {
    const avgSleep = vitals.slice(0, 3).reduce((s, v) => s + v.sleepHours, 0) / 3
    if (avgSleep < 6) {
      cards.push({
        id: 'sleep_debt',
        title: `Sleep debt building — avg ${avgSleep.toFixed(1)}h over 3 days`,
        body: 'Chronic sleep under 7h degrades cognition, immune function, and emotional regulation. Your readiness scores will keep falling until you pay this back.',
        severity: 'warning',
        domain: 'health',
        action: 'View Vitals',
        actionHref: '/vitals',
      })
    }
  }

  // HRV declining trend
  if (vitals.length >= 5) {
    const recentHRV = vitals.slice(0, 3).reduce((s, v) => s + (v.hrv ?? 0), 0) / 3
    const olderHRV = vitals.slice(3, 6).reduce((s, v) => s + (v.hrv ?? 0), 0) / Math.min(3, vitals.slice(3, 6).length)
    if (olderHRV > 0 && recentHRV < olderHRV * 0.85) {
      cards.push({
        id: 'hrv_declining',
        title: `HRV dropped ${Math.round(((olderHRV - recentHRV) / olderHRV) * 100)}% this week`,
        body: `Your HRV fell from ${Math.round(olderHRV)}ms to ${Math.round(recentHRV)}ms. This signals accumulated stress or under-recovery. Prioritise sleep, reduce training load, and manage stress today.`,
        severity: 'warning',
        domain: 'health',
      })
    }
  }

  // HRV strong
  if (vitals.length >= 3) {
    const avgHRV = vitals.slice(0, 3).reduce((s, v) => s + (v.hrv ?? 0), 0) / 3
    if (avgHRV >= 80) {
      cards.push({
        id: 'hrv_strong',
        title: `Strong HRV — avg ${Math.round(avgHRV)}ms this week`,
        body: 'High HRV means your nervous system is well-recovered and adaptive. Great time to push harder in training or take on high-stakes decisions.',
        severity: 'win',
        domain: 'health',
      })
    }
  }

  // Sleep/mood correlation
  if (vitals.length >= 5) {
    const lowSleepMoodPairs = vitals.filter(v => v.sleepHours < 6.5 && v.mood < 5).length
    if (lowSleepMoodPairs >= 2) {
      cards.push({
        id: 'sleep_mood_correlation',
        title: 'Sleep is directly impacting your mood',
        body: `You've had ${lowSleepMoodPairs} days where short sleep (< 6.5h) coincided with low mood. Protecting your sleep isn't about rest — it's about who you are the next day.`,
        severity: 'info',
        domain: 'cross',
        action: 'Improve Sleep',
        actionHref: '/vitals',
      })
    }
  }

  // Habit streak win
  const bestStreak = Math.max(0, ...habits.map(h => getHabitStreak(h)))
  if (bestStreak >= 7) {
    cards.push({
      id: 'habit_streak_win',
      title: `${bestStreak}-day habit streak 🔥`,
      body: 'You\'re building real identity-level change. Streaks compound — the person you\'re becoming is defined by what you do every day, not occasionally.',
      severity: 'win',
      domain: 'mind',
    })
  }

  // Habit consistency low
  const habitRate7d = habitsStore.completionRateFor(7)
  if (habits.length > 0 && habitRate7d < 40) {
    cards.push({
      id: 'habits_low',
      title: `Habit completion at ${habitRate7d}% this week`,
      body: 'Below 40% habit completion means your system isn\'t sticking. Consider reducing your habit stack to only the 3 most important ones.',
      severity: 'warning',
      domain: 'mind',
      action: 'Review Habits',
      actionHref: '/mind',
    })
  }

  // Fitness consistency win
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7)
  const workoutsThisWeek = workoutsStore.getAll().filter(w => w.date >= weekAgo.toISOString().split('T')[0]).length
  if (workoutsThisWeek >= 4) {
    cards.push({
      id: 'fitness_win',
      title: `${workoutsThisWeek} workouts this week`,
      body: 'Elite consistency. 4+ sessions/week puts you in the top 5% of physical activity. Your future self is being built right now.',
      severity: 'win',
      domain: 'body',
    })
  }

  // Finance: spending spike
  const monthlyTx = financeStore.getMonthly()
  const expenses = monthlyTx.filter(t => t.type === 'expense')
  const income = monthlyTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpenses = expenses.reduce((s, t) => s + t.amount, 0)
  if (income > 0 && totalExpenses > income * 0.9) {
    cards.push({
      id: 'finance_overspend',
      title: `Spending ${Math.round((totalExpenses / income) * 100)}% of income this month`,
      body: `You've spent €${totalExpenses.toFixed(0)} against €${income.toFixed(0)} income. Less than 10% savings rate means financial stress compounds quietly — review your top spending categories.`,
      severity: 'warning',
      domain: 'wealth',
      action: 'Review Finances',
      actionHref: '/wealth',
    })
  }

  // No data logged today
  const lastVital = vitalsStore.getLast()
  if (!lastVital || lastVital.date !== todayStr) {
    cards.push({
      id: 'no_vitals_today',
      title: 'No vitals logged today',
      body: 'Your readiness score and Life Score depend on today\'s data. 90 seconds is all it takes — log your sleep and energy now.',
      severity: 'info',
      domain: 'health',
      action: 'Log Vitals',
      actionHref: '/vitals',
    })
  }

  // Goal progress celebration
  const goals = goalsStore.getAll().filter(g => g.status === 'active' && g.progress >= 75)
  goals.forEach(g => {
    cards.push({
      id: `goal_near_${g.id}`,
      title: `Goal at ${g.progress}% — "${g.title}"`,
      body: 'You\'re in the final stretch. Most people quit when they\'re this close. You\'re not most people — push through.',
      severity: 'win',
      domain: 'mind',
      action: 'View Goals',
      actionHref: '/mind',
    })
  })

  // Sort: alerts first, then warnings, then wins, then info
  const order: Record<string, number> = { alert: 0, warning: 1, win: 2, info: 3 }
  return cards.sort((a, b) => order[a.severity] - order[b.severity])
}

// ── Achievements catalog + checker ──────────────────────
export const ALL_ACHIEVEMENTS = [
  { id: 'first_vital',    emoji: '🎯', title: 'First Step',         description: 'Log your first vital reading' },
  { id: 'week_vitals',    emoji: '📊', title: 'Data Driven',        description: 'Log vitals 7 days in a row' },
  { id: 'first_workout',  emoji: '💪', title: 'Showing Up',         description: 'Log your first workout' },
  { id: 'workouts_5',     emoji: '🏋️', title: 'Iron Week',          description: 'Complete 5 workouts in one week' },
  { id: 'habit_7',        emoji: '🔥', title: 'Locked In',          description: 'Maintain a 7-day habit streak' },
  { id: 'habit_30',       emoji: '💎', title: 'Unbreakable',        description: 'Maintain a 30-day habit streak' },
  { id: 'habits_perfect', emoji: '⚡', title: 'Perfect Day',        description: 'Complete all habits in one day' },
  { id: 'first_goal',     emoji: '🗻', title: 'Dreamer',            description: 'Create your first goal' },
  { id: 'goal_complete',  emoji: '🏆', title: 'Delivered',          description: 'Complete a goal at 100%' },
  { id: 'first_finance',  emoji: '💰', title: 'Money Aware',        description: 'Log your first transaction' },
  { id: 'savings_20',     emoji: '🏦', title: 'Wealth Builder',     description: 'Save 20%+ of income in a month' },
  { id: 'hrv_80',         emoji: '❤️', title: 'Peak Recovery',      description: 'Log an HRV of 80ms or higher' },
  { id: 'sleep_8',        emoji: '🌙', title: 'Sleep Champion',     description: 'Log 8+ hours of sleep' },
  { id: 'life_score_80',  emoji: '🌟', title: 'Life in Order',      description: 'Achieve a Life Score of 80+' },
  { id: 'oracle_chat',    emoji: '🧠', title: 'Oracle Consulted',   description: 'Have your first Oracle conversation' },
  { id: 'setup_complete', emoji: '🚀', title: 'Ready to Launch',    description: 'Complete the FORGE setup' },
] as const

export function checkAndUnlockAchievements() {
  const vitals = vitalsStore.getAll()
  const workouts = workoutsStore.getAll()
  const habits = habitsStore.getAll()
  const goals = goalsStore.getAll()
  const finance = financeStore.getAll()
  const chat = chatStore.getMessages()
  const profile = profileStore.get()
  const todayStr = today()

  const unlock = (id: string) => {
    const def = ALL_ACHIEVEMENTS.find(a => a.id === id)
    if (def) achievementsStore.unlock({ ...def })
  }

  if (vitals.length > 0) unlock('first_vital')

  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 6)
  const days7 = Array.from({length: 7}, (_, i) => { const d = new Date(); d.setDate(d.getDate() - i); return d.toISOString().split('T')[0] })
  if (days7.every(d => vitals.some(v => v.date === d))) unlock('week_vitals')

  if (workouts.length > 0) unlock('first_workout')

  const weekAgo2 = new Date(); weekAgo2.setDate(weekAgo2.getDate() - 7)
  const thisWeekWorkouts = workouts.filter(w => w.date >= weekAgo2.toISOString().split('T')[0]).length
  if (thisWeekWorkouts >= 5) unlock('workouts_5')

  habits.forEach(h => {
    if (getHabitStreak(h) >= 7) unlock('habit_7')
    if (getHabitStreak(h) >= 30) unlock('habit_30')
  })

  const allDoneToday = habits.length > 0 && habits.every(h => h.completions.includes(todayStr))
  if (allDoneToday) unlock('habits_perfect')

  if (goals.length > 0) unlock('first_goal')
  if (goals.some(g => g.progress >= 100)) unlock('goal_complete')
  if (finance.length > 0) unlock('first_finance')

  const savingsRate = financeStore.getSavingsRate()
  if (savingsRate >= 20) unlock('savings_20')

  if (vitals.some(v => (v.hrv ?? 0) >= 80)) unlock('hrv_80')
  if (vitals.some(v => v.sleepHours >= 8)) unlock('sleep_8')

  const scores = calculateLifeScores()
  if (scores.overall >= 80) unlock('life_score_80')
  if (chat.length > 0) unlock('oracle_chat')
  if (profile?.setupComplete) unlock('setup_complete')
}

// ── Utilities ────────────────────────────────────────────
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export function today(): string {
  return new Date().toISOString().split('T')[0]
}

export function getHabitStreak(habit: Habit): number {
  if (!habit.completions.length) return 0
  let streak = 0
  const d = new Date()
  for (let i = 0; i < 365; i++) {
    const ds = d.toISOString().split('T')[0]
    if (habit.completions.includes(ds)) streak++
    else if (i > 0) break
    d.setDate(d.getDate() - 1)
  }
  return streak
}

export function getAllDataForAI() {
  const vitals = vitalsStore.getRecent(7)
  const workouts = workoutsStore.getRecent(7)
  const finance = financeStore.getAll()
  return {
    profile: profileStore.get(),
    isNewUser: vitals.length === 0 && workouts.length === 0 && finance.length === 0,
    vitals,
    workouts,
    nutrition: nutritionStore.getLast(),
    body: bodyStore.getLast(),
    balance: financeStore.getBalance(),
    savingsRate: financeStore.getSavingsRate(),
    goals: goalsStore.getAll(),
    habits: habitsStore.getAll(),
    tasks: tasksStore.getAll().filter(t => !t.completed).slice(0, 10),
    lifeScores: calculateLifeScores(),
    insights: generateInsights().slice(0, 5),
  }
}
