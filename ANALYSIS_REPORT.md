# FORGE Life OS — Technical Analysis Report

**Date:** 2026-05-30  
**Auditor:** Claude Code (Sonnet 4.6)  
**Target:** http://localhost:3001  
**Codebase:** /Users/marcosgil/forge

---

## 1. Stack Tecnológico

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js | 26.0.0 |
| Framework | Next.js | 16.2.6 |
| UI Library | React | 19.2.4 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | v4 |
| Components | shadcn/ui + Base UI | custom |
| Charts | Recharts | ^3.8.1 |
| AI | Anthropic SDK (Claude) | ^0.100.1 |
| Date utils | date-fns | ^4.3.0 |
| Icons | lucide-react | ^1.17.0 |
| Persistence | localStorage | — |
| Fonts | Geist, Geist Mono | Google Fonts |
| PWA | Web App Manifest | — |

---

## 2. Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                    BROWSER                          │
│                                                     │
│  React 19 + Next.js App Router (all 'use client')  │
│                    │                                │
│         localStorage (forge_* keys)                 │
│   vitals / workouts / nutrition / body / finance    │
│   goals / habits / tasks / chat / journal /         │
│   achievements / profile                           │
└────────────────────┬────────────────────────────────┘
                     │ fetch POST
                     ▼
┌─────────────────────────────────────────────────────┐
│             Next.js API Route                       │
│         /api/oracle → route.ts                      │
│              │                                      │
│         Anthropic SDK                               │
│         claude-sonnet-4-6                           │
└─────────────────────────────────────────────────────┘
```

**Patrón predominante:** SPA con persistencia en localStorage. No hay base de datos, no hay sesiones de servidor, no hay autenticación. Todo el estado vive en el cliente. El único servidor es el endpoint `/api/oracle` que proxea peticiones a la API de Anthropic.

---

## 3. Estructura de Rutas

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/` | `app/page.tsx` (255 líneas) | Command Center — Life Score ring, dominio pills, insights flash, tareas, hábitos, morning brief |
| `/vitals` | `app/vitals/page.tsx` (221 líneas) | Logging de sueño, HRV, RHR, energía, humor + gráficas 14 días |
| `/body` | `app/body/page.tsx` (326 líneas) | 3 tabs: Workout logger, Nutrición, Peso corporal |
| `/wealth` | `app/wealth/page.tsx` (306 líneas) | Transacciones, pie chart categorías, cash flow, proyecciones compound |
| `/mind` | `app/mind/page.tsx` (426 líneas) | 4 tabs: Hábitos (grid 7d), Tareas, Metas, Logros |
| `/insights` | `app/insights/page.tsx` (299 líneas) | Motor de insights, scatter sleep/mood, AI deep analysis, mental health banner |
| `/journal` | `app/journal/page.tsx` (186 líneas) | Diario diario + mood slider + Oracle reflection + prompts |
| `/review` | `app/review/page.tsx` (257 líneas) | Weekly review con radar chart, AI narrative |
| `/oracle` | `app/oracle/page.tsx` (214 líneas) | Chat AI con 5 modos de agente |
| `/setup` | `app/setup/page.tsx` (255 líneas) | Wizard onboarding 5 pasos |
| `/settings` | `app/settings/page.tsx` (207 líneas) | Perfil, export JSON, reset, notificaciones UI |
| `/pricing` | `app/pricing/page.tsx` (231 líneas) | Landing page marketing + tiers de precio |
| `/api/oracle` | `app/api/oracle/route.ts` | Único endpoint — proxy a Anthropic API |

**Total páginas:** 12 + 1 API route  
**Total archivos TS/TSX:** 30  
**Total líneas de código:** ~4,850

---

## 4. Componentes

### Layout (3 componentes)
- `LayoutShell` — conditional sidebar + mobile nav + QuickLogFAB
- `Sidebar` — navegación desktop/mobile con Life Score chip, animate-glow logo
- `QuickLogFAB` — FAB flotante para quick-log de vitals/workout/expense

### shadcn/ui Components (7)
`Button`, `Badge`, `Avatar`, `Card`, `Progress`, `ScrollArea`, `Separator`, `Tabs`

### Inline Components (notable)
- `LifeScoreRing` — SVG radial con animación CSS (page.tsx)
- `DomainPill` — 4 pills health/body/wealth/mind con trend arrows
- `InsightCardUI` — insight cards con dismiss y severity styling
- `MentalHealthBanner` — expandable crisis resources
- `CorrelationChart` — scatter sleep vs mood con Pearson r
- `AchievementsPanel` — grid locked/unlocked con animate-unlock

---

## 5. Dependencias

