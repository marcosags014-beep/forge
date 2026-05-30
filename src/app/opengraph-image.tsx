import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'FORGE — Life OS'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#09090b',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Glow */}
        <div style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)',
        }} />

        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 32,
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: '#f97316',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            fontWeight: 900,
            color: '#fff',
          }}>F</div>
          <span style={{ fontSize: 48, fontWeight: 900, color: '#fafafa', letterSpacing: -2 }}>FORGE</span>
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: 28,
          color: '#f97316',
          fontWeight: 700,
          marginBottom: 16,
          letterSpacing: -0.5,
        }}>Life OS for people with big ambitions.</div>

        {/* Sub */}
        <div style={{
          fontSize: 20,
          color: '#71717a',
          textAlign: 'center',
          maxWidth: 700,
          lineHeight: 1.5,
        }}>
          Health · Fitness · Finance · Goals — unified by AI
        </div>

        {/* Domain pills */}
        <div style={{ display: 'flex', gap: 16, marginTop: 48 }}>
          {[
            { label: 'Health', color: '#22c55e' },
            { label: 'Body', color: '#f97316' },
            { label: 'Wealth', color: '#f59e0b' },
            { label: 'Mind', color: '#a78bfa' },
          ].map(({ label, color }) => (
            <div key={label} style={{
              padding: '10px 24px',
              borderRadius: 40,
              border: `1px solid ${color}40`,
              background: `${color}15`,
              color,
              fontSize: 16,
              fontWeight: 700,
            }}>{label}</div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
