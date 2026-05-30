# SYSTEM AUDIT — FORGE Infrastructure
**Fase 0 completada:** 2026-05-30  
**Siguiente fase:** FORGE_MASTER_CONTEXT.md (Fase 1 — ya completada)

---

## 1. Mapa del sistema completo

```
┌─────────────────────────────────────────────────────────────────┐
│                    MacBook Air M2 8GB                           │
│                                                                 │
│  ┌──────────────────┐   ┌──────────────────┐                   │
│  │  FORGE App       │   │  AI Local Stack  │                   │
│  │  :3001 (Next.js) │   │                  │                   │
│  │  PID 57815       │   │  Ollama :11434   │                   │
│  │  RSS ~11MB       │   │  PID 40881       │                   │
│  └────────┬─────────┘   │                  │                   │
│           │             │  Open WebUI :3000│                   │
│           │ POST        │  PID 41180       │                   │
│           ▼             └──────────────────┘                   │
│  ┌──────────────────┐                                          │
│  │  /api/oracle     │   ┌──────────────────┐                   │
│  │  route.ts        │   │  Hermes Agent    │                   │
│  └────────┬─────────┘   │  ~/.hermes/      │                   │
│           │             │  v0.14.0 (CLI)   │                   │
│           ▼             └──────────────────┘                   │
│  Anthropic API                                                  │
│  claude-sonnet-4-6      ┌──────────────────┐                   │
│  (external)             │  Ruv Swarm       │                   │
│                         │  npm global      │                   │
│                         │  v1.0.20         │                   │
└─────────────────────────┴──────────────────┘                   
```

---

## 2. Repositorio FORGE

**Path:** `/Users/marcosgil/forge`  
**Git:** No inicializado (no hay `.git/`)  
**Estado:** Desarrollo local activo

### Estructura de carpetas
```
forge/
├── src/
│   ├── app/
│   │   ├── api/oracle/route.ts          # Único endpoint servidor
│   │   ├── body/page.tsx                # Workouts + Nutrición + Peso
│   │   ├── insights/page.tsx            # Motor insights + correlación
│   │   ├── journal/page.tsx             # Diario + mood + Oracle reflect
│   │   ├── layout.tsx                   # Root layout + PWA metadata
│   │   ├── mind/page.tsx                # Habits + Tasks + Goals + Achievements
│   │   ├── oracle/page.tsx              # Chat AI full-context
│   │   ├── page.tsx                     # Command Center (home)
│   │   ├── pricing/page.tsx             # Landing + pricing
│   │   ├── review/page.tsx              # Weekly review + radar chart
│   │   ├── settings/page.tsx            # Perfil + export + reset
│   │   ├── setup/page.tsx               # Onboarding 5 pasos
│   │   ├── vitals/page.tsx              # Sleep + HRV + mood logging
│   │   └── wealth/page.tsx              # Finanzas + proyecciones
│   ├── components/
│   │   ├── layout/
│   │   │   ├── layout-shell.tsx         # Sidebar + mobile nav + FAB
│   │   │   ├── quick-log-fab.tsx        # FAB quick log (vitals/workout/expense)
│   │   │   └── sidebar.tsx              # Nav sidebar con Life Score
│   │   └── ui/                          # shadcn components (7)
│   └── lib/
│       ├── store.ts                     # 543 líneas — todo el data layer
│       ├── types.ts                     # 151 líneas — interfaces TypeScript
│       └── utils.ts                     # cn() helper
├── public/
│   ├── manifest.json                    # PWA manifest
│   └── icons/                           # ⚠️ NO EXISTE — PWA rota
├── .env.local                           # ANTHROPIC_API_KEY
├── ANALYSIS_REPORT.md                   # Auditoría técnica previa
├── FORGE_MASTER_CONTEXT.md              # Fuente de verdad del producto
├── next.config.ts                       # Vacío — sin config especial
├── package.json
└── tsconfig.json
```