### Producción (13)
```
@anthropic-ai/sdk ^0.100.1    — AI API
@base-ui/react   ^1.5.0       — ⚠ INSTALADO, NO USADO
better-sqlite3   ^12.10.0     — ⚠ INSTALADO, NO USADO (datos en localStorage)
class-variance-authority       — CVA para variantes shadcn
clsx             ^2.1.1       — className utils
date-fns         ^4.3.0       — format, subDays
lucide-react     ^1.17.0      — iconos
next             16.2.6       — framework
react            19.2.4       — UI
react-dom        19.2.4       — DOM
recharts         ^3.8.1       — gráficas
shadcn           ^4.8.3       — CLI componentes
tailwind-merge   ^3.6.0       — twMerge
tw-animate-css   ^1.4.0       — animaciones CSS
```

### Dependencias muertas (desperdicio de bundle)
- `@base-ui/react` — no se usa en ningún archivo
- `better-sqlite3` + `@types/better-sqlite3` — no se usa, todos los datos están en localStorage
- `LineChart` importado en wealth pero reemplazado por `AreaChart`

---

## 6. Consumo de Recursos

### Proceso activo
```
PID 57815  next-server (v16.2.6)   RSS: ~9.7 MB
PID 57814  node (next dev)          RSS: ~1.6 MB
Total: ~11 MB RAM en dev mode
```

### Disco
```
node_modules/   698 MB
.next/          752 MB (caché dev + builds previos)
src/            ~170 KB código fuente
```

### Análisis
- **Dev mode es pesado:** `.next` de 752MB es normal en desarrollo. En producción (`next build`) sería ~15-30MB.
- **RAM es eficiente:** 11MB es excelente para un Next.js en dev mode.
- **localStorage:** sin límite de datos implementado. Los browsers imponen ~5-10MB por origen. Con uso intenso, se puede acercar al límite.

---

## 7. Problemas Detectados

### 🔴 Críticos

**P1 — Sin rate limiting en /api/oracle**  
Cualquier cliente puede hacer peticiones ilimitadas. Un bucle de requests vaciaría el crédito de Anthropic en minutos.
```typescript
// route.ts no tiene rate limiting, CORS, ni validación de origin
export async function POST(req: Request) {
  const body = await req.json() // sin validación de tamaño
```

**P2 — API key expuesta en contexto de build**  
`ANTHROPIC_API_KEY` en `.env.local` es correcto para Next.js server-side. El riesgo es que si alguien convierte este proyecto a una app estática o comete el `.env.local`, la key queda expuesta. `.gitignore` ya protege `.env*` correctamente.

**P3 — Sin error boundaries**  
Ninguna página tiene `<ErrorBoundary>`. Un error en `calculateLifeScores()` o `generateInsights()` tira toda la UI sin mensaje útil.

**P4 — PWA icons no existen**  
`manifest.json` referencia `/icons/icon-192.png` y `/icons/icon-512.png`. Estos archivos no están en `/public/icons/`. La PWA no puede instalarse correctamente.

### 🟡 Importantes

**P5 — localStorage crece sin límite**  
`workoutsStore.save()` y `financeStore.save()` hacen `unshift` sin cap. Con un año de uso diario, `forge_vitals` puede superar 1MB solo, aproximándose al límite del navegador.

**P6 — Dependencias muertas en bundle**  
`@base-ui/react` y `better-sqlite3` suman ~2MB al `node_modules` innecesariamente. En producción, Next.js tree-shakes bien, pero aumentan tiempo de install y superficie de vulnerabilidades.

**P7 — store.ts lee localStorage en cada llamada**  
Cada `getStore()` hace `JSON.parse(localStorage.getItem(...))`. En `calculateLifeScores()`, esto ocurre 6+ veces por render. En páginas con múltiples componentes leyendo el store simultáneamente, esto es costoso.

**P8 — `getAllDataForAI()` ejecuta `calculateLifeScores()` y `generateInsights()` de nuevo**  
Cuando Oracle recibe contexto, recalcula todo en el cliente. Si ya se calculó para renderizar la UI, es trabajo duplicado.

**P9 — Sin página 404 personalizada**  
Rutas inválidas muestran el 404 genérico de Next.js, fuera del diseño de FORGE.

**P10 — `LineChart` importado pero no usado en wealth/page.tsx**  
Importación muerta que puede confundir y añade al bundle si no hay tree-shaking correcto.

### 🟢 Menores

**P11 — `WorkoutEntry` no tiene campo `name`**  
El QuickLogFAB usa `notes` para guardar el nombre del workout, solución workaround que rompe la intención del tipo.

**P12 — `VitalEntry` tiene `hrv` y `rhr` requeridos**  
El QuickLogFAB guarda `hrv: 0` y `rhr: 0` cuando no se introduce. Contamina el historial con datos inválidos que afectan `calculateReadiness()`.

**P13 — `ruv-swarm --version` cuelga**  
Verificado durante el setup del AI Stack. El binario entra en loop al inicializar SQLite sin timeout. Ya hay workaround implementado en `healthcheck_ai_stack.sh`.

