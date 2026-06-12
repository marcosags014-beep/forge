'use client'

import { useEffect, useRef, useState } from 'react'
import { Send, Sparkles, Trash2, User, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { chatStore, generateId, getAllDataForAI, profileStore, isProUser, getOracleUsage, incrementOracleUsage, FREE_ORACLE_DAILY, calculateLifeScores, vitalsStore, habitsStore, goalsStore } from '@/lib/store'
import type { ChatMessage, UserProfile } from '@/lib/types'
import { Plus, Check, Target } from 'lucide-react'
import Link from 'next/link'

const AGENT_MODES = [
  { id: 'coach',   label: '🧠 Life Coach',  prompt: 'You are a high-performance life coach. Analyze the user\'s data across health, fitness, finance, and mindset. Give direct, actionable advice like a world-class coach would. No fluff.' },
  { id: 'health',  label: '❤️ Health',       prompt: 'You are a health & biometrics expert. Focus on the user\'s sleep, HRV, energy, and recovery data. Give specific protocols and improvements.' },
  { id: 'fitness', label: '💪 Fitness',      prompt: 'You are a strength & conditioning coach. Analyze workout data, suggest progressive overload, nutrition timing, and recovery optimization.' },
  { id: 'finance', label: '💰 Finance',      prompt: 'You are a personal finance advisor. Analyze spending patterns, suggest budget improvements, and help build wealth systematically.' },
  { id: 'plan',    label: '📋 Planner',      prompt: 'You are a productivity and planning expert. Review goals, habits, and tasks. Help prioritize, eliminate, and create execution plans.' },
]

function MarkdownLine({ text }: { text: string }) {
  const parts: React.ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/^(.*?)\*\*(.+?)\*\*(.*)$/)
    const codeMatch = remaining.match(/^(.*?)`(.+?)`(.*)$/)
    if (boldMatch) {
      if (boldMatch[1]) parts.push(<span key={key++}>{boldMatch[1]}</span>)
      parts.push(<strong key={key++} className="font-semibold text-foreground">{boldMatch[2]}</strong>)
      remaining = boldMatch[3]
    } else if (codeMatch) {
      if (codeMatch[1]) parts.push(<span key={key++}>{codeMatch[1]}</span>)
      parts.push(<code key={key++} className="px-1.5 py-0.5 bg-secondary rounded text-xs font-mono text-primary">{codeMatch[2]}</code>)
      remaining = codeMatch[3]
    } else {
      parts.push(<span key={key++}>{remaining}</span>)
      break
    }
  }
  return <>{parts}</>
}

type OracleAction =
  | { type: 'habit'; name: string; category: 'health' | 'fitness' | 'wealth' | 'mind' }
  | { type: 'goal'; title: string; category: 'health' | 'fitness' | 'finance' | 'career' | 'personal'; months: number }

function parseOracleActions(content: string): { clean: string; actions: OracleAction[] } {
  const actions: OracleAction[] = []
  const habitRe = /\[ADD_HABIT:\s*([^|\]]+?)\s*\|\s*([^\]]+?)\s*\]/g
  const goalRe  = /\[ADD_GOAL:\s*([^|\]]+?)\s*\|\s*([^|\]]+?)\s*\|\s*(\d+)\s*\]/g

  let clean = content
  let m: RegExpExecArray | null

  while ((m = habitRe.exec(content)) !== null) {
    const cat = m[2].trim().toLowerCase()
    const habitCat = (['health','fitness','wealth','mind'].includes(cat) ? cat : 'mind') as 'health' | 'fitness' | 'wealth' | 'mind'
    actions.push({ type: 'habit', name: m[1].trim(), category: habitCat })
  }
  while ((m = goalRe.exec(content)) !== null) {
    const cat = m[2].trim().toLowerCase()
    const goalCat = (['health','fitness','finance','career','personal'].includes(cat) ? cat : 'personal') as 'health' | 'fitness' | 'finance' | 'career' | 'personal'
    actions.push({ type: 'goal', title: m[1].trim(), category: goalCat, months: parseInt(m[3]) || 3 })
  }

  clean = clean.replace(habitRe, '').replace(goalRe, '').replace(/\n{3,}/g, '\n\n').trim()
  return { clean, actions }
}

