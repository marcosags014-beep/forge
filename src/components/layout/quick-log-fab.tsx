'use client'

import { useEffect, useRef, useState } from 'react'
import { Plus, X, Mic, MicOff, Loader2, Check, ArrowRight, Heart, Dumbbell, DollarSign, Save, Camera, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { vitalsStore, workoutsStore, financeStore, nutritionStore, generateId, today, getAllDataForAI } from '@/lib/store'
import { parseCapture, CAPTURE_EMOJI, CAPTURE_COLOR, type CaptureResult } from '@/lib/capture'

type Mode = 'capture' | 'quicklog'
type QuickTab = 'vitals' | 'workout' | 'expense' | 'food'

// Web Speech API types
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean; interimResults: boolean; lang: string
  onresult: (e: SpeechRecognitionEvent) => void
  onerror: () => void; onend: () => void
  start(): void; stop(): void
}
interface SpeechRecognitionEvent extends Event {
  results: { [i: number]: { [i: number]: { transcript: string } }; length: number }
}

function useSpeech(onResult: (text: string) => void) {
  const [listening, setListening] = useState(false)
  const recRef = useRef<SpeechRecognition | null>(null)
  const supported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  function toggle() {
    if (listening) { recRef.current?.stop(); setListening(false); return }
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition
    const rec = new SR()
    rec.lang = 'en-US'; rec.continuous = false; rec.interimResults = false
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const t = e.results[0]?.[0]?.transcript ?? ''
      if (t) onResult(t)
    }
    rec.onerror = () => setListening(false)
    rec.onend = () => setListening(false)
    recRef.current = rec
    rec.start(); setListening(true)
  }

  return { listening, toggle, supported }
}

