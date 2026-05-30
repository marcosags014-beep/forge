'use client'

import { useEffect, useRef, useState } from 'react'
import { Send, Sparkles, Trash2, User, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { chatStore, generateId, getAllDataForAI, profileStore } from '@/lib/store'
import type { ChatMessage, UserProfile } from '@/lib/types'

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

function OracleMessage({ content }: { content: string }) {
  const lines = content.split('\n')
  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith('## ')) return <h3 key={i} className="font-bold text-base mt-2 first:mt-0">{line.slice(3)}</h3>
        if (line.startsWith('# '))  return <h2 key={i} className="font-bold text-lg mt-2 first:mt-0">{line.slice(2)}</h2>
        if (line.match(/^[-*] /))   return <li key={i} className="flex gap-2 ml-1"><span className="text-primary mt-1.5 flex-shrink-0 text-[8px]">●</span><span><MarkdownLine text={line.slice(2)} /></span></li>
        if (line.trim() === '')      return <div key={i} className="h-1" />
        return <p key={i}><MarkdownLine text={line} /></p>
      })}
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

export default function OraclePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState(AGENT_MODES[0])
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setMessages(chatStore.getMessages())
    setProfile(profileStore.get())
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send() {
    if (!input.trim() || loading) return

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
        }),
      })
      const data = await res.json()
      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: data.content ?? 'I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      }
      chatStore.addMessage(assistantMsg)
      setMessages(prev => [...prev, assistantMsg])
    } catch {
      const errMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: 'Connection error. Make sure your ANTHROPIC_API_KEY is set in .env.local.',
        timestamp: new Date().toISOString(),
      }
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
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <p className="forge-label mb-0.5">AI Intelligence Layer</p>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Oracle
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Agent selector */}
          <div className="flex gap-1 p-1 bg-secondary rounded-lg">
            {AGENT_MODES.map(m => (
              <button key={m.id} onClick={() => setMode(m)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${mode.id === m.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                {m.label}
              </button>
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={clearChat} className="text-muted-foreground hover:text-red-400 gap-1 text-xs">
            <Trash2 className="w-3.5 h-3.5" />Clear
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-hide">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">
                {profile?.name ? `Ready for you, ${profile.name.split(' ')[0]}` : 'Oracle is ready'}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {profile?.primaryGoal
                  ? `Your AI knows your goal: "${profile.primaryGoal}". Start here or ask anything.`
                  : 'Your personal AI with full context of your vitals, fitness, finances, goals, and habits. Ask anything.'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 max-w-md w-full">
              {getDay1Prompts(profile).map(q => (
                <button key={q} onClick={() => { setInput(q); textareaRef.current?.focus() }}
                  className="text-left px-3 py-2 bg-secondary hover:bg-card border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-all">
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
