'use client'

import { useEffect, useState } from 'react'
import { getDailyQuote, shouldShowDailyQuote, markQuoteShown } from '@/lib/quotes'
import type { DailyQuote } from '@/lib/quotes'

const CATEGORY_COLORS: Record<string, string> = {
  warrior:    'text-red-400',
  stoic:      'text-blue-400',
  discipline: 'text-orange-400',
  identity:   'text-purple-400',
  time:       'text-yellow-400',
  fire:       'text-primary',
}

const CATEGORY_LABELS: Record<string, string> = {
  warrior:    'WARRIOR',
  stoic:      'STOIC',
  discipline: 'DISCIPLINE',
  identity:   'IDENTITY',
  time:       'TIME',
  fire:       'FIRE',
}

interface Props {
  onReplay?: boolean   // true = force open
  onClose?: () => void // called when user dismisses a forced replay
}

export default function DailyQuoteModal({ onReplay = false, onClose }: Props) {
  const [quote, setQuote] = useState<DailyQuote | null>(null)
  const [visible, setVisible] = useState(false)
  const [animOut, setAnimOut] = useState(false)
  const [isReplay, setIsReplay] = useState(false)

  // Show once per day on first visit
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (shouldShowDailyQuote()) {
      setQuote(getDailyQuote())
      setVisible(true)
      setIsReplay(false)
    }
  }, [])

  // Re-open when parent requests a replay
  useEffect(() => {
    if (!onReplay) return
    setQuote(getDailyQuote())
    setAnimOut(false)
    setVisible(true)
    setIsReplay(true)
  }, [onReplay])

  function dismiss() {
    setAnimOut(true)
    if (!isReplay) markQuoteShown()
    setTimeout(() => {
      setVisible(false)
      setAnimOut(false)
      if (isReplay) onClose?.()
    }, 300)
  }

  if (!visible || !quote) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 transition-opacity duration-300 ${animOut ? 'opacity-0' : 'opacity-100'}`}
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}
      onClick={dismiss}
    >
      <div
        className={`max-w-lg w-full flex flex-col items-center text-center gap-6 transition-all duration-300 ${animOut ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
        onClick={e => e.stopPropagation()}
      >
        <span className={`text-[10px] font-bold tracking-[0.25em] uppercase ${CATEGORY_COLORS[quote.category] ?? 'text-primary'}`}>
          {CATEGORY_LABELS[quote.category] ?? quote.category.toUpperCase()}
        </span>

        <blockquote className="text-xl md:text-2xl font-semibold leading-relaxed text-foreground">
          &ldquo;{quote.text}&rdquo;
        </blockquote>

        <p className="text-sm text-muted-foreground font-medium tracking-wide">
          — {quote.author}
        </p>

        <div className="w-16 h-px bg-border" />

        <button
          onClick={dismiss}
          className="px-8 py-3 rounded-xl text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          {isReplay ? 'Close' : 'Begin your day'}
        </button>

        <p className="text-[10px] text-muted-foreground/50">Tap anywhere to dismiss</p>
      </div>
    </div>
  )
}