### Métricas de código
| Componente | Archivos | Líneas |
|-----------|---------|--------|
| Pages (app routes) | 13 | 3,217 |
| Components | 11 | 946 |
| Lib (store + types + utils) | 3 | 710 |
| API routes | 1 | 72 |
| **Total** | **28** | **~4,945** |

---

## 3. Dependencias

### Producción (13 paquetes)
| Paquete | Versión | Uso | Estado |
|---------|---------|-----|--------|
| next | 16.2.6 | Framework | ✅ Activo |
| react | 19.2.4 | UI | ✅ Activo |
| react-dom | 19.2.4 | DOM | ✅ Activo |
| @anthropic-ai/sdk | ^0.100.1 | AI API | ✅ Activo |
| recharts | ^3.8.1 | Charts | ✅ Activo |
| date-fns | ^4.3.0 | Fechas | ✅ Activo |
| lucide-react | ^1.17.0 | Iconos | ✅ Activo |
| tailwind-merge | ^3.6.0 | CSS utils | ✅ Activo |
| class-variance-authority | ^0.7.1 | Variantes UI | ✅ Activo |
| clsx | ^2.1.1 | className | ✅ Activo |
| tw-animate-css | ^1.4.0 | Animaciones | ✅ Activo |
| shadcn | ^4.8.3 | CLI componentes | ✅ Activo |
| **@base-ui/react** | ^1.5.0 | — | ⚠️ **MUERTA** |
| **better-sqlite3** | ^12.10.0 | — | ⚠️ **MUERTA** |
| **@types/better-sqlite3** | ^7.6.13 | — | ⚠️ **MUERTA** |

### Devdependencias
| Paquete | Versión |
|---------|---------|
| typescript | ^5 |
| tailwindcss | ^4 |
| @tailwindcss/postcss | ^4 |
| eslint + eslint-config-next | 9 / 16.2.6 |
| @types/node | ^20 |
| @types/react + react-dom | ^19 |

---

## 4. Servicios activos en el sistema

| Servicio | PID | Puerto | RAM | Estado |
|---------|-----|--------|-----|--------|
| FORGE (next-server) | 57815 | 3001 | ~10MB | ✅ Corriendo |
| Ollama daemon | 40881 | 11434 | — | ✅ Corriendo |
| Open WebUI | 41180 | 3000 | — | ✅ Corriendo |
| Hermes | — | CLI | — | ✅ Instalado, no daemon |
| Ruv Swarm | — | CLI/MCP | — | ✅ Instalado, no daemon |

### Modelos Ollama disponibles
| Modelo | Tamaño | Propósito |
|--------|--------|-----------|
| phi4-mini:latest | 2.5GB | Uso diario principal |
| aios-executive:latest | 2.5GB | Agente ejecutivo |
| aios-content:latest | 2.5GB | Agente contenido |
| aios-coder:latest | 1.9GB | Agente código |
| aios-analyzer:latest | 1.1GB | Agente análisis |
| qwen2.5:3b | 1.9GB | Especialista |
| llama3.2:3b | 2.0GB | Especialista |
| deepseek-r1:1.5b | 1.1GB | Razonamiento |

---

## 5. APIs externas

| API | Uso | Coste | Riesgo |
|-----|-----|-------|--------|
| Anthropic (claude-sonnet-4-6) | Oracle, Insights AI, Morning Brief, Review, Journal reflection | ~€0.003/1K tokens | 🔴 Sin rate limiting |
| Google Fonts (Geist) | Tipografía | Gratis | ✅ Bajo |

**No hay:** Stripe, Supabase, Plaid, Auth0, Analytics, Email, Push notifications

---

## 6. Base de datos

**No existe base de datos.** Persistencia 100% en localStorage del browser.

