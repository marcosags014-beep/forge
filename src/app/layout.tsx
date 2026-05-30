import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { LayoutShell } from '@/components/layout/layout-shell'
import { Analytics } from '@vercel/analytics/react'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FORGE — Life OS',
  description: 'The all-in-one life OS for people with big ambitions. Track health, fitness, finances, and goals — powered by AI.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'FORGE' },
  openGraph: {
    title: 'FORGE — Life OS',
    description: 'Health · Fitness · Finance · Goals — unified by AI. The only app that sees the connections between every domain of your life.',
    type: 'website',
    siteName: 'FORGE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FORGE — Life OS',
    description: 'Health · Fitness · Finance · Goals — unified by AI.',
  },
}

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}` }} />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <LayoutShell>{children}</LayoutShell>
        <Analytics />
      </body>
    </html>
  )
}
