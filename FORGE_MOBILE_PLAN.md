# FORGE — Mobile Plan
**Fase 13 completada:** 2026-05-30

---

## Estrategia: PWA primero, nativa después

**No construir una app nativa ahora.** El coste de desarrollo iOS/Android es 10x el de una PWA y el ROI en etapa pre-€5K MRR no lo justifica.

**Plan:**
1. Fase actual: PWA instalable con experiencia mobile-first (0 coste adicional)
2. En €5K MRR: evaluar React Native (código compartido con Next.js)
3. En €20K MRR: App Store + Google Play si los datos de retención lo justifican

---

## PWA — Implementación completa

### Checklist de installabilidad

```
□ manifest.json con name, short_name, start_url, display: standalone
□ Icons: 192×192 y 512×512 en /public/icons/
□ Service Worker registrado (básico)
□ HTTPS (Vercel lo provee automáticamente)
□ Meta theme-color en <head>
```

### manifest.json (actualizar el existente)

```json
{
  "name": "FORGE — Life OS",
  "short_name": "FORGE",
  "description": "Your personal Life Score. Health × Wealth × Mind × Body.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#f97316",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [],
  "categories": ["health", "productivity", "lifestyle"]
}
```

### Meta tags en layout.tsx

```tsx
// En app/layout.tsx <head>:
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="FORGE" />
<link rel="apple-touch-icon" href="/icons/icon-192.png" />
<meta name="theme-color" content="#f97316" />
```

### Service Worker básico (offline shell)

```javascript
// public/sw.js
const CACHE_NAME = 'forge-v1'
const STATIC_ASSETS = ['/', '/command-center', '/oracle', '/vitals']

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  )
})

self.addEventListener('fetch', event => {
  // Solo cachear GET requests de la app
  if (event.request.method !== 'GET') return
  
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        // No cachear /api/* (Oracle, etc.)
        if (event.request.url.includes('/api/')) return response
        const clone = response.clone()
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
        return response
      })
    }).catch(() => caches.match('/'))
  )
})
```

```typescript
// En layout.tsx o layout-shell.tsx (useEffect):
useEffect(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  }
}, [])
```

---

## Responsive — Breakpoints y ajustes

### Estado actual de la app en breakpoints

| Pantalla | Estado | Problemas |
|----------|--------|-----------|
| Desktop >1280px | ✅ Bien | — |
| Laptop 1024-1280px | ⚠️ Funcional | Sidebar muy ancha, contenido estrecho |
| Tablet 768-1024px | ⚠️ Funcional | Sidebar ocupa demasiado |
| Mobile <768px | ❌ Problemas | Sidebar bloquea, FAB tapa contenido, charts horizontales |

### Fixes de layout

**Layout shell — sidebar responsive:**
```tsx
// Sidebar visible solo en ≥1024px
// En mobile: drawer/sheet que se abre con botón hamburguesa
// Estado: const [mobileNavOpen, setMobileNavOpen] = useState(false)

// Main content:
className={cn(
  "flex-1 min-w-0 overflow-auto",
  "lg:ml-60",  // solo en desktop
  "pb-24"      // espacio para FAB en mobile
)}
```

**Charts — responsivos:**
```tsx
// Usar ResponsiveContainer en todos los charts:
import { ResponsiveContainer } from 'recharts'
<ResponsiveContainer width="100%" height={200}>
  <AreaChart data={data}>...</AreaChart>
</ResponsiveContainer>
```

**Tablas — scroll horizontal en mobile:**
```tsx
<div className="overflow-x-auto">
  <table className="min-w-full">...</table>
</div>
```

---

## Push Notifications — Plan de implementación

### Por qué es crítico

Sin push notifications, la retención Day 7 estimada es ~15-20%. Con ellas: ~35-40%. Es el mayor palanca de retención no implementada.

### Implementación PWA Push (Web Push API)

**Stack necesario:**
- Backend: Web Push API (requiere VAPID keys)
- Frontend: `Notification.requestPermission()`
- Service Worker: maneja las notificaciones entrantes

**Flujo:**
```
1. Usuario acepta notificaciones (settings o prompt contextual)
2. Frontend: navigator.serviceWorker.pushManager.subscribe()
3. Endpoint push se guarda en Supabase (cuando esté)
4. Servidor envía push via web-push npm package
5. Service Worker recibe y muestra la notificación
```

**Notificaciones a implementar (prioridad):**

| Notificación | Trigger | Hora | Texto |
|--------------|---------|------|-------|
| Daily brief | Cada día a las 8am | 08:00 | "Good morning. Your Life Score yesterday: [X]. Today's focus: [top habit]" |
| Streak reminder | Si no ha loggeado en >24h | 20:00 | "You haven't logged today. Don't break your [N]-day streak." |
| Weekly review | Domingo por la tarde | 17:00 | "Your weekly review is ready. Life Score trend: [↑/↓]" |
| Life Score alert | Si cae >15 puntos en un día | Inmediato | "Your Life Score dropped significantly today. Oracle can help you understand why." |

**VAPID keys (generar una vez):**
```bash
npx web-push generate-vapid-keys
# Guardar como env vars:
# NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
# VAPID_PRIVATE_KEY=...
# VAPID_SUBJECT=mailto:marcosags014@gmail.com
```

---

## Apple Health / Google Fit (Fase post-€2K MRR)

**No implementar ahora.** El coste/beneficio solo tiene sentido con usuarios reales que pidan la integración.

**Cuando implementar:**
- Apple HealthKit: Requiere app nativa iOS. Disponible con React Native + react-native-health
- Google Fit API: Disponible vía REST API desde web. Más fácil de implementar primero.
- Oura API: Disponible. Alto valor para el ICP (tech-savvy biohackers)
- Garmin Connect: Disponible. Alto valor para atletas

**Orden de implementación cuando llegue el momento:**
1. Google Fit (web API, sin app nativa)
2. Oura (REST API, alta demanda del ICP)
3. Apple Health (requiere React Native o app nativa)
4. Garmin (nicho más pequeño)

---

## Resumen Fase 13

**Acciones inmediatas (esta semana):**
1. Generar icons 192×192 y 512×512 (CRIT-002)
2. Actualizar manifest.json con los campos faltantes
3. Añadir meta tags Apple en layout.tsx
4. Registrar Service Worker básico

**Acciones Mes 2:**
1. Push notifications (Daily brief + streak reminder)
2. Fix de layout para mobile (<768px)
3. Sidebar como drawer en mobile

**No hacer ahora:** App nativa, Apple HealthKit, Garmin.

**La PWA bien implementada retiene como una app nativa.** Twitter, Instagram y Starbucks tienen más usuarios en PWA que en app nativa en ciertos mercados. Para €0-€5K MRR, la PWA es suficiente.

**→ Fase 14:** `FORGE_AUTOMATION_SYSTEM.md`