| Clave | Tipo | Contenido | Límite implementado |
|-------|------|-----------|-------------------|
| forge_vitals | VitalEntry[] | Sueño, HRV, RHR, energía, mood | ⚠️ Ninguno |
| forge_workouts | WorkoutEntry[] | Ejercicios, sets, duración | ⚠️ Ninguno |
| forge_nutrition | NutritionEntry[] | Macros diarios | ⚠️ Ninguno |
| forge_body | BodyMetric[] | Peso, % grasa | ⚠️ Ninguno |
| forge_finance | Transaction[] | Ingresos/gastos | ⚠️ Ninguno |
| forge_goals | Goal[] | Metas con progreso | ⚠️ Ninguno |
| forge_habits | Habit[] | Hábitos + completions[] | ⚠️ Ninguno |
| forge_tasks | Task[] | Tareas con prioridad | ⚠️ Ninguno |
| forge_chat | ChatMessage[] | Historial Oracle | ⚠️ Ninguno |
| forge_journal | JournalEntry[] | Entradas diarias | ⚠️ Ninguno |
| forge_achievements | Achievement[] | Logros desbloqueados | ✅ Max 16 |
| forge_profile | UserProfile | Nombre, foco, fecha | ✅ Single object |

**Riesgo:** Browser quota ~5–10MB por origen. Sin cap, posible crash a los 6–12 meses de uso activo.

---

## 7. Workflows y automatizaciones

**Actuales:** Ninguno. No hay CI/CD, cron jobs, webhooks, o automatizaciones.

**Scripts de gestión del AI Stack (~/aios/scripts/):**
```bash
ai-start      → start_ai_stack.sh (Ollama + verificación Hermes + Ruv Swarm)
ai-stop       → stop_ai_stack.sh
ai-restart    → restart_ai_stack.sh
ai-status     → healthcheck_ai_stack.sh
```

**No hay:** GitHub Actions, Vercel CI, tests automatizados, monitoring, alertas.

---

## 8. Configuración local

### Variables de entorno
```bash
# /Users/marcosgil/forge/.env.local
ANTHROPIC_API_KEY=sk-ant-api03-***  # ✅ Configurada, no commiteada
```

### ~/.zshrc aliases relevantes
```bash
alias ai-start="~/aios/scripts/start_ai_stack.sh"
alias ai-status="~/aios/scripts/healthcheck_ai_stack.sh"
alias hermes="$HOME/.local/bin/hermes"
alias ruv="ruv-swarm"
alias aios="~/aios/scripts/aios-status.sh"
alias webui="open-webui serve --port 3000"
```

### Node/npm
- Node.js: v26.0.0
- npm: v11.12.1
- Homebrew location: `/opt/homebrew/`

---

## 9. Hermes Agent

**Ubicación:** `~/.hermes/`  
**Binario:** `~/.local/bin/hermes` (wrapper bash → venv Python 3.11)  
**Versión:** v0.14.0 (NousResearch) — 765 commits behind upstream  
**Config:** `~/.hermes/config.yaml` (57KB), API keys en `~/.hermes/.env`  
**Proveedor default:** OpenRouter → `anthropic/claude-opus-4.6`  
**Skills instalados:** 24 packs  
**Integración con FORGE:** ❌ No integrado

### Capacidades disponibles no usadas en FORGE
- MCP server mode (`hermes mcp`)
- Autonomous agent loops
- Webhook integration
- Cron jobs
- WhatsApp/Slack integration
- Memory persistence
- Computer use

---

## 10. Ruv Swarm

**Ubicación:** `/opt/homebrew/lib/node_modules/ruv-swarm/`  
**Binario:** `/opt/homebrew/bin/ruv-swarm`  
**Versión:** v1.0.20  
**Estado:** Instalado y funcional (better-sqlite3 reparado)  
**Integración con FORGE:** ❌ No integrado  
**Nota:** `ruv-swarm --version` cuelga — usar `node -e "require('.../package.json').version"` para checks

### Capacidades disponibles
- Multi-agent swarm orchestration
- MCP server mode (`ruv-swarm mcp start`)
- SQLite-backed persistence
- Parallel task execution

