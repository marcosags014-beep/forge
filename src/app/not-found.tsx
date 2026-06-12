import Link from 'next/link'
import { Flame } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="max-w-sm text-center">
        <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Flame className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-4xl font-black text-primary mb-2">404</h1>
        <p className="text-lg font-semibold mb-2">This page doesn&apos;t exist.</p>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          You might be looking for the app, the blog, or the pricing page.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/" className="bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors">
            Open the App
          </Link>
          <Link href="/pricing" className="bg-secondary text-foreground font-semibold py-3 rounded-xl hover:bg-secondary/80 transition-colors">
            See What FORGE Does
          </Link>
          <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
            Browse the Blog
          </Link>
        </div>
      </div>
    </div>
  )
}
