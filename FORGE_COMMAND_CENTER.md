# FORGE — Command Center Ejecutivo
**Fase 15 completada:** 2026-05-30

---

## Propósito

Este documento es el panel de control ejecutivo de FORGE como negocio. No confundir con el módulo "Command Center" de la app (el dashboard del usuario). Este es el dashboard de Marcos para gestionar FORGE como empresa.

---

## Estado actual del negocio

```
┌─────────────────────────────────────────────────────────────┐
│              FORGE — EXECUTIVE DASHBOARD                    │
│                    2026-05-30                               │
├─────────────────────────────────────────────────────────────┤
│  STAGE:       Pre-launch (no revenue)                       │
│  MRR:         €0                                           │
│  USUARIOS:    0 (no lanzado)                               │
│  DEPLOY:      ❌ No lanzado                                 │
│  STRIPE:      ❌ No integrado                               │
│  AUTH:        ❌ No integrado                               │
├─────────────────────────────────────────────────────────────┤
│  SPRINT 1 PROGRESO:                                         │
│  ✅ CRIT-003: Git inicializado                              │
│  □  CRIT-001: Rate limiting                                │
│  □  CRIT-002: PWA icons                                    │
│  □  CRIT-004: Deploy Vercel                               │
│  □  PROD-006: Cap localStorage                             │
│  □  TECH-003: Security headers                             │
├─────────────────────────────────────────────────────────────┤
│  BLOCKERS CRÍTICOS:                                         │
│  1. Sin deploy → 0 usuarios → 0 feedback → 0 revenue       │
│  2. Sin Stripe → conversión imposible incluso con usuarios  │
├─────────────────────────────────────────────────────────────┤
│  PRÓXIMOS 7 DÍAS:                                           │
│  Deploy en Vercel (URL pública)                            │
│  Primeros 3-5 beta testers                                 │
│  Rate limiting activo                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Hoja de ruta condensada

### Mes 1 — Estabilización y launch
- Semana 1: Fixes críticos + Deploy
- Semana 2: Beta testers + Analytics
- Semana 3: Feedback loop + Iteración
- Semana 4: Preparar Sprint 60 días (Stripe)

### Mes 2 — Primera monetización
- Supabase Auth + Stripe
- Feature gates Free/Pro
- 14-day trial
- Product Hunt prep

### Mes 3 — Escala
- Product Hunt launch
- Push notifications
- Campaña Reddit/Twitter sostenida
- Meta: €750 MRR (50 usuarios Pro)

### Mes 6 — Crecimiento
- €5,700 MRR target
- Apple Health / Oura integration
- Programa de referidos activo
- Newsletter semanal automatizado

---

## Decisiones estratégicas pendientes

| Decisión | Opciones | Deadline | Información necesaria |
|---------|---------|---------|----------------------|
| Precio anual | €99/año vs €119.88/año | Antes del launch de Stripe | Testear en landing con Stripe |
| Trial con tarjeta vs sin | Con tarjeta (más conversiones Pro) vs sin (menos fricción) | Antes de Stripe | Benchmarks del sector |
| Dominio | forge-os.com vs forge.app vs myforge.io | Semana 2 | Disponibilidad + coste |
| Supabase tier | Free (hasta 500MB) vs Pro ($25/mes) | Al integrar auth | Estimación de volumen |

---

## KPIs objetivo por hito

| Hito | MRR | Usuarios Pro | DAU/MAU | D7 Retention |
|------|-----|-------------|---------|-------------|
| Deploy | €0 | 0 | — | — |
| 10 beta testers | €0 | 0 | — | — |
| Stripe live | €0→€150 | 0→10 | >0.3 | >25% |
| €500 MRR | €500 | 35 | >0.35 | >30% |
| €2K MRR | €2,000 | 135 | >0.35 | >35% |
| €5K MRR | €5,000 | 335 | >0.40 | >40% |

---

## Revisión semanal — Protocolo (cada domingo)

```
1. Leer FORGE_MASTER_BACKLOG.md — ¿qué se completó?
2. Actualizar estados de tareas
3. Revisar métricas (Plausible cuando esté)
4. Identificar el principal bloqueante de la semana
5. Decidir las 3 tareas más importantes para la semana siguiente
6. Si backlog < 20 tareas pending → generar 10 nuevas según FORGE_EXECUTION_SYSTEM.md
7. Actualizar este documento con el estado actual
```

---

## Registro de decisiones tomadas

| Fecha | Decisión | Justificación |
|-------|---------|--------------|
| 2026-05-30 | Precio: €14.99/mes, €9.99/mes anual | Benchmark competidores (Whoop, Oura Pro, YNAB) |
| 2026-05-30 | Stack: Next.js + localStorage (sin backend) | Zero infra cost pre-launch, máxima velocidad |
| 2026-05-30 | No app nativa hasta €5K MRR | ROI no justificado antes de esa escala |
| 2026-05-30 | Canal primario: Reddit orgánico | Cero coste, audiencia exacta (biohackers, tech) |
| 2026-05-30 | UI externas (Open WebUI, LibreChat): NO | Oracle necesita contexto de datos de FORGE |
| 2026-05-30 | Modelo AI: claude-sonnet-4-6 | Calidad + coste balanceado; Haiku para tareas simples |

---

## Resumen Fase 15

El Command Center ejecutivo es simple porque el negocio es simple: una persona, un producto, un modelo de ingresos (SaaS freemium), un canal de crecimiento (comunidades orgánicas).

**La tarea más importante de FORGE hoy:** Hacer el deploy. Todo lo demás es planificación sin tracción.

**→ Fase 16:** `FORGE_5000_PLAN.md`