export function QuickLogFAB() {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<Mode>('capture')
  const [input, setInput] = useState('')
  const [parsed, setParsed] = useState<CaptureResult | null>(null)
  const [askingOracle, setAskingOracle] = useState(false)
  const [oracleReply, setOracleReply] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  // Quick log state
  const [quickTab, setQuickTab] = useState<QuickTab>('vitals')
  const [quickSaved, setQuickSaved] = useState(false)
  const [vForm, setVForm] = useState({ sleep: '7', energy: '7', mood: '7', hrv: '' })
  const [wForm, setWForm] = useState({ name: '', duration: '45' })
  const [eForm, setEForm] = useState<{ amount: string; description: string; category: string; type: 'income' | 'expense' }>({ amount: '', description: '', category: 'Food', type: 'expense' })
  const [foodAnalyzing, setFoodAnalyzing] = useState(false)
  const [foodResult, setFoodResult] = useState<{ foods: string[]; calories: number; protein: number; carbs: number; fat: number } | null>(null)
  const foodInputRef = useRef<HTMLInputElement>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  const { listening, toggle: toggleMic, supported: speechSupported } = useSpeech((text) => {
    setInput(text)
    processInput(text)
  })

  useEffect(() => {
    if (open && mode === 'capture') setTimeout(() => inputRef.current?.focus(), 100)
  }, [open, mode])

  function close() { setOpen(false); setInput(''); setParsed(null); setOracleReply(''); setConfirmed(false) }

  function processInput(text: string) {
    if (!text.trim()) return
    const result = parseCapture(text)
    if (result) {
      setParsed(result)
      setOracleReply('')
    } else {
      // Send to Oracle for interpretation
      sendToOracle(text)
    }
  }

  async function sendToOracle(text: string) {
    setAskingOracle(true)
    setParsed(null)
    try {
      const userData = getAllDataForAI()
      const res = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'brief',
          message: `The user said: "${text}".
Respond with ONLY a JSON object like: {"action":"task"|"goal"|"habit"|"journal"|"none","title":"extracted title or content","reply":"1 sentence response"}
If you can create something, do it. If it's a question or unclear, use "none" and reply normally.`,
          userData,
        }),
      })
      const data = await res.json()
      try {
        const parsed2 = JSON.parse(data.content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())
        setOracleReply(parsed2.reply ?? data.content)
        // If Oracle identified an action, create a parsed result
        if (parsed2.action && parsed2.action !== 'none' && parsed2.title) {
          const { tasksStore, goalsStore, habitsStore, journalStore } = await import('@/lib/store')
          const id = generateId(); const dateStr = today()
          const makeResult: CaptureResult = {
            type: parsed2.action,
            preview: `${parsed2.action === 'task' ? 'Create task' : parsed2.action === 'goal' ? 'Create goal' : parsed2.action === 'habit' ? 'Create habit' : 'Journal'}: "${parsed2.title}"`,
            execute: () => {
              if (parsed2.action === 'task') tasksStore.save({ id, title: parsed2.title, priority: 'medium', completed: false })
              else if (parsed2.action === 'goal') {
                const d = new Date(); d.setMonth(d.getMonth() + 3)
                goalsStore.save({ id, title: parsed2.title, category: 'personal', targetDate: d.toISOString().split('T')[0], status: 'active', progress: 0, milestones: [] })
              } else if (parsed2.action === 'habit') habitsStore.save({ id, name: parsed2.title, category: 'personal', completions: [] })
              else journalStore.save({ id, date: dateStr, content: parsed2.title })
            },
          }
          setParsed(makeResult)
        }
      } catch {
        setOracleReply(data.content)
      }
    } catch {
      setOracleReply('Could not connect to Oracle.')
    } finally {
      setAskingOracle(false)
    }
  }

  function confirm() {
    parsed?.execute()
    setConfirmed(true)
    setTimeout(() => close(), 1400)
  }

  function flashQuick() { setQuickSaved(true); setTimeout(() => { setQuickSaved(false); close() }, 1200) }

  async function analyzeFood(file: File) {
    setFoodAnalyzing(true)
    setFoodResult(null)
    try {
      const img = new Image()
      const url = URL.createObjectURL(file)
      await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = rej; img.src = url })
      URL.revokeObjectURL(url)
      const MAX = 1024
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * ratio); canvas.height = Math.round(img.height * ratio)
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
      const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1]
      const res = await fetch('/api/analyze-food', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageData: base64, mediaType: 'image/jpeg' }) })
      const data = await res.json()
      if (data.calories || data.protein) setFoodResult({ foods: data.foods ?? [], calories: data.calories ?? 0, protein: data.protein ?? 0, carbs: data.carbs ?? 0, fat: data.fat ?? 0 })
    } catch { /* silent */ } finally { setFoodAnalyzing(false) }
  }

  function saveFoodToNutrition() {
    if (!foodResult) return
    const existing = nutritionStore.getLast()
    const base = existing?.date === today() ? existing : null
    nutritionStore.save({ id: generateId(), date: today(), calories: (base?.calories ?? 0) + foodResult.calories, protein: (base?.protein ?? 0) + foodResult.protein, carbs: (base?.carbs ?? 0) + foodResult.carbs, fat: (base?.fat ?? 0) + foodResult.fat, water: base?.water ?? 2, meals: base?.meals ?? [] })
    flashQuick()
  }

  function logVitals() {
    vitalsStore.save({ id: generateId(), date: today(), sleepHours: parseFloat(vForm.sleep) || 7, sleepQuality: 7, hrv: vForm.hrv ? parseFloat(vForm.hrv) : undefined, energy: parseInt(vForm.energy), mood: parseInt(vForm.mood) })
    flashQuick()
  }
  function logWorkout() {
    if (!wForm.name) return
    workoutsStore.save({ id: generateId(), date: today(), duration: parseInt(wForm.duration) || 45, exercises: [], notes: wForm.name })
    flashQuick()
  }
  function logExpense() {
    if (!eForm.amount || !eForm.description) return
    financeStore.save({ id: generateId(), date: today(), amount: parseFloat(eForm.amount), category: eForm.category, type: eForm.type, description: eForm.description })
    flashQuick()
  }

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={close} />}

      {open && (
        <div className="fixed bottom-20 md:bottom-8 left-4 right-4 md:left-auto md:right-8 md:w-96 z-50 bg-card border border-border rounded-2xl shadow-2xl shadow-black/50 animate-in slide-in-from-bottom-6 fade-in duration-200 overflow-hidden">

          {/* Mode switcher */}
          <div className="flex items-center gap-1.5 px-3 py-3 border-b border-border">
            <div className="flex flex-1 gap-1 bg-secondary/50 rounded-xl p-1">
              <button onClick={() => { setMode('capture'); setParsed(null); setOracleReply('') }}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${mode === 'capture' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                🧠 Capture
              </button>
              <button onClick={() => setMode('quicklog')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${mode === 'quicklog' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                ⚡ Quick Log
              </button>
            </div>
            <button onClick={close} className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg transition-colors flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* CAPTURE MODE */}
          {mode === 'capture' && (
            <div className="p-4 space-y-3">
              <p className="text-xs text-muted-foreground">
                Say anything — task, goal, habit, expense, or ask Oracle
              </p>

              <div className="flex gap-2">
                <input ref={inputRef} value={input}
                  onChange={e => { setInput(e.target.value); setParsed(null); setOracleReply('') }}
                  onKeyDown={e => { if (e.key === 'Enter' && input.trim()) processInput(input) }}
                  placeholder={listening ? 'Listening…' : '"Add task: call dentist" or "goal: run 5k"'}
                  className="flex-1 bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/50 placeholder:text-muted-foreground"
                />
                {speechSupported && (
                  <button onClick={toggleMic}
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 transition-all ${listening ? 'bg-red-500/20 border-red-500/30 text-red-400' : 'bg-secondary border-border text-muted-foreground hover:text-primary'}`}>
                    {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                )}
              </div>

              {/* Hint chips */}
              {!parsed && !oracleReply && !askingOracle && !input && (
                <div className="flex flex-wrap gap-1.5">
                  {['task: buy groceries', 'goal: run 5k', 'habit: meditate', 'coffee 3.50'].map(hint => (
                    <button key={hint} onClick={() => { setInput(hint); processInput(hint) }}
                      className="text-[10px] px-2.5 py-1 bg-secondary hover:bg-card border border-border rounded-full text-muted-foreground hover:text-foreground transition-all">
                      {hint}
                    </button>
                  ))}
                </div>
              )}

              {/* Oracle loading */}
              {askingOracle && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  Oracle is thinking…
                </div>
              )}

              {/* Oracle reply */}
              {oracleReply && !parsed && (
                <div className="bg-secondary/50 border border-border rounded-xl p-3 text-sm">
                  <p className="text-muted-foreground leading-relaxed">{oracleReply}</p>
                </div>
              )}

              {/* Parsed result — ready to confirm */}
              {parsed && !confirmed && (
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 space-y-2.5">
                  <div className="flex items-start gap-2">
                    <span className="text-base">{CAPTURE_EMOJI[parsed.type]}</span>
                    <p className={`text-sm font-medium flex-1 ${CAPTURE_COLOR[parsed.type]}`}>{parsed.preview}</p>
                  </div>
                  {oracleReply && <p className="text-xs text-muted-foreground pl-6">{oracleReply}</p>}
                  <button onClick={confirm}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                    <Check className="w-4 h-4" /> Confirm & Save
                  </button>
                  <button onClick={() => { setParsed(null); setOracleReply('') }} className="w-full text-xs text-muted-foreground hover:text-foreground py-1 transition-colors">
                    Edit
                  </button>
                </div>
              )}

              {/* Success */}
              {confirmed && (
                <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                  <Check className="w-4 h-4" /> Saved!
                </div>
              )}

              {/* Process button */}
              {input && !parsed && !askingOracle && !confirmed && (
                <button onClick={() => processInput(input)}
                  className="w-full flex items-center justify-center gap-2 border border-border hover:border-primary/50 rounded-xl py-2.5 text-sm text-muted-foreground hover:text-foreground transition-all">
                  <ArrowRight className="w-4 h-4" /> Process
                </button>
              )}
            </div>
          )}

          {/* QUICK LOG MODE */}
          {mode === 'quicklog' && (
            <div className="p-4 space-y-3">
              <div className="flex gap-1 p-1 bg-secondary rounded-xl">
                {(['vitals', 'workout', 'food', 'expense'] as QuickTab[]).map(t => {
                  const icons: Record<QuickTab, React.ElementType> = { vitals: Heart, workout: Dumbbell, expense: DollarSign, food: Camera }
                  const labels: Record<QuickTab, string> = { vitals: 'Vitals', workout: 'Workout', expense: 'Expense', food: 'Food' }
                  const Icon = icons[t]
                  return (
                    <button key={t} onClick={() => setQuickTab(t)}
                      className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium transition-all ${quickTab === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
                      <Icon className="w-3 h-3" />{labels[t]}
                    </button>
                  )
                })}
              </div>

              {quickTab === 'vitals' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="forge-label block mb-1">Sleep (h)</label>
                      <input type="number" min={0} max={24} step={0.5} value={vForm.sleep} onChange={e => setVForm(f => ({ ...f, sleep: e.target.value }))} className="forge-input" />
                    </div>
                    <div>
                      <label className="forge-label block mb-1">HRV (ms)</label>
                      <input type="number" min={0} placeholder="opt." value={vForm.hrv} onChange={e => setVForm(f => ({ ...f, hrv: e.target.value }))} className="forge-input" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between forge-label mb-1"><span>Energy</span><span className="text-primary">{vForm.energy}</span></div>
                    <input type="range" min={1} max={10} value={vForm.energy} onChange={e => setVForm(f => ({ ...f, energy: e.target.value }))} className="w-full h-1.5 appearance-none cursor-pointer rounded-full" style={{ accentColor: 'oklch(0.705 0.213 47.604)' }} />
                  </div>
                  <div>
                    <div className="flex justify-between forge-label mb-1"><span>Mood</span><span className="text-primary">{vForm.mood}</span></div>
                    <input type="range" min={1} max={10} value={vForm.mood} onChange={e => setVForm(f => ({ ...f, mood: e.target.value }))} className="w-full h-1.5 appearance-none cursor-pointer rounded-full" style={{ accentColor: 'oklch(0.705 0.213 47.604)' }} />
                  </div>
                  <Button onClick={logVitals} size="sm" className="w-full bg-primary text-primary-foreground gap-2">
                    <Save className="w-3.5 h-3.5" />{quickSaved ? '✓ Saved!' : 'Log Vitals'}
                  </Button>
                </div>
              )}

              {quickTab === 'workout' && (
                <div className="space-y-3">
                  <input value={wForm.name} onChange={e => setWForm(f => ({ ...f, name: e.target.value }))} placeholder="Push day, Run 5k, Yoga…" className="forge-input" />
                  <div>
                    <label className="forge-label block mb-1">Duration (min)</label>
                    <input type="number" min={0} value={wForm.duration} onChange={e => setWForm(f => ({ ...f, duration: e.target.value }))} className="forge-input" />
                  </div>
                  <Button onClick={logWorkout} disabled={!wForm.name} size="sm" className="w-full bg-primary text-primary-foreground gap-2">
                    <Save className="w-3.5 h-3.5" />{quickSaved ? '✓ Saved!' : 'Log Workout'}
                  </Button>
                </div>
              )}

              {quickTab === 'food' && (
                <div className="space-y-3">
                  {!foodResult ? (
                    <label className={`w-full flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-dashed transition-all cursor-pointer ${foodAnalyzing ? 'border-primary/30 bg-primary/5' : 'border-border hover:border-primary/40 hover:bg-primary/5'}`}>
                      {foodAnalyzing
                        ? <><RefreshCw className="w-6 h-6 text-primary animate-spin" /><span className="text-xs text-primary font-medium">Analyzing…</span></>
                        : <><Camera className="w-6 h-6 text-primary" /><span className="text-xs font-medium">Take photo or choose from library</span><span className="text-[10px] text-muted-foreground">Macros added automatically</span></>
                      }
                      <input type="file" accept="image/*" className="hidden" ref={foodInputRef}
                        onChange={e => { const f = e.target.files?.[0]; if (f) analyzeFood(f) }} />
                    </label>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 space-y-1.5">
                        <p className="text-xs font-semibold text-green-400">{foodResult.foods.join(', ') || 'Food detected'}</p>
                        <div className="grid grid-cols-4 gap-2 text-center">
                          {[['Cal', foodResult.calories, 'kcal'], ['Protein', foodResult.protein, 'g'], ['Carbs', foodResult.carbs, 'g'], ['Fat', foodResult.fat, 'g']].map(([l, v, u]) => (
                            <div key={String(l)} className="bg-card rounded-lg p-1.5">
                              <div className="text-[9px] text-muted-foreground">{l}</div>
                              <div className="text-xs font-bold">{v}{u}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button onClick={saveFoodToNutrition} size="sm" className="w-full bg-primary text-primary-foreground gap-2">
                        <Save className="w-3.5 h-3.5" />{quickSaved ? '✓ Added to today!' : 'Add to nutrition'}
                      </Button>
                      <button onClick={() => setFoodResult(null)} className="w-full text-xs text-muted-foreground hover:text-foreground py-1 transition-colors">
                        Try another photo
                      </button>
                    </div>
                  )}
                </div>
              )}

              {quickTab === 'expense' && (
                <div className="space-y-3">
                  <div className="flex gap-1 p-1 bg-secondary rounded-lg">
                    {(['expense', 'income'] as const).map(t => (
                      <button key={t} onClick={() => setEForm(f => ({ ...f, type: t }))}
                        className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${eForm.type === t ? (t === 'expense' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400') : 'text-muted-foreground'}`}>
                        {t === 'expense' ? '💸 Expense' : '💰 Income'}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="forge-label block mb-1">Amount (€)</label>
                      <input type="number" min={0} step={0.01} value={eForm.amount} onChange={e => setEForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" className="forge-input" />
                    </div>
                    <div>
                      <label className="forge-label block mb-1">Category</label>
                      <select value={eForm.category} onChange={e => setEForm(f => ({ ...f, category: e.target.value }))} className="forge-input">
                        {['Food', 'Transport', 'Health', 'Fitness', 'Entertainment', 'Rent', 'Utilities', 'Investment', 'Other'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <input value={eForm.description} onChange={e => setEForm(f => ({ ...f, description: e.target.value }))} placeholder="Lunch, gym, Netflix…" className="forge-input" />
                  <Button onClick={logExpense} disabled={!eForm.amount || !eForm.description} size="sm" className="w-full bg-primary text-primary-foreground gap-2">
                    <Save className="w-3.5 h-3.5" />{quickSaved ? '✓ Saved!' : 'Log Transaction'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* FAB */}
      <button onClick={() => setOpen(o => !o)}
        className={`fixed bottom-24 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 ${open ? 'rotate-45' : ''}`}
        style={{ boxShadow: '0 0 0 0 oklch(0.705 0.213 47.604 / 40%), 0 4px 20px oklch(0 0 0 / 40%), 0 0 24px oklch(0.705 0.213 47.604 / 25%)' }}>
        <Plus className="w-6 h-6" />
      </button>
    </>
  )
}
