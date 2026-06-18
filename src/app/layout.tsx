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
        <script dangerouslySetInnerHTML={{ __html: `
// Version check — forces hard reload when a new deploy is detected.
// Uses /api/version which is never cached by service workers.
(function(){
  var STORED = 'forge_build_v';
  fetch('/api/version', {cache:'no-store'})
    .then(function(r){return r.json()})
    .then(function(d){
      var next = d.v;
      var prev = localStorage.getItem(STORED);
      if(prev && prev !== next){
        localStorage.setItem(STORED, next);
        window.location.reload(true);
      } else {
        localStorage.setItem(STORED, next);
      }
    }).catch(function(){});
  // Cleanup any old service workers
  if('serviceWorker' in navigator){
    navigator.serviceWorker.addEventListener('message',function(e){
      if(e.data==='RELOAD') window.location.reload(true);
    });
    navigator.serviceWorker.register('/sw.js').catch(function(){});
    // Unregister all SWs after cleanup completes
    navigator.serviceWorker.getRegistrations().then(function(regs){
      regs.forEach(function(r){ r.unregister(); });
    });
  }
})();
` }} />
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
