# FORGE — Automation System
**Fase 14 completada:** 2026-05-30

---

## Principio de automatización

Solo automatizar si:
1. La tarea se repite ≥3 veces/semana, O
2. El tiempo de ejecución manual > 15 minutos, O
3. El riesgo de olvidarlo tiene impacto directo en usuarios o ingresos

No automatizar por automatizar. Cada automatización tiene coste de mantenimiento.

---

## Automatizaciones de alto ROI (implementar ahora)

### AUTO-01: Script de arranque del stack de desarrollo

**Archivo:** `~/aios/scripts/start_ai_stack.sh` (ya existe)
**Problema resuelto:** Cada sesión requería arrancar manualmente Ollama, verificar Hermes, etc.
**Tiempo ahorrado:** ~5 min/día

```bash
# Alias en ~/.zshrc:
alias ai-start="~/aios/scripts/start_ai_stack.sh"
alias ai-stop="~/aios/scripts/stop_ai_stack.sh"
alias ai-status="~/aios/scripts/healthcheck_ai_stack.sh"
```

**Estado:** Implementado ✅

---

### AUTO-02: Script de deploy a Vercel

**Cuándo:** Antes de cada push significativo

```bash
#!/bin/bash
# ~/forge/scripts/deploy.sh

echo "🔍 Pre-deploy checks..."
cd ~/forge

# 1. TypeScript check
npx tsc --noEmit
if [ $? -ne 0 ]; then
  echo "❌ TypeScript errors found. Fix before deploy."
  exit 1
fi

# 2. Build de producción
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build failed."
  exit 1
fi

echo "✅ Build passed. Deploying..."
git add -A
git commit -m "deploy: $(date +'%Y-%m-%d %H:%M')"
git push

echo "✅ Pushed to remote. Vercel will deploy automatically."
```

**Estado:** Pending — crear cuando Git esté inicializado

---

### AUTO-03: Backup semanal de datos (localStorage export)

**Problema:** Los datos de FORGE están solo en localStorage. Si el usuario borra el navegador o cambia de dispositivo, pierde todo.
**Solución:** Botón "Export all data" en Settings que descarga JSON con todos los stores.

```typescript
// En settings/page.tsx:
function exportAllData() {
  const keys = ['vitals', 'workouts', 'habits', 'finance', 'journal', 'goals', 'achievements']
  const backup: Record<string, unknown> = {
    exportDate: new Date().toISOString(),
    version: '1.0',
  }
  
  keys.forEach(key => {
    const raw = localStorage.getItem(`forge_${key}`)
    if (raw) backup[key] = JSON.parse(raw)
  })
  
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `forge-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
}
```

**Estado:** Pending (PROD_QUEUE)

---

### AUTO-04: Rate limiting automático en /api/oracle

**Código ya escrito** en `FORGE_TECH_OPTIMIZATION.md`, sección 6.
**Estado:** CRIT-001 en backlog — implementar esta semana

---

### AUTO-05: Plausible eventos automáticos

**Una vez instalado Plausible**, registrar eventos en puntos clave sin intervención manual:

```typescript
// Wrapper que no rompe si Plausible no está cargado:
declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void
  }
}

function track(event: string, props?: Record<string, string>) {
  window.plausible?.(event, props ? { props } : undefined)
}

// Uso:
track('Oracle Message Sent')
track('Setup Completed', { steps: '5' })
track('Upgraded to Pro', { plan: 'monthly' })
```

**Estado:** Pending — implementar con PROD-014

---

## Automatizaciones futuras (post-€1K MRR)

### AUTO-06: Email weekly digest

**Stack:** Resend (API de email, gratis hasta 3,000 emails/mes)
**Trigger:** Cron job cada domingo 17:00
**Contenido:** Life Score semanal, hábito más consistente, Oracle insight del week
**Dependencias:** Supabase Auth (emails), SALE-001

```typescript
// /api/cron/weekly-digest
// Registrar en Vercel Cron Jobs (vercel.json):
{
  "crons": [{
    "path": "/api/cron/weekly-digest",
    "schedule": "0 17 * * 0"
  }]
}
```

---

### AUTO-07: Oracle context auto-refresh

**Problema actual:** Oracle recibe el contexto de los últimos datos cada vez, pero si el usuario no ha loggeado en 3 días, el contexto está desactualizado.
**Solución:** Incluir siempre los últimos datos disponibles (aunque sean de hace 3 días) + indicar cuándo fueron.

```typescript
// En /api/oracle:
const lastVital = vitalsStore.getRecent(1)[0]
const daysSince = lastVital ? 
  Math.floor((Date.now() - new Date(lastVital.date).getTime()) / 86400000) : null

const contextNote = daysSince !== null && daysSince > 0 
  ? `(last logged ${daysSince} days ago)` 
  : '(from today)'
```

**Estado:** Pending (PROD_QUEUE)

---

### AUTO-08: Ruv Swarm para tareas paralelas

**Estado:** Instalado pero no integrado

**Caso de uso específico:**
Cuando hay 5+ tareas de contenido independientes (5 threads de Twitter, 3 posts de Reddit, 2 emails), usar Ruv Swarm para generarlos en paralelo con Hermes.

```bash
# Cuando esté integrado:
ruv-swarm spawn --agents 5 --task "Generate 5 Twitter threads about biohacking topics for FORGE"
```

**Bloqueado por:** Necesita definir prompts y workflow específico de FORGE

---

## Automatizaciones que NO implementar

| Automatización | Por qué no |
|---------------|-----------|
| Auto-publicar en Twitter | Riesgo de publicar contenido malo sin revisar |
| Auto-responder comentarios | Pérdida de autenticidad — los primeros 6 meses exigen presencia humana |
| Auto-crear tareas en backlog | Los sistemas de auto-generación producen trabajo artificial |
| Auto-deploy en cada commit | Sin CI/CD tests, puede romper producción silenciosamente |
| Auto-enviar cold emails | Spam, daño de reputación, poca conversión |

---

## Priorización de automatizaciones

| Auto | ROI | Esfuerzo | Estado |
|------|-----|---------|--------|
| Rate limiting oracle (AUTO-04) | 10 | 1h | Esta semana |
| Export data backup (AUTO-03) | 8 | 1h | Semana 2 |
| Deploy script (AUTO-02) | 7 | 30min | Esta semana |
| Plausible eventos (AUTO-05) | 8 | 2h | Con deploy |
| Email weekly digest (AUTO-06) | 7 | 4h | Post Supabase |
| Ruv Swarm content (AUTO-08) | 5 | 8h | Post €1K MRR |

---

## Resumen Fase 14

**Las 2 automatizaciones de mayor impacto inmediato:**
1. Rate limiting (evita pérdida económica por uso abusivo de Anthropic API)
2. Deploy script (reduce fricción de shipping, que es el mayor cuello de botella)

**Regla de oro:** Una automatización que tarda 1h en hacer pero ahorra 5min/semana tarda ~12 semanas en amortizarse. Si no se usa en 12 semanas, fue un error.

**→ Fase 15:** `FORGE_COMMAND_CENTER.md`
