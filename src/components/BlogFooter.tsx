import Link from 'next/link'
import { Flame } from 'lucide-react'

const relatedLinks = [
  { href: '/blog/accountability-app', label: 'Accountability App' },
  { href: '/blog/consistency-system', label: 'Stay Consistent' },
  { href: '/blog/self-discipline-app', label: 'Self-Discipline App' },
  { href: '/blog/goal-tracking-app', label: 'Goal Tracking App' },
  { href: '/blog/life-planner-app', label: 'Life Planner App' },
  { href: '/blog/personal-development-app', label: 'Personal Development App' },
  { href: '/blog/weekly-review-template', label: 'Weekly Review' },
  { href: '/vs/notion', label: 'FORGE vs Notion' },
  { href: '/vs/habitica', label: 'FORGE vs Habitica' },
  { href: '/vs/ynab', label: 'FORGE vs YNAB' },
  { href: '/vs/obsidian', label: 'FORGE vs Obsidian' },
  { href: '/blog', label: 'All Posts' },
]

export function BlogFooter({ currentHref }: { currentHref?: string }) {
  const links = relatedLinks.filter(l => l.href !== currentHref).slice(0, 6)
  return (
    <footer className="max-w-2xl mx-auto px-6 pb-12">
      <div className="border-t border-zinc-800 pt-8">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center">
            <Flame className="w-3.5 h-3.5 text-black" />
          </div>
          <span className="font-bold text-white text-sm">FORGE</span>
          <span className="text-zinc-500 text-sm">· Life OS</span>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-zinc-600">
          <Link href="/pricing" className="hover:text-zinc-400 transition-colors">Pricing</Link>
          <Link href="/setup" className="hover:text-zinc-400 transition-colors">Get Started Free</Link>
          <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-zinc-400 transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  )
}