---

## 11. Deuda técnica catalogada

### P0 — Crítico (bloquea lanzamiento o crea riesgo económico)
| ID | Problema | Impacto |
|----|---------|---------|
| DT-01 | Sin rate limiting en /api/oracle | Cualquiera puede vaciar el crédito de Anthropic |
| DT-02 | PWA icons no existen | App no instalable en iOS/Android |
| DT-03 | Sin auth/backend | Usuarios pierden datos al cambiar dispositivo |
| DT-04 | Sin pagos | No se puede monetizar |

### P1 — Alta (degradan calidad o generan problemas en producción)
| ID | Problema | Impacto |
|----|---------|---------|
| DT-05 | localStorage sin cap | Crash por quota en uso prolongado |
| DT-06 | hrv/rhr requeridos, se guarda 0 | Corrompe calculateReadiness() |
| DT-07 | Sin Error Boundary | Pantalla blanca ante errores de store |
| DT-08 | Sin Git | Sin historial de cambios, sin rollback |
| DT-09 | Sin deploy | Nadie puede acceder al producto |

### P2 — Media
| ID | Problema | Impacto |
|----|---------|---------|
| DT-10 | Deps muertas (@base-ui/react, better-sqlite3) | Bundle + CVE surface |
| DT-11 | WorkoutEntry sin campo name | Workaround con notes |
| DT-12 | store.ts lee localStorage en cada call | Performance en páginas complejas |
| DT-13 | Sin tests | Regresiones silenciosas |
| DT-14 | 'use client' en toda la app | No hay SSR/pre-rendering |

### P3 — Baja
| ID | Problema | Impacto |
|----|---------|---------|
| DT-15 | LineChart importado sin usar en wealth | Bundle mínimo |
| DT-16 | Hermes 765 commits behind | Features perdidas, security patches |
| DT-17 | Sin 404 page personalizada | UX menor |

---

## 12. Riesgos del sistema

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|-----------|
| Coste API Anthropic sin control | Alta (al publicar) | Crítico | Rate limiting inmediato |
| Pérdida de datos usuario (localStorage) | Media | Alto | Auth + sync cloud |
| Node.js v26 incompatibilidades | Media | Medio | Probar build de producción |
| Quota localStorage excedida | Baja-media | Alto | Cap de entradas |
| Outage Anthropic API | Baja | Medio | Fallback a Ollama local |

---

## 13. Recomendaciones inmediatas

Por orden de ROI:

1. **Inicializar Git** — costo: 2 minutos, beneficio: historial completo, rollback, GitHub
2. **Rate limiting /api/oracle** — costo: 20 líneas de código, beneficio: protección económica total
3. **Crear PWA icons** — costo: generar 2 PNGs, beneficio: app instalable en móvil
4. **Cap localStorage** — costo: 10 líneas por store, beneficio: fiabilidad a largo plazo
5. **Eliminar deps muertas** — costo: 1 comando npm, beneficio: bundle limpio

---

## Resumen Fase 0

**Sistema auditado:** FORGE Life OS en desarrollo local  
**Servicios activos:** 5 (FORGE, Ollama, Open WebUI, Hermes CLI, Ruv Swarm)  
**Deuda técnica catalogada:** 17 items (4 críticos, 5 de alta prioridad)  
**Estado general:** MVP técnicamente sólido, no lanzable sin resolver DT-01 a DT-04  

**Hipótesis validadas en Fase 0:**
- ✅ El stack es técnicamente capaz de soportar el producto
- ✅ Los modelos locales (Ollama) pueden ser fallback de Oracle
- ⚠️ El modelo localStorage-only no escala para un producto de pago (requiere auth + cloud)

**→ Fase 1 ya completada:** `FORGE_MASTER_CONTEXT.md` existe y está completo.  
**→ Continuar con Fase 2:** `FORGE_MARKET_ANALYSIS.md`
