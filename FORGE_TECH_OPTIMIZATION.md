# FORGE — Tech Optimization (M2 Air)
**Fase 5 completada:** 2026-05-30

---

## 1. Restricciones del entorno

**Hardware:** MacBook Air M2 8GB RAM, fanless  
**Restricción crítica:** Sin ventilador — la temperatura sostenida alta degrada rendimiento  
**Regla de oro:** Nunca >2 modelos Ollama en RAM simultáneamente  

---

## 2. Estado actual de recursos

```
Servicios activos ahora:
├── FORGE dev server (next-server)  ~10MB RAM
├── Ollama daemon                   ~30MB base + modelo en RAM si activo
├── Open WebUI                      ~150MB RAM (Python)
└── TOTAL estimado con phi4-mini:   ~2.8GB RAM de 8GB disponibles
```

**RAM disponible para desarrollo:** ~5GB  
**RAM disponible si se lanza FORGE en prod + stack local:** ~4GB  

---

## 3. Optimizaciones de código — FORGE

### Alta prioridad (implementar ahora)

**OPT-01: Cache in-memory para localStorage reads**
```typescript
// Problema actual: cada llamada a getStore() hace JSON.parse()
// En Command Center, calculateLifeScores() llama 6+ stores
// Solución: Map en memoria con invalidación en write

const memCache = new Map<string, unknown>()

function getStore<T>(key: string): T[] {
  if (memCache.has(key)) return memCache.get(key) as T[]
  const raw = localStorage.getItem(`forge_${key}`)
  const parsed = raw ? JSON.parse(raw) : []
  memCache.set(key, parsed)
  return parsed
}

function setStore<T>(key: string, data: T[]): void {
  memCache.set(key, data)
  localStorage.setItem(`forge_${key}`, JSON.stringify(data))
}
```
**Impacto:** ~60% reducción de JSON.parse en páginas complejas

**OPT-02: Cap de entradas por store**
```typescript
// Añadir en cada store.save() con append-only:
all.unshift(entry)
if (all.length > 365) all.length = 365  // 1 año de historial máximo
```
**Impacto:** Previene crash por localStorage quota; mantiene DOM rendering ágil

**OPT-03: Eliminar dependencias muertas**
```bash
npm uninstall @base-ui/react better-sqlite3 @types/better-sqlite3
```
**Impacto:** -~2MB node_modules, -3 paquetes de superficie CVE, install más rápido

**OPT-04: Eliminar imports muertos**
```typescript
// wealth/page.tsx — quitar LineChart del import de recharts
// No se usa ningún LineChart en esa página
```

### Media prioridad

**OPT-05: useMemo para cálculos pesados en componentes**
```typescript
// En Command Center:
const scores = useMemo(() => calculateLifeScores(), [])
const insights = useMemo(() => generateInsights(), [])
// Sin dep array vacío se recalculan en cada render
```

**OPT-06: Separar store.ts en módulos**
```
src/lib/
├── stores/
│   ├── vitals.ts
│   ├── finance.ts
│   ├── habits.ts
│   └── ...
├── scoring.ts      # calculateReadiness, calculateLifeScores
├── insights.ts     # generateInsights
└── achievements.ts # checkAndUnlockAchievements
```
**Impacto:** Mejor tree-shaking, menor bundle por página, más mantenible

**OPT-07: Error Boundary global**
```tsx
// layout-shell.tsx:
import { ErrorBoundary } from 'react-error-boundary'

<ErrorBoundary fallback={<ErrorFallback />}>
  {children}
</ErrorBoundary>
```

---

## 4. Optimizaciones del AI Stack local

### Política de uso de modelos (M2 Air 8GB)

| Situación | Modelo recomendado | RAM usada |
|-----------|-------------------|-----------|
| Desarrollo FORGE (solo) | phi4-mini | 2.5GB |
| Hermes + desarrollo | phi4-mini (no qwen3:8b) | 2.5GB |
| Solo análisis rápido | deepseek-r1:1.5b | 1.1GB |
| NUNCA simultáneamente | qwen3:8b + phi4-mini | >7GB → crash |

### Script de arranque inteligente (actualizar ai-start)
```bash
# Al iniciar el stack, verificar RAM disponible
FREE_RAM=$(vm_stat | awk '/Pages free/ {print $3}' | tr -d '.')
FREE_MB=$((FREE_RAM * 4096 / 1048576))

if [ "$FREE_MB" -lt 3000 ]; then
  echo "⚠️ RAM <3GB libre — cargando solo deepseek-r1:1.5b"
  ollama pull deepseek-r1:1.5b
else
  echo "✅ RAM OK — phi4-mini disponible"
fi
```

---

## 5. Optimización para producción

### Build de producción vs desarrollo

| Métrica | Dev (actual) | Prod estimada |
|---------|-------------|--------------|
| .next/ tamaño | 752MB (caché) | ~25MB |
| RAM next-server | ~10MB | ~80MB (más workers) |
| Cold start | ~2s | ~0.3s |
| Bundle JS cliente | No optimizado | Tree-shaken |

### Config de producción recomendada (next.config.ts)
```typescript
const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  // Optimizar imágenes si se añaden
  images: { formats: ['image/avif', 'image/webp'] },
  // Headers de seguridad
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
      ],
    }]
  },
}
```

---

## 6. Rate limiting para /api/oracle

```typescript
// Implementación simple en memoria (se reinicia con cada deploy — OK para MVP)
const rateMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateMap.get(ip)

  if (!limit || now > limit.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return true
  }
  if (limit.count >= 20) return false  // 20 requests/min max
  limit.count++
  return true
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'local'
  if (!checkRateLimit(ip)) {
    return Response.json({ content: 'Too many requests. Please wait a moment.' }, { status: 429 })
  }
  // ... resto del handler
}
```

---

## 7. Checklist de optimización

### Inmediato (esta semana)
- [ ] OPT-01: Cache in-memory store
- [ ] OPT-02: Cap 365 entradas por store
- [ ] OPT-03: Eliminar deps muertas
- [ ] OPT-04: Eliminar imports muertos
- [ ] Rate limiting /api/oracle

### Próximas 2 semanas
- [ ] OPT-05: useMemo en Command Center
- [ ] OPT-07: Error Boundary
- [ ] Headers de seguridad en next.config.ts
- [ ] Probar build de producción local

### Próximo mes
- [ ] OPT-06: Separar store.ts en módulos
- [ ] Implementar service worker para offline básico
- [ ] Performance profiling con Lighthouse

---

## Resumen Fase 5

**Optimizaciones de mayor ROI:**
1. Rate limiting (previene pérdida económica)
2. Cache in-memory del store (mejora rendimiento perceptible)
3. Cap localStorage (previene crash en producción)
4. Eliminar deps muertas (limpieza, seguridad)

**Consumo de recursos actual:** Bajo. El stack de desarrollo usa ~10MB RAM para FORGE. En producción, Vercel gestiona el escalado automáticamente.

**Regla M2 Air:** Un modelo Ollama a la vez. phi4-mini para uso diario. qwen3:8b solo bajo demanda.

**→ Fase 6:** `FORGE_ORG_STRUCTURE.md`