---

## 8. Oportunidades de Optimización

### Performance

**O1 — Cachear resultados del store en memoria**
```typescript
// Actual: lee localStorage en cada llamada
export const vitalsStore = {
  getAll: () => getStore<VitalEntry>('vitals'), // JSON.parse cada vez
}

// Propuesta: cache in-memory con invalidación
const cache = new Map<string, unknown>()
function getStore<T>(key: string): T[] {
  if (cache.has(key)) return cache.get(key) as T[]
  const data = localStorage.getItem(`forge_${key}`)
  const parsed = data ? JSON.parse(data) : []
  cache.set(key, parsed)
  return parsed
}
function setStore<T>(key: string, data: T[]): void {
  cache.set(key, data)
  localStorage.setItem(`forge_${key}`, JSON.stringify(data))
}
```
Impacto: reducción ~60% de `JSON.parse` calls en páginas complejas como Command Center.

**O2 — useMemo en cálculos pesados**  
`calculateLifeScores()` y `generateInsights()` deben memoizarse. Actualmente se recalculan en cada render que los llama.

**O3 — Limitar historial de localStorage**  
Cap de 365 entradas para vitals, 500 para transactions:
```typescript
save: (entry: VitalEntry) => {
  const all = getStore<VitalEntry>('vitals').slice(0, 365) // nunca más de 1 año
  ...
}
```

**O4 — Rate limiting en API Oracle**  
```typescript
// Simple in-memory rate limit (reinicia con cada deploy)
const rateLimits = new Map<string, number[]>()
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'local'
  const now = Date.now()
  const calls = (rateLimits.get(ip) ?? []).filter(t => now - t < 60_000)
  if (calls.length >= 20) return Response.json({ content: 'Rate limit exceeded' }, { status: 429 })
  rateLimits.set(ip, [...calls, now])
  ...
}
```

**O5 — Request body size limit en Oracle**  
`userData` puede crecer mucho. Añadir límite:
```typescript
const bodyText = await req.text()
if (bodyText.length > 50_000) return Response.json({ content: 'Payload too large' }, { status: 413 })
```

### Bundle

**O6 — Eliminar dependencias muertas**
```bash
npm uninstall @base-ui/react better-sqlite3 @types/better-sqlite3
```
Ahorra ~2MB en node_modules, reduce superficie de CVEs.

**O7 — Eliminar import muerto en wealth/page.tsx**
```typescript
// Quitar LineChart del import de recharts (no se usa)
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, AreaChart, Area, CartesianGrid } from 'recharts'
```

### UX/Arquitectura

**O8 — Añadir Error Boundary global**  
Un wrapper en `layout-shell.tsx` evitaría pantallas blancas ante errores de store.

