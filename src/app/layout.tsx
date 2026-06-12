import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { LayoutShell } from '@/components/layout/layout-shell'
import { Analytics } from '@vercel/analytics/react'
import { SyncProvider } from '@/components/SyncProvider'
import { PostHogProvider } from '@/components/PostHogProvider'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://forge-five-flax.vercel.app'),
  title: 'FORGE — Stop Deciding. Just Do.',
  description: 'One dashboard for health, body, money, and goals. The AI tells you what to focus on today. Free. No account. Data stays on your device.',
  manifest: '/manifest.json',
  keywords: ['life os', 'accountability app', 'habit tracker', 'hrv tracking', 'personal finance app', 'goal tracker', 'decision fatigue', 'alignment score'],
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'FORGE' },
  openGraph: {
    title: 'FORGE — Stop Deciding. Just Do.',
    description: 'One dashboard for health, body, money, and goals. AI tells you what to focus on. You just execute.',
    type: 'website',
    siteName: 'FORGE',
    url: 'https://forge-five-flax.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FORGE — Stop Deciding. Just Do.',
    description: 'One dashboard for health, body, money, and goals. AI tells you what to focus on. Free.',
    creator: '@forgelifeos',
  },
  alternates: {
    canonical: 'https://forge-five-flax.vercel.app',
  },
}

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}` }} />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <PostHogProvider>
          <SyncProvider />
          <LayoutShell>{children}</LayoutShell>
          <Analytics />
        </PostHogProvider>
      </body>
    </html>
  )
}
