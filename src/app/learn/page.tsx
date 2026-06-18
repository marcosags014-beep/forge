'use client'

import { useEffect, useState } from 'react'
import {
  BookOpen, Plus, Trash2, CheckCircle2, ChevronRight,
  Sparkles, RefreshCw, Check, X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { learningStore, generateId, today, profileStore, getAllDataForAI } from '@/lib/store'
import type { LearningItem, LearningType, LearningStatus } from '@/lib/types'

// ── Config ────────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<LearningType, { emoji: string; label: string }> = {
  book:    { emoji: '📚', label: 'Book' },
  course:  { emoji: '🎓', label: 'Course' },
  podcast: { emoji: '🎧', label: 'Podcast' },
  video:   { emoji: '▶️', label: 'Video' },
  article: { emoji: '📄', label: 'Article' },
}

const STATUS_LABEL: Record<LearningStatus, string> = {
  backlog: 'Backlog',
  'in-progress': 'Reading',
  done: 'Done',
}

const STATUS_COLOR: Record<LearningStatus, string> = {
  backlog: 'text-muted-foreground',
  'in-progress': 'text-primary',
  done: 'text-green-400',
}

// Category colours for recommendation chips
const CAT_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  fitness:      { bg: 'bg-blue-500/10',    text: 'text-blue-400',    label: 'Fitness' },
  wealth:       { bg: 'bg-green-500/10',   text: 'text-green-400',   label: 'Wealth' },
  mind:         { bg: 'bg-purple-500/10',  text: 'text-purple-400',  label: 'Mind' },
  health:       { bg: 'bg-orange-500/10',  text: 'text-orange-400',  label: 'Health' },
  productivity: { bg: 'bg-yellow-500/10',  text: 'text-yellow-400',  label: 'Productivity' },
}

const BLANK_FORM = { title: '', author: '', type: 'book' as LearningType, notes: '' }

// ── Types ─────────────────────────────────────────────────────────────────────

interface Recommendation {
  title: string
  author: string
  type: LearningType
  category: string
  reason: string
}

// ── Progress bar ──────────────────────────────────────────────────────────────

function ProgressBar({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Progress</span>
        <span className="text-xs font-bold text-primary">{value}%</span>
      </div>
      <input type="range" min={0} max={100} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: 'oklch(0.705 0.213 47.604)' }}
      />
    </div>
  )
}

// ── Oracle Recommendations ────────────────────────────────────────────────────

const CACHE_KEY = 'forge_learn_recs'
const CACHE_TTL = 1000 * 60 * 60 * 24 // 24h

function loadCachedRecs(): { recs: Recommendation[]; ts: number } | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch { return null }
}

function saveCachedRecs(recs: Recommendation[]) {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ recs, ts: Date.now() }))
}

function parseRecommendations(content: string): Recommendation[] {
  const re = /\[RECOMMEND:\s*([^|\]]+?)\s*\|\s*([^|\]]+?)\s*\|\s*([^|\]]+?)\s*\|\s*([^|\]]+?)\s*\|\s*([^\]]+?)\s*\]/g
  const recs: Recommendation[] = []
  const validTypes = ['book','course','podcast','video','article']
  let m: RegExpExecArray | null
  while ((m = re.exec(content)) !== null) {
    const type = m[3].trim().toLowerCase()
    recs.push({
      title:    m[1].trim(),
      author:   m[2].trim(),
      type:     (validTypes.includes(type) ? type : 'book') as LearningType,
      category: m[4].trim().toLowerCase(),
      reason:   m[5].trim(),
    })
  }
  return recs
}