**O9 — Crear /public/icons/** con los PNGs del PWA**  
Necesario para instalación de PWA real en iOS/Android.

**O10 — Añadir `name` a `WorkoutEntry` en types.ts**  
Soluciona el hack del QuickLogFAB y permite mostrar nombres de workouts en historial.

**O11 — Hacer `hrv` y `rhr` opcionales en `VitalEntry`**  
```typescript
hrv?: number   // opcional — no todos tienen wearable
rhr?: number   // opcional
```
Evita contaminar cálculos con ceros falsos.

---

## 9. Calidad del Código

### Puntos positivos ✓
- **TypeScript strict mode** activado — `noEmit: true`, `strict: true`
- **0 errores de compilación** en TSC
- **Sin dangerouslySetInnerHTML** ni `eval()` — sin vectores XSS
- **API key nunca expuesta al cliente** — solo usada en route.ts server-side
- **Separación limpia** store/types/utils en `/lib`
- **Componentes pequeños y enfocados** — páginas bien estructuradas, sin god components
- **Nombres descriptivos** — `calculateReadiness`, `getDailyCall`, `generateInsights`
- **Gestión de estado simple** — `useState` + localStorage es adecuado para el scope

### Puntos negativos ✗
- **Toda la app es `'use client'`** — no hay RSC (React Server Components). Impide pre-rendering, aumenta JS inicial enviado al cliente
- **Lógica de negocio mezclada con UI** — `calculateLifeScores()` y `generateInsights()` viven en `store.ts` junto al CRUD. Deberían separarse en `/lib/scoring.ts` y `/lib/insights.ts`
- **store.ts tiene 543 líneas** — demasiado responsabilidades en un archivo
- **Sin tests** — ni unitarios ni de integración. Los cálculos de Life Score y insights no tienen cobertura
- **Inline components definidos dentro de la función del módulo** — e.g. `CorrelationChart` en `insights/page.tsx`, `Section` en `settings/page.tsx`. Mejor exportarlos o moverlos arriba del archivo
- **`as const` cast innecesarios** en algunos lugares donde TypeScript infiere correctamente

### Métricas de complejidad
| Archivo | Líneas | Complejidad |
|---------|--------|-------------|
| `store.ts` | 543 | Alta — 12 stores + scoring + insights + achievements |
| `mind/page.tsx` | 426 | Media-alta — 4 tabs + achievements + habits grid |
| `body/page.tsx` | 326 | Media — 3 tabs + 3 formularios |
| `wealth/page.tsx` | 306 | Media — charts + proyecciones + formulario |
| `insights/page.tsx` | 299 | Media — mental health detection + scatter + AI |

---

## 10. Seguridad

| Vector | Estado | Riesgo |
|--------|--------|--------|
| XSS | ✅ Seguro | Sin `dangerouslySetInnerHTML`, sin `eval()` |
| SQL injection | ✅ N/A | Sin base de datos SQL |
| API key exposición (cliente) | ✅ Seguro | Key solo en server-side route.ts |
| API key en git | ✅ Protegido | `.gitignore` excluye `.env*` |
| Rate limiting | ❌ Ausente | Cualquiera puede llamar /api/oracle sin límite |
| Input validation | ⚠️ Parcial | Números se parsean con `parseFloat/parseInt` sin sanitizar |
| CORS | ⚠️ Default Next.js | Sin restricción de origen explícita en /api/oracle |
| Data privacy | ✅ Diseño correcto | Todo en localStorage del usuario, nada sube a servidor |
| Payload injection en AI | ⚠️ Posible | El campo `message` va directamente al prompt de Claude sin sanitización |
| PWA service worker | ✅ N/A | No hay SW registrado — no hay riesgo de SW malicioso |

---

## 11. Experiencia de Usuario

### Fortalezas ✓
- **Diseño dark cohesivo** — paleta naranja/gris oscura consistente, bien ejecutada
- **Mobile-first** — hamburger menu, mobile top bar, FAB posicionado correctamente
- **Quick Log FAB** — acceso rápido desde cualquier página sin perder contexto
- **Onboarding completo** — wizard de 5 pasos, redirige si no hay perfil
- **Feedback visual** — estados "Saved!", animaciones `fade-in`, `slide-in-from-bottom`
- **Life Score ring** — visualización inmediata del estado general, color-coded
- **Insights accionables** — cada insight tiene un link directo a la acción relevante
- **Mental health safety** — detección de crisis sin claims médicos, recursos inline
- **Data export** — usuario puede llevarse todos sus datos como JSON

### Debilidades ✗
- **Sin loading states** entre navegación de páginas — el contenido aparece sin skeleton
- **Sin modo offline** — no hay service worker, app no funciona sin internet (Oracle)
- **PWA no instalable** — icons PNG faltan en `/public/icons/`
- **Notifications UI no funcional** — los toggles en Settings son solo UI, sin lógica real
- **Sin feedback de errores al usuario** — si Oracle falla, el mensaje es genérico
- **Setup no protegido** — si el usuario borra la cookie/localStorage, vuelve al setup sin aviso
- **Sin paginación** en historial de transacciones — muestra las últimas 20, el resto invisible
- **ruv-swarm / hermes no integrados en la UI** — capacidades de AI externa no aprovechadas

---

## 12. Resumen Ejecutivo

**FORGE es una SPA bien diseñada y funcionalmente completa** para un MVP. El código es limpio, TypeScript está correctamente configurado, y la arquitectura localStorage-only es una decisión pragmática válida para este stage.

### Lo que funciona bien
- UI/UX consistente y pulida
- Lógica de Life Score y dominio scoring es sólida
- Integración con Claude API es correcta y bien estructurada
- Diseño de tipos en `types.ts` es adecuado

### Lo crítico a resolver antes de producción

| Prioridad | Acción | Impacto |
|-----------|--------|---------|
| 🔴 P1 | Añadir rate limiting a `/api/oracle` | Protección económica |
| 🔴 P4 | Crear `/public/icons/` para PWA | PWA instalable en móvil |
| 🟡 P5 | Cap localStorage a 365 entradas | Evitar crash por quota |
| 🟡 P6 | `npm uninstall` deps muertas | Limpieza + seguridad |
| 🟡 P11 | Añadir `name` a `WorkoutEntry` | Integridad de datos |
| 🟡 P12 | Hacer `hrv`/`rhr` opcionales | Datos de calidad |
| 🟢 O1 | Cache in-memory del store | Performance |
| 🟢 O8 | Error Boundary global | Resiliencia |

### Veredicto
**Production-readiness: 65/100.** App lista para demo y beta privada. Necesita rate limiting, PWA icons, y caps de datos antes de lanzamiento público. La base de código es sólida y escalable.

---

*Generado automáticamente. Ver código fuente en `/Users/marcosgil/forge/src/`*
