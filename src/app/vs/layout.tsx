import Link from 'next/link'
import { Flame } from 'lucide-react'

function VsFooter() {
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
        <p className="text-xs text-zinc-500 mb-4">More comparisons:</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6">
          <Link href="/vs/notion" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">vs Notion</Link>
          <Link href="/vs/habitica" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">vs Habitica</Link>
          <Link href="/vs/ynab" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">vs YNAB</Link>
          <Link href="/vs/apple-health" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">vs Apple Health</Link>
          <Link href="/vs/myfitnesspal" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">vs MyFitnessPal</Link>
          <Link href="/vs/strong-app" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">vs Strong App</Link>
          <Link href="/vs/strava" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">vs Strava</Link>
          <Link href="/vs/obsidian" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">vs Obsidian</Link>
          <Link href="/blog" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">All Articles</Link>
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

export default function VsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <VsFooter />
    </>
  )
}