function OracleRecommendations({
  onAdd,
  existingTitles,
}: {
  onAdd: (r: Recommendation) => void
  existingTitles: Set<string>
}) {
  const [recs, setRecs]       = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [added, setAdded]     = useState<Set<string>>(new Set())
  const [error, setError]     = useState('')
  const [expanded, setExpanded] = useState(true)

  useEffect(() => {
    const cached = loadCachedRecs()
    if (cached && Date.now() - cached.ts < CACHE_TTL && cached.recs.length > 0) {
      setRecs(cached.recs)
    } else {
      generate()
    }
  }, [])

  async function generate() {
    setLoading(true); setError('')
    try {
      const profile = profileStore.get()
      const userData = getAllDataForAI()
      const goal = profile?.primaryGoal || 'self-improvement'
      const identity = profile?.identity || ''
      const prompt = `Based on my profile and data, give me 6–8 specific learning resources (books, podcasts, courses) across the categories most relevant to my goals.
My primary goal: ${goal}
${identity ? `My identity: "${identity}"` : ''}
Choose real, high-quality resources. Spread across categories. Use RECOMMEND tokens for each.`

      const res = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'recommend', message: prompt, userData }),
      })
      const data = await res.json()
      const parsed = parseRecommendations(data.content)
      if (parsed.length > 0) {
        setRecs(parsed)
        saveCachedRecs(parsed)
      } else {
        setError('No picks returned — try refreshing.')
      }
    } catch {
      setError('Oracle unavailable')
    } finally {
      setLoading(false)
    }
  }

  function addRec(rec: Recommendation) {
    onAdd(rec)
    setAdded(prev => new Set([...prev, rec.title]))
  }

  // Group by category
  const categories = [...new Set(recs.map(r => r.category))]

  if (recs.length === 0 && !loading) return (
    <div className="forge-card mb-6">
      <div className="flex items-center justify-between mb-2">
        <p className="forge-label flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-primary" />Oracle Picks</p>
      </div>
      {error && <p className="text-xs text-red-400 mb-2">{error}</p>}
      <Button onClick={generate} size="sm" className="w-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 gap-1.5 text-xs">
        <Sparkles className="w-3.5 h-3.5" />Generate picks for my profile
      </Button>
    </div>
  )

  return (
    <div className="forge-card mb-6">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setExpanded(e => !e)}
          className="forge-label flex items-center gap-1.5 hover:text-foreground transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          Oracle Picks
          <span className="text-[10px] text-muted-foreground/60 font-normal">({recs.length} for you)</span>
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </button>
        <button
          onClick={generate}
          disabled={loading}
          className="text-muted-foreground hover:text-primary transition-colors disabled:opacity-40"
          title="Refresh picks"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground py-3">
          <span className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          Oracle is picking resources for your profile…
        </div>
      )}

      {!loading && expanded && (
        <div className="space-y-4">
          {categories.map(cat => {
            const catRecs = recs.filter(r => r.category === cat)
            const style = CAT_STYLE[cat] ?? { bg: 'bg-zinc-500/10', text: 'text-zinc-400', label: cat }
            return (
              <div key={cat}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                    {style.label}
                  </span>
                </div>
                <div className="space-y-2">
                  {catRecs.map(rec => {
                    const isAdded = added.has(rec.title) || existingTitles.has(rec.title.toLowerCase())
                    const cfg = TYPE_CONFIG[rec.type]
                    return (
                      <div
                        key={rec.title}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                          isAdded ? 'opacity-50 border-border/30' : 'border-border hover:border-primary/30 bg-secondary/30'
                        }`}
                      >
                        <span className="text-base leading-none mt-0.5 flex-shrink-0">{cfg.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold leading-tight">{rec.title}</p>
                          <p className="text-xs text-muted-foreground">{rec.author}</p>
                          <p className="text-[11px] text-muted-foreground/70 mt-1 italic leading-snug">{rec.reason}</p>
                        </div>
                        <button
                          onClick={() => !isAdded && addRec(rec)}
                          disabled={isAdded}
                          className={`flex-shrink-0 mt-0.5 transition-colors ${
                            isAdded ? 'text-green-400 cursor-default' : 'text-muted-foreground hover:text-primary'
                          }`}
                          title={isAdded ? 'Already in your list' : 'Add to my list'}
                        >
                          {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function LearnPage() {
  const [items, setItems]       = useState<LearningItem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState(BLANK_FORM)
  const [activeTab, setActiveTab] = useState<LearningStatus | 'all'>('in-progress')
  const [editing, setEditing]   = useState<string | null>(null)

  const reload = () => setItems(learningStore.getAll())
  useEffect(reload, [])

  function addItem(override?: Partial<typeof BLANK_FORM>) {
    const f = { ...form, ...override }
    if (!f.title.trim()) return
    const item: LearningItem = {
      id: generateId(),
      title: f.title.trim(),
      author: f.author.trim() || undefined,
      type: f.type,
      status: 'backlog',
      progress: 0,
      notes: f.notes.trim() || undefined,
      addedAt: today(),
    }
    learningStore.save(item)
    reload()
    setForm(BLANK_FORM)
    setShowForm(false)
  }

  function addFromRec(rec: { title: string; author: string; type: LearningType }) {
    const item: LearningItem = {
      id: generateId(),
      title: rec.title,
      author: rec.author || undefined,
      type: rec.type,
      status: 'backlog',
      progress: 0,
      addedAt: today(),
    }
    learningStore.save(item)
    reload()
  }

  function updateProgress(id: string, progress: number) {
    const item = items.find(i => i.id === id)
    if (!item) return
    const status: LearningStatus = progress >= 100 ? 'done' : progress > 0 ? 'in-progress' : 'backlog'
    learningStore.save({ ...item, progress, status, completedAt: progress >= 100 && !item.completedAt ? today() : item.completedAt })
    reload()
  }

  function moveToStatus(id: string, status: LearningStatus) {
    const item = items.find(i => i.id === id)
    if (!item) return
    learningStore.save({
      ...item, status,
      progress: status === 'done' ? 100 : status === 'backlog' ? 0 : item.progress,
      completedAt: status === 'done' ? today() : undefined,
      startedAt: status === 'in-progress' && !item.startedAt ? today() : item.startedAt,
    })
    reload()
  }

  const filtered = activeTab === 'all' ? items : items.filter(i => i.status === activeTab)
  const inProgress = items.filter(i => i.status === 'in-progress').length
  const done = items.filter(i => i.status === 'done').length
  const backlog = items.filter(i => i.status === 'backlog').length

  const existingTitles = new Set(items.map(i => i.title.toLowerCase()))

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <p className="forge-label mb-1 flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" />Knowledge</p>
        <h1 className="text-3xl font-bold text-gradient">Learn</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Reading', count: inProgress, color: 'text-primary' },
          { label: 'Done', count: done, color: 'text-green-400' },
          { label: 'Backlog', count: backlog, color: 'text-muted-foreground' },
        ].map(({ label, count, color }) => (
          <div key={label} className="forge-card text-center py-3">
            <div className={`text-2xl font-bold ${color}`}>{count}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Oracle Picks */}
      <OracleRecommendations onAdd={addFromRec} existingTitles={existingTitles} />

      {/* Add form */}
      {!showForm ? (
        <Button
          onClick={() => setShowForm(true)}
          className="w-full mb-5 bg-secondary hover:bg-card text-foreground border border-border gap-2 h-9 text-sm"
        >
          <Plus className="w-4 h-4" />Add manually
        </Button>
      ) : (
        <div className="forge-card mb-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="forge-label">Add resource</span>
            <button onClick={() => { setShowForm(false); setForm(BLANK_FORM) }} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Title"
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
            onKeyDown={e => e.key === 'Enter' && addItem()} />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
              placeholder="Author / source"
              className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as LearningType }))}
              className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground">
              {(Object.keys(TYPE_CONFIG) as LearningType[]).map(t => (
                <option key={t} value={t}>{TYPE_CONFIG[t].emoji} {TYPE_CONFIG[t].label}</option>
              ))}
            </select>
          </div>
          <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            placeholder="Notes (optional)"
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
          <div className="flex gap-2">
            <Button size="sm" onClick={() => addItem()} disabled={!form.title.trim()} className="flex-1 bg-primary text-primary-foreground">Add</Button>
            <Button size="sm" variant="ghost" onClick={() => { setShowForm(false); setForm(BLANK_FORM) }} className="flex-1">Cancel</Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-secondary rounded-xl mb-4">
        {(['in-progress', 'backlog', 'done', 'all'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}>
            {tab === 'all' ? 'All' : STATUS_LABEL[tab as LearningStatus]}
            <span className="ml-1 text-[10px] opacity-60">
              {tab === 'all' ? items.length : items.filter(i => i.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* Items */}
      {filtered.length === 0 ? (
        <div className="forge-card text-center py-12">
          <BookOpen className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-sm font-medium mb-1">Nothing here yet</p>
          <p className="text-xs text-muted-foreground">
            Add from Oracle&apos;s picks above or enter a resource manually.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => {
            const cfg = TYPE_CONFIG[item.type]
            const isEditing = editing === item.id
            return (
              <div key={item.id} className="forge-card space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0 leading-none mt-0.5">{cfg.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold leading-snug">{item.title}</p>
                        {item.author && <p className="text-xs text-muted-foreground">{item.author}</p>}
                      </div>
                      <span className={`text-[10px] font-semibold uppercase tracking-wider flex-shrink-0 ${STATUS_COLOR[item.status]}`}>
                        {STATUS_LABEL[item.status]}
                      </span>
                    </div>

                    {item.status !== 'backlog' && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-muted-foreground">{item.progress}% complete</span>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${item.progress}%`, backgroundColor: item.progress >= 100 ? '#22c55e' : 'oklch(0.705 0.213 47.604)' }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="space-y-2 pt-1 border-t border-border">
                    <ProgressBar value={item.progress} onChange={v => updateProgress(item.id, v)} />
                    <div className="flex gap-1.5">
                      {(['backlog', 'in-progress', 'done'] as LearningStatus[])
                        .filter(s => s !== item.status)
                        .map(s => (
                          <button key={s} onClick={() => { moveToStatus(item.id, s); setEditing(null) }}
                            className={`flex-1 text-[10px] py-1.5 rounded-lg border transition-all ${
                              s === 'done' ? 'border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20' :
                              s === 'in-progress' ? 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/20' :
                              'border-border bg-secondary text-muted-foreground hover:border-primary/20'
                            }`}>
                            → {STATUS_LABEL[s]}
                          </button>
                        ))
                      }
                    </div>
                    {item.notes && <p className="text-xs text-muted-foreground italic">{item.notes}</p>}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1 border-t border-border/50">
                  <button onClick={() => setEditing(isEditing ? null : item.id)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                    {isEditing ? 'Close' : <><ChevronRight className="w-3 h-3" />Update progress</>}
                  </button>
                  {item.status !== 'done' && (
                    <button onClick={() => moveToStatus(item.id, 'done')}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-green-400 transition-colors ml-auto">
                      <CheckCircle2 className="w-3 h-3" />Done
                    </button>
                  )}
                  <button onClick={() => { learningStore.delete(item.id); reload() }}
                    className="text-muted-foreground hover:text-red-400 transition-colors ml-auto">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