function ActionButtons({ actions }: { actions: OracleAction[] }) {
  const [added, setAdded] = useState<Set<string>>(new Set())

  if (actions.length === 0) return null

  function addAction(action: OracleAction) {
    const key = action.type + ':' + (action.type === 'habit' ? action.name : action.title)
    if (added.has(key)) return

    if (action.type === 'habit') {
      habitsStore.save({ id: generateId(), name: action.name, category: action.category, completions: [] })
    } else {
      const deadline = new Date()
      deadline.setMonth(deadline.getMonth() + action.months)
      goalsStore.save({ id: generateId(), title: action.title, category: action.category, targetDate: deadline.toISOString().split('T')[0], status: 'active', progress: 0, milestones: [] })
    }
    setAdded(prev => new Set([...prev, key]))
  }

  return (
    <div className="mt-3 flex flex-col gap-2">
      {actions.map(action => {
        const key = action.type + ':' + (action.type === 'habit' ? action.name : action.title)
        const done = added.has(key)
        const label = action.type === 'habit' ? action.name : action.title
        const icon = action.type === 'habit' ? <Plus className="w-3.5 h-3.5" /> : <Target className="w-3.5 h-3.5" />
        const typeLabel = action.type === 'habit' ? 'Add habit' : 'Add goal'
        return (
          <button
            key={key}
            onClick={() => addAction(action)}
            disabled={done}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
              done
                ? 'bg-green-500/10 border-green-500/20 text-green-400 cursor-default'
                : 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20'
            }`}
          >
            {done ? <Check className="w-3.5 h-3.5" /> : icon}
            <span>{done ? 'Added to FORGE' : `${typeLabel}: "${label}"`}</span>
          </button>
        )
      })}
    </div>
  )
}

function OracleMessage({ content }: { content: string }) {
  const { clean, actions } = parseOracleActions(content)
  const lines = clean.split('\n')
  return (
    <div>
      <div className="space-y-1.5 text-sm leading-relaxed">
        {lines.map((line, i) => {
          if (line.startsWith('## ')) return <h3 key={i} className="font-bold text-base mt-2 first:mt-0">{line.slice(3)}</h3>
          if (line.startsWith('# '))  return <h2 key={i} className="font-bold text-lg mt-2 first:mt-0">{line.slice(2)}</h2>
          if (line.match(/^[-*] /))   return <li key={i} className="flex gap-2 ml-1"><span className="text-primary mt-1.5 flex-shrink-0 text-[8px]">●</span><span><MarkdownLine text={line.slice(2)} /></span></li>
          if (line.trim() === '')      return <div key={i} className="h-1" />
          return <p key={i}><MarkdownLine text={line} /></p>
        })}
      </div>
      <ActionButtons actions={actions} />
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-1.5 items-center px-4 py-3">
      {[0, 1, 2].map(i => (
        <div key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  )
}

function getDay1Prompts(profile: UserProfile | null): string[] {
  const goal = profile?.primaryGoal?.toLowerCase() ?? ''
  if (goal.includes('fit') || goal.includes('muscle') || goal.includes('weight') || goal.includes('body')) {
    return [
      'Build me a 4-week workout plan for my goal',
      'What nutrition strategy fits my fitness goal?',
      'How should I track progress in FORGE?',
      'What habits should I start with?',
    ]
  }
  if (goal.includes('financ') || goal.includes('money') || goal.includes('sav') || goal.includes('wealth')) {
    return [
      'Create a budget framework for my goal',
      'What financial habits should I track daily?',
      'How do I build an emergency fund while investing?',
      'What should I log first in FORGE?',
    ]
  }
  if (goal.includes('sleep') || goal.includes('recover') || goal.includes('health') || goal.includes('energy')) {
    return [
      'What sleep protocol should I follow?',
      'How do I improve my HRV and recovery?',
      'Design my morning routine for energy',
      'What vitals should I track daily?',
    ]
  }
  return [
    'What should my focus be today?',
    'Help me set up my first week in FORGE',
    'What\'s the most important metric to track?',
    'Build me a daily routine for my goal',
  ]
}

function getContextualTeaser(): string {
  try {
    const scores = calculateLifeScores()
    const vitals = vitalsStore.getRecent(7)
    const lowestDomain = [
      { label: 'health', score: scores.health.score },
      { label: 'body', score: scores.body.score },
      { label: 'wealth', score: scores.wealth.score },
      { label: 'mind', score: scores.mind.score },
    ].sort((a, b) => a.score - b.score)[0]

    if (vitals.length >= 3) {
      const avgSleep = vitals.reduce((s, v) => s + v.sleepHours, 0) / vitals.length
      if (avgSleep < 6.5) return `Your sleep is averaging ${avgSleep.toFixed(1)}h — Oracle knows exactly what this is doing to your other scores. Unlock the full picture.`
    }
    if (lowestDomain.score < 30) {
      const label = lowestDomain.label.charAt(0).toUpperCase() + lowestDomain.label.slice(1)
      return `Your ${label} score is at ${lowestDomain.score}. Oracle has a specific protocol to bring it up — but it needs more context to give it to you.`
    }
    if (scores.overall >= 70) return `You're at ${scores.overall}/100. Oracle can see the ceiling — and exactly which 2 moves would push you past it.`
    return `Your Life Score is ${scores.overall}/100. Oracle sees the patterns behind this number that you can't see from the data alone.`
  } catch {
    return 'Oracle can see patterns across all your data simultaneously. Upgrade to ask unlimited questions.'
  }
}

function UpgradeModal({ used, onClose }: { used: number; onClose: () => void }) {
  const teaser = getContextualTeaser()
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
        <div className="text-center mb-5">
          <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <h3 className="font-bold text-lg mb-1">Daily limit reached</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {teaser}
          </p>
        </div>
        <div className="space-y-2 text-sm mb-5 p-3 bg-secondary/50 rounded-xl">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">Pro unlocks</div>
          {['Unlimited Oracle messages', 'AI Morning Brief — proactive daily insight', 'AI Weekly Performance Review', 'Cross-domain pattern detection'].map(f => (
            <div key={f} className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              </div>
              <span>{f}</span>
            </div>
          ))}
        </div>
        <Link href="/pricing" className="block w-full bg-primary text-primary-foreground text-center py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 mb-2">
          Start 7-Day Free Trial — €0 today
        </Link>
        <p className="text-center text-[10px] text-muted-foreground mb-2">Used {used}/{FREE_ORACLE_DAILY} free messages today</p>
        <button onClick={onClose} className="w-full text-xs text-muted-foreground hover:text-foreground py-1.5 transition-colors">
          Continue tomorrow (resets at midnight)
        </button>
      </div>
    </div>
  )
}

export default function OraclePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState(AGENT_MODES[0])
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [oracleUsed, setOracleUsed] = useState(0)
  const [isPro, setIsPro] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setMessages(chatStore.getMessages())
    setProfile(profileStore.get())
    setOracleUsed(getOracleUsage().count)
    setIsPro(isProUser())
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send() {
    if (!input.trim() || loading) return

    // Check daily limit for free users
    if (!isPro) {
      const usage = getOracleUsage()
      if (usage.count >= FREE_ORACLE_DAILY) {
        setShowUpgrade(true)
        return
      }
    }

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }
    chatStore.addMessage(userMsg)
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const userData = getAllDataForAI()
      const res = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'chat',
          agentPrompt: mode.prompt,
          message: input.trim(),
          history: newMessages.slice(-10).map(m => ({ role: m.role, content: m.content })),
          userData,
          stream: true,
        }),
      })

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({ content: 'Oracle is temporarily unavailable. Please try again.' }))
        const errMsg: ChatMessage = { id: generateId(), role: 'assistant', content: data.content, timestamp: new Date().toISOString() }
        chatStore.addMessage(errMsg)
        setMessages(prev => [...prev, errMsg])
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''
      const assistantId = generateId()
      const timestamp = new Date().toISOString()
      let firstChunk = true

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })

        if (firstChunk) {
          firstChunk = false
          setLoading(false)
          setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: accumulated, timestamp }])
        } else {
          setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: accumulated } : m))
        }
      }

      const finalContent = accumulated || 'Oracle encountered an error. Please try again.'
      if (firstChunk) {
        // Stream returned nothing — show error
        const errMsg: ChatMessage = { id: generateId(), role: 'assistant', content: finalContent, timestamp: new Date().toISOString() }
        chatStore.addMessage(errMsg)
        setMessages(prev => [...prev, errMsg])
      } else {
        chatStore.addMessage({ id: assistantId, role: 'assistant', content: finalContent, timestamp })
        if (!isPro) {
          incrementOracleUsage()
          setOracleUsed(prev => prev + 1)
        }
      }
    } catch {
      const errMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: 'Connection error. Please try again.',
        timestamp: new Date().toISOString(),
      }
      chatStore.addMessage(errMsg)
      setMessages(prev => [...prev, errMsg])
    } finally {
      setLoading(false)
    }
  }

  function clearChat() {
    chatStore.clear()
    setMessages([])
  }

  return (
    <div className="flex flex-col h-screen">
      {showUpgrade && <UpgradeModal used={oracleUsed} onClose={() => setShowUpgrade(false)} />}

      {/* Header */}
      <div className="border-b border-border">
        <div className="flex items-center justify-between px-6 pt-4 pb-3">
          <div>
            <p className="forge-label mb-0.5"><Sparkles className="w-3 h-3" />AI Intelligence Layer</p>
            <h1 className="text-xl font-bold text-gradient-primary">Oracle</h1>
          </div>
          <div className="flex items-center gap-2">
            {isPro ? (
              <span className="text-[10px] font-bold px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full">PRO</span>
            ) : (
              <button onClick={() => setShowUpgrade(true)}
                className={`text-[10px] font-medium px-2.5 py-1 rounded-full border transition-colors ${
                  oracleUsed >= FREE_ORACLE_DAILY
                    ? 'bg-red-500/10 text-red-400 border-red-500/20'
                    : oracleUsed >= FREE_ORACLE_DAILY * 0.7
                    ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    : 'bg-secondary text-muted-foreground border-border'
                }`}>
                {FREE_ORACLE_DAILY - oracleUsed} left today
              </button>
            )}
            <Button variant="ghost" size="sm" onClick={clearChat} className="text-muted-foreground hover:text-red-400 gap-1 text-xs h-7">
              <Trash2 className="w-3 h-3" />Clear
            </Button>
          </div>
        </div>
        {/* Agent selector — full width sub-row */}
        <div className="px-4 pb-3 overflow-x-auto scrollbar-hide">
          <div className="forge-tabs w-fit min-w-full">
            {AGENT_MODES.map(m => (
              <button key={m.id} onClick={() => setMode(m)}
                className={`forge-tab whitespace-nowrap flex-1 ${mode.id === m.id ? 'forge-tab-active' : ''}`}>
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-hide">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-5 text-center py-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl animate-glow" />
              <div className="relative w-20 h-20 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center"
                style={{ boxShadow: '0 0 32px oklch(0.705 0.213 47.604 / 15%)' }}>
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-1.5 text-gradient-primary">
                {profile?.name ? `Ready for you, ${profile.name.split(' ')[0]}` : 'Oracle is ready'}
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                {profile?.primaryGoal
                  ? `Your AI knows your goal: "${profile.primaryGoal}". Start here or ask anything.`
                  : 'Your personal AI with full context of your vitals, fitness, finances, goals, and habits.'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 max-w-md w-full">
              {getDay1Prompts(profile).map(q => (
                <button key={q} onClick={() => { setInput(q); textareaRef.current?.focus() }}
                  className="text-left px-3 py-2.5 bg-secondary hover:bg-card border border-border hover:border-primary/20 rounded-xl text-xs text-muted-foreground hover:text-foreground transition-all leading-relaxed">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary' : 'bg-secondary border border-border'}`}>
              {msg.role === 'user'
                ? <User className="w-4 h-4 text-primary-foreground" />
                : <Bot className="w-4 h-4 text-muted-foreground" />
              }
            </div>
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-tr-sm text-sm leading-relaxed'
                : 'bg-card border border-border rounded-tl-sm'
            }`}>
              {msg.role === 'user'
                ? msg.content
                : <OracleMessage content={msg.content} />
              }
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-tl-sm">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-border">
        <div className="flex gap-3 items-end">
          <div className="flex-1 bg-secondary border border-border rounded-2xl overflow-hidden focus-within:border-primary/50 transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder={`Ask ${mode.label} anything…`}
              rows={1}
              className="w-full bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none max-h-32"
              style={{ minHeight: '44px' }}
            />
          </div>
          <Button onClick={send} disabled={loading || !input.trim()}
            className="bg-primary text-primary-foreground w-11 h-11 rounded-2xl p-0 flex-shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          Oracle has full context of your data · Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
