'use client'

import { tasksStore, goalsStore, habitsStore, financeStore, vitalsStore, journalStore, generateId, today } from './store'

export type CaptureType = 'task' | 'goal' | 'habit' | 'expense' | 'income' | 'vital' | 'journal' | 'oracle'

export interface CaptureResult {
  type: CaptureType
  preview: string          // Human-readable confirmation
  execute: () => void      // Call to actually save
}

function extractAmount(text: string): number | null {
  const m = text.match(/[€$£]?\s*([\d]+(?:[.,]\d{1,2})?)/)?.[1]
  return m ? parseFloat(m.replace(',', '.')) : null
}

// Local fast parser — no API needed for common patterns
export function parseCapture(raw: string): CaptureResult | null {
  const text = raw.trim()
  const lower = text.toLowerCase()

  // ── Task ───────────────────────────────────────────────
  const taskMatch = lower.match(/^(?:task|todo|commit|commitment|add task|remind me to|i need to|need to|i have to|remember to|i will)[:\s]+(.+)/i)
  if (taskMatch) {
    const title = text.slice(taskMatch[0].length - taskMatch[1].length).trim()
    return {
      type: 'task',
      preview: `Add commitment: "${title}"`,
      execute: () => tasksStore.save({ id: generateId(), title, priority: 'medium', completed: false }),
    }
  }

  // ── Goal ───────────────────────────────────────────────
  const goalMatch = lower.match(/^(?:goal|new goal|my goal|i want to|i will|i'm going to)[:\s]+(.+)/i)
  if (goalMatch) {
    const title = text.slice(goalMatch[0].length - goalMatch[1].length).trim()
    const targetDate = new Date(); targetDate.setMonth(targetDate.getMonth() + 3)
    return {
      type: 'goal',
      preview: `Create goal: "${title}"`,
      execute: () => goalsStore.save({
        id: generateId(), title,
        category: 'personal',
        targetDate: targetDate.toISOString().split('T')[0],
        status: 'active', progress: 0, milestones: [],
      }),
    }
  }

  // ── Habit ──────────────────────────────────────────────
  const habitMatch = lower.match(/^(?:habit|add habit|new habit|every day|daily)[:\s]+(.+)/i)
  if (habitMatch) {
    const name = text.slice(habitMatch[0].length - habitMatch[1].length).trim()
    return {
      type: 'habit',
      preview: `Create habit: "${name}"`,
      execute: () => habitsStore.save({ id: generateId(), name, category: 'personal', completions: [] }),
    }
  }

  // ── Expense ────────────────────────────────────────────
  const expenseMatch = lower.match(/^(?:spent|bought|paid|expense|cost)[:\s]+(.+?)\s+[€$£]?([\d]+(?:[.,]\d{1,2})?)/i)
  if (expenseMatch) {
    const description = expenseMatch[1].trim()
    const amount = parseFloat(expenseMatch[2].replace(',', '.'))
    return {
      type: 'expense',
      preview: `Log expense: "${description}" €${amount.toFixed(2)}`,
      execute: () => financeStore.save({ id: generateId(), date: today(), amount, category: 'Other', type: 'expense', description }),
    }
  }

  // ── Quick amount (just a number + description) "coffee 3.50"
  const quickExpense = text.match(/^(.+?)\s+[€$]?([\d]+[.,][\d]{2})$/)
  if (quickExpense) {
    const description = quickExpense[1].trim()
    const amount = parseFloat(quickExpense[2].replace(',', '.'))
    if (amount > 0 && amount < 10000) {
      return {
        type: 'expense',
        preview: `Log expense: "${description}" €${amount.toFixed(2)}`,
        execute: () => financeStore.save({ id: generateId(), date: today(), amount, category: 'Other', type: 'expense', description }),
      }
    }
  }

  // ── Income ─────────────────────────────────────────────
  const incomeMatch = lower.match(/^(?:income|earned|received|got paid|salary)[:\s]+(.+?)\s+[€$£]?([\d]+(?:[.,]\d{1,2})?)/i)
  if (incomeMatch) {
    const description = incomeMatch[1].trim()
    const amount = parseFloat(incomeMatch[2].replace(',', '.'))
    return {
      type: 'income',
      preview: `Log income: "${description}" €${amount.toFixed(2)}`,
      execute: () => financeStore.save({ id: generateId(), date: today(), amount, category: 'Income', type: 'income', description }),
    }
  }

  // ── Vitals ─────────────────────────────────────────────
  const sleepMatch = lower.match(/(?:slept?|sleep)\s+([\d.]+)\s*(?:h(?:ours?)?|hrs?)?/)
  if (sleepMatch) {
    const hours = parseFloat(sleepMatch[1])
    return {
      type: 'vital',
      preview: `Log sleep: ${hours}h tonight`,
      execute: () => vitalsStore.save({ id: generateId(), date: today(), sleepHours: hours, sleepQuality: 7, energy: 7, mood: 7 }),
    }
  }

  // ── Journal ────────────────────────────────────────────
  const journalMatch = lower.match(/^(?:journal|note|feeling|diary|today i|today was)[:\s]+(.+)/i)
  if (journalMatch) {
    const content = text.slice(journalMatch[0].length - journalMatch[1].length).trim()
    return {
      type: 'journal',
      preview: `Journal entry: "${content.slice(0, 60)}${content.length > 60 ? '…' : ''}"`,
      execute: () => journalStore.save({ id: generateId(), date: today(), content }),
    }
  }

  // ── Fallback: send to Oracle ────────────────────────────
  return null
}

// Type emoji for display
export const CAPTURE_EMOJI: Record<CaptureType, string> = {
  task: '📌',
  goal: '🎯',
  habit: '🔥',
  expense: '💸',
  income: '💰',
  vital: '❤️',
  journal: '📓',
  oracle: '🧠',
}

export const CAPTURE_COLOR: Record<CaptureType, string> = {
  task: 'text-blue-400',
  goal: 'text-primary',
  habit: 'text-purple-400',
  expense: 'text-red-400',
  income: 'text-green-400',
  vital: 'text-green-400',
  journal: 'text-yellow-400',
  oracle: 'text-primary',
}
