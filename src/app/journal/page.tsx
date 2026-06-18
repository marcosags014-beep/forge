'use client'

import { useEffect, useState } from 'react'
import { format, subDays, differenceInCalendarDays } from 'date-fns'
import { BookOpen, Save, Sparkles, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { journalStore, vitalsStore, generateId, today, getAllDataForAI } from '@/lib/store'
import type { JournalEntry } from '@/lib/types'

const PROMPTS = [
  "What's the one thing that would make today a success?",
  "What are you grateful for right now?",
  "What drained you this week? What energised you?",
  "What's one thing you're avoiding that you shouldn't be?",
  "Who do you want to be in 12 months? What did today's version of you do toward that?",
  "What would you tell yourself 5 years ago?",
  "What's the hardest thing you need to do this week?",
]

export default function JournalPage() {
  const [dateOffset, setDateOffset] = useState(0)
  const [content, setContent] = useState('')
  const [mood, setMood] = useState(7)
  const [saved, setSaved] = useState(false)
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [promptIdx, setPromptIdx] = useState(0)
  const [aiReflection, setAiReflection] = useState('')
  const [loadingAI, setLoadingAI] = useState(false)

  const dateStr = subDays(new Date(), dateOffset).toISOString().split('T')[0]
  const isToday = dateOffset === 0
  const displayDate = format(subDays(new Date(), dateOffset), 'EEEE, MMMM d')

  useEffect(() => {
    const all = journalStore.getAll()
    setEntries(all)
    const existing = all.find(e => e.date === dateStr)
    setContent(existing?.content ?? '')
    setMood(existing?.mood ?? 7)
    setPromptIdx(Math.floor(Math.random() * PROMPTS.length))
  }, [dateStr])

  function save() {
    const entry: JournalEntry = { id: generateId(), date: dateStr, content, mood }
    journalStore.save(entry)
    setEntries(journalStore.getAll())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function getAIReflection() {
    if (!content.trim()) return
    setLoadingAI(true)
    setAiReflection('')
    try {
      const userData = getAllDataForAI()
      const vital = vitalsStore.getLast()
      const res = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'chat',
          agentPrompt: 'You are a thoughtful life coach reading the user\'s journal. Respond with 2-3 sentences: one genuine observation, one connecting their words to their data/goals, and one question that makes them think deeper. Be warm but direct.',
          message: `Here's my journal entry for ${displayDate}:\n\n"${content}"\n\nMy mood today: ${mood}/10`,
          userData,
        }),
      })
      const data = await res.json()
      setAiReflection(data.content ?? '')
    } catch {
      setAiReflection('Could not reach Oracle. Your reflection is still valuable — keep writing.')
    } finally {
      setLoadingAI(false)
    }
  }

  const moodColor = mood >= 8 ? 'text-green-400' : mood >= 5 ? 'text-yellow-400' : 'text-red-400'
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length

  // Writing streak: consecutive days with entries ending today or yesterday
  const writingStreak = (() => {
    const dates = new Set(entries.map(e => e.date))
    let streak = 0
    let check = new Date()
    // Allow today's draft (not yet saved) to count
    if (!dates.has(check.toISOString().split('T')[0]) && content.trim().length > 0) {
      dates.add(check.toISOString().split('T')[0])
    }
    while (dates.has(check.toISOString().split('T')[0])) {
      streak++
      check = subDays(check, 1)
    }
    return streak
  })()
  const totalWords = entries.reduce((s, e) => s + e.content.trim().split(/\s+/).filter(Boolean).length, 0)

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="forge-label mb-1"><BookOpen className="w-3.5 h-3.5" />Daily Journal</p>
          <h1 className="text-2xl md:text-3xl font-bold">{displayDate}</h1>
          {entries.length > 0 && (
            <div className="flex items-center gap-3 mt-1.5">
              {writingStreak > 0 && (
                <span className="text-xs text-primary font-medium">{writingStreak}🔥 streak</span>
              )}
              <span className="text-xs text-muted-foreground">{entries.length} entries · {totalWords.toLocaleString()} words</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setDateOffset(d => d + 1)}
            className="p-2 rounded-xl bg-secondary hover:bg-card border border-border transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button disabled={isToday} onClick={() => setDateOffset(d => Math.max(0, d - 1))}
            className="p-2 rounded-xl bg-secondary hover:bg-card border border-border transition-colors disabled:opacity-40">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mood */}
      <div className="forge-card mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="forge-label">Today&apos;s Mood</span>
          <span className={`text-2xl font-bold ${moodColor}`}>{mood}/10</span>
        </div>
        <input type="range" min={1} max={10} value={mood}
          onChange={e => setMood(parseInt(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: 'oklch(0.705 0.213 47.604)' }} />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Awful</span><span>Okay</span><span>Amazing</span>
        </div>
      </div>

      {/* Prompt */}
      <div className="px-4 py-3 rounded-xl bg-primary/5 border border-primary/10 mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] text-primary uppercase tracking-widest mb-1">Today&apos;s Prompt</p>
          <p className="text-sm text-foreground italic">&ldquo;{PROMPTS[promptIdx]}&rdquo;</p>
        </div>
        <button onClick={() => setPromptIdx(i => (i + 1) % PROMPTS.length)}
          className="text-muted-foreground hover:text-foreground text-xs flex-shrink-0 mt-1">↻</button>
      </div>

      {/* Editor */}
      <div className="forge-card mb-4">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Write freely. No one reads this but you and Oracle."
          rows={10}
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none leading-relaxed"
        />
        <div className="flex items-center justify-between pt-3 border-t border-border mt-3">
          <span className="text-xs text-muted-foreground">{wordCount} words</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={getAIReflection}
              disabled={loadingAI || !content.trim()} className="gap-1.5 text-xs">
              <Sparkles className={`w-3.5 h-3.5 ${loadingAI ? 'animate-spin' : ''}`} />
              {loadingAI ? 'Reflecting…' : 'Ask Oracle'}
            </Button>
            <Button size="sm" onClick={save} className="bg-primary text-primary-foreground gap-1.5 text-xs">
              <Save className="w-3.5 h-3.5" />
              {saved ? 'Saved!' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      {/* AI Reflection */}
      {aiReflection && (
        <div className="forge-card mb-6 bg-primary/5 border-primary/15 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary">Oracle&apos;s Reflection</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{aiReflection}</p>
        </div>
      )}

      {/* Recent entries */}
      {entries.length > 0 && (
        <div>
          <p className="forge-label mb-3">Recent Entries</p>
          <div className="space-y-2">
            {entries.filter(e => e.date !== dateStr).slice(0, 5).map(entry => (
              <div key={entry.id} className="relative group">
                <button
                  onClick={() => setDateOffset(Math.floor((new Date().getTime() - new Date(entry.date).getTime()) / (1000 * 60 * 60 * 24)))}
                  className="w-full forge-card text-left hover:border-primary/20 transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">{format(new Date(entry.date), 'MMM d')}</span>
                    {entry.mood && (
                      <span className={`text-xs font-semibold ${entry.mood >= 7 ? 'text-green-400' : entry.mood >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {entry.mood}/10
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{entry.content}</p>
                </button>
                <button
                  onClick={() => { journalStore.delete(entry.id); setEntries(journalStore.getAll()) }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all p-1">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
