'use client'

import { useState } from 'react'
import { Plus, X, Heart, Dumbbell, DollarSign, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { vitalsStore, workoutsStore, financeStore, generateId, today } from '@/lib/store'

type Tab = 'vitals' | 'workout' | 'expense'

export function QuickLogFAB() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('vitals')
  const [saved, setSaved] = useState(false)

  const [vitalsForm, setVitalsForm] = useState({ sleep: '7', hrv: '', rhr: '', energy: '7', mood: '7' })
  const [workoutForm, setWorkoutForm] = useState({ name: '', duration: '45' })
  const [expenseForm, setExpenseForm] = useState<{ amount: string; description: string; category: string; type: 'income' | 'expense' }>({ amount: '', description: '', category: 'Food', type: 'expense' })

  function flash() {
    setSaved(true)
    setTimeout(() => { setSaved(false); setOpen(false) }, 1200)
  }

  function logVitals() {
    vitalsStore.save({
      id: generateId(), date: today(),
      sleepHours: parseFloat(vitalsForm.sleep) || 7,
      sleepQuality: 7,
      hrv: vitalsForm.hrv ? parseFloat(vitalsForm.hrv) : 0,
      rhr: vitalsForm.rhr ? parseFloat(vitalsForm.rhr) : 0,
      energy: parseInt(vitalsForm.energy),
      mood: parseInt(vitalsForm.mood),
    })
    flash()
  }

  function logWorkout() {
    if (!workoutForm.name) return
    workoutsStore.save({
      id: generateId(), date: today(),
      duration: parseInt(workoutForm.duration) || 45,
      exercises: [],
      notes: workoutForm.name,
    })
    flash()
  }

  function logExpense() {
    if (!expenseForm.amount || !expenseForm.description) return
    financeStore.save({
      id: generateId(), date: today(),
      amount: parseFloat(expenseForm.amount),
      category: expenseForm.category,
      type: expenseForm.type,
      description: expenseForm.description,
    })
    flash()
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'vitals', label: 'Vitals', icon: Heart },
    { id: 'workout', label: 'Workout', icon: Dumbbell },
    { id: 'expense', label: 'Expense', icon: DollarSign },
  ]

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      )}

      {/* Modal */}
      {open && (
        <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50 w-80 forge-card shadow-2xl shadow-black/50 animate-in slide-in-from-bottom-8 fade-in duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Quick Log</h3>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-secondary rounded-lg mb-4">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all ${tab === id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                <Icon className="w-3 h-3" />{label}
              </button>
            ))}
          </div>

          {tab === 'vitals' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="forge-label mb-1 block">Sleep (hrs)</label>
                  <input type="number" min={0} max={24} step={0.5} value={vitalsForm.sleep}
                    onChange={e => setVitalsForm(f => ({ ...f, sleep: e.target.value }))}
                    className="forge-input" />
                </div>
                <div>
                  <label className="forge-label mb-1 block">HRV (ms)</label>
                  <input type="number" min={0} placeholder="optional" value={vitalsForm.hrv}
                    onChange={e => setVitalsForm(f => ({ ...f, hrv: e.target.value }))}
                    className="forge-input" />
                </div>
              </div>
              <div>
                <label className="forge-label mb-1 block">Energy: {vitalsForm.energy}/10</label>
                <input type="range" min={1} max={10} value={vitalsForm.energy}
                  onChange={e => setVitalsForm(f => ({ ...f, energy: e.target.value }))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: 'oklch(0.705 0.213 47.604)' }} />
              </div>
              <div>
                <label className="forge-label mb-1 block">Mood: {vitalsForm.mood}/10</label>
                <input type="range" min={1} max={10} value={vitalsForm.mood}
                  onChange={e => setVitalsForm(f => ({ ...f, mood: e.target.value }))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: 'oklch(0.705 0.213 47.604)' }} />
              </div>
              <Button onClick={logVitals} className="w-full bg-primary text-primary-foreground gap-2" size="sm">
                <Save className="w-3.5 h-3.5" />{saved ? 'Logged!' : 'Log Vitals'}
              </Button>
            </div>
          )}

          {tab === 'workout' && (
            <div className="space-y-3">
              <div>
                <label className="forge-label mb-1 block">Workout name</label>
                <input value={workoutForm.name} onChange={e => setWorkoutForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Push day, Run, Yoga…"
                  className="forge-input" />
              </div>
              <div>
                <label className="forge-label mb-1 block">Duration (min)</label>
                <input type="number" min={0} value={workoutForm.duration}
                  onChange={e => setWorkoutForm(f => ({ ...f, duration: e.target.value }))}
                  placeholder="45"
                  className="forge-input" />
              </div>
              <Button onClick={logWorkout} disabled={!workoutForm.name} className="w-full bg-primary text-primary-foreground gap-2" size="sm">
                <Save className="w-3.5 h-3.5" />{saved ? 'Logged!' : 'Log Workout'}
              </Button>
            </div>
          )}

          {tab === 'expense' && (
            <div className="space-y-3">
              <div className="flex gap-1 p-1 bg-secondary rounded-lg">
                {(['expense', 'income'] as const).map(t => (
                  <button key={t} onClick={() => setExpenseForm(f => ({ ...f, type: t }))}
                    className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${expenseForm.type === t ? (t === 'expense' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400') : 'text-muted-foreground'}`}>
                    {t === 'expense' ? 'Expense' : 'Income'}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="forge-label mb-1 block">Amount (€)</label>
                  <input type="number" min={0} step={0.01} value={expenseForm.amount}
                    onChange={e => setExpenseForm(f => ({ ...f, amount: e.target.value }))}
                    placeholder="0.00"
                    className="forge-input" />
                </div>
                <div>
                  <label className="forge-label mb-1 block">Category</label>
                  <select value={expenseForm.category}
                    onChange={e => setExpenseForm(f => ({ ...f, category: e.target.value }))}
                    className="forge-input">
                    {['Food', 'Transport', 'Health', 'Fitness', 'Entertainment', 'Clothing', 'Rent', 'Utilities', 'Investment', 'Income', 'Other'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="forge-label mb-1 block">Description</label>
                <input value={expenseForm.description}
                  onChange={e => setExpenseForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Lunch, gym, Netflix…"
                  className="forge-input" />
              </div>
              <Button onClick={logExpense} disabled={!expenseForm.amount || !expenseForm.description}
                className="w-full bg-primary text-primary-foreground gap-2" size="sm">
                <Save className="w-3.5 h-3.5" />{saved ? 'Logged!' : 'Log Transaction'}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`fixed bottom-6 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 ${open ? 'rotate-45' : ''}`}
      >
        <Plus className="w-6 h-6" />
      </button>
    </>
  )
}
