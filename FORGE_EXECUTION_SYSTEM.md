# FORGE — Execution System
**Fase 7 completada:** 2026-05-30

---

## Principios del sistema

1. **Trabajo siempre priorizado por ROI:** (impacto esperado) / (esfuerzo estimado)
2. **Sin tareas artificiales:** Solo trabajo que directamente impacta usuarios, retención o ingresos
3. **Colas nunca vacías:** Cuando bajan de 20 tareas, se generan nuevas mediante análisis
4. **Paralelo cuando es posible:** Tareas sin dependencias se ejecutan simultáneamente
5. **Documentado siempre:** Cada tarea completada genera un aprendizaje registrado

---

## Las 8 colas

### CRITICAL_QUEUE — Bloquea crecimiento o ingresos
Tareas que, sin completarse, hacen imposible lanzar o monetizar.

### PRODUCT_QUEUE — Mejoras de producto
Features, bugs, UX, onboarding, retención.

### GROWTH_QUEUE — Adquisición y distribución
SEO, comunidades, viral mechanics, partnerships.

### SALES_QUEUE — Ventas y monetización
Stripe, pricing, conversión, funnel.

### CONTENT_QUEUE — Contenido y autoridad
Posts, threads, demos, emails.

### RESEARCH_QUEUE — Investigación y validación
Análisis de mercado, usuarios, competidores, hipótesis.

### AUTOMATION_QUEUE — Automatizaciones de alto ROI
Tareas repetibles que vale la pena automatizar.

### TECH_DEBT_QUEUE — Optimización técnica
Deuda técnica de SYSTEM_AUDIT.md, refactors, tests.

---

## Schema de tarea

```
ID:           QUEUE-NNN (ej: CRIT-001, PROD-002)
Título:       Descripción concisa
Prioridad:    P0 / P1 / P2 / P3
Impacto:      1-10 (10 = impacto máximo en usuarios/ingresos)
Esfuerzo:     1-10 (10 = máximo esfuerzo/tiempo)
ROI Score:    Impacto / Esfuerzo (auto-calculado)
Estado:       pending | ready | active | blocked | completed | archived
Dependencias: [ID, ID, ...]
Agente:       Product | Growth | Content | Research | Finance | Operations
Creado:       YYYY-MM-DD
Completado:   YYYY-MM-DD | —
Aprendizaje:  Qué aprendimos al completar (se rellena al cerrar)
```

---

## Reglas de priorización

```
P0: ROI Score ≥ 8 O bloquea revenue O riesgo económico
P1: ROI Score 5-7 O mejora activación/retención directamente
P2: ROI Score 3-4 O mejora UX
P3: ROI Score < 3 O nice-to-have
```

**Orden de ejecución dentro de la misma prioridad:** Mayor ROI Score primero.

---

## Sprints

### Sprint Semanal (lunes → domingo)
- Máximo 10 tareas activas simultáneamente
- Al menos 2 tareas P0 o P1 por sprint
- Review cada domingo: qué completó, qué aprendimos, qué entra al siguiente

### Sprint Mensual
- Revisión de KPIs contra targets del FORGE_REVENUE_PLAN.md
- Actualizar hipótesis de FORGE_MASTER_CONTEXT.md
- Generar 10+ nuevas tareas para el siguiente mes

### Sprint Trimestral
- Revisión estratégica completa
- Actualizar roadmap
- Validar o pivotar hipótesis de negocio

---

## Modo aceleración (paralelo)

Cuando hay 3+ tareas P0/P1 sin dependencias entre sí:
1. Identificar tareas paralelas (sin dependencias compartidas)
2. Asignar cada una a un agente distinto
3. Claude Code ejecuta las de código; Hermes las de research; aios-content las de copy
4. Merge de resultados al completar

---

## Generación automática de trabajo

Cuando FORGE_MASTER_BACKLOG.md tiene <20 tareas en estado `pending`:

**Trigger análisis:**
1. Revisar FORGE_PRODUCT_AUDIT.md → ¿qué fricciones siguen sin resolver?
2. Revisar FORGE_MARKET_ANALYSIS.md → ¿qué hipótesis sin validar?
3. Revisar métricas actuales → ¿qué KPI está debajo del target?
4. Revisar feedback de usuarios → ¿qué piden?
5. Revisar competidores → ¿lanzaron algo nuevo?

**Regla anti-artificialidad:** Solo añadir tarea si responde a la pregunta: "¿Esto directamente mejora usuarios, retención o ingresos de FORGE?"

---

## Detección y resolución de bloqueos

Si una tarea lleva >3 días en estado `blocked`:
1. Identificar causa exacta del bloqueo
2. Crear subtarea que resuelva la causa
3. Si la subtarea también está bloqueada → escalar a CEO (Marcos)
4. Si el bloqueo es externo (API de tercero, waiting on user feedback) → archivar temporalmente, reagendar

---

## Protocolo de cierre de tarea

Al marcar una tarea como `completed`:
1. Actualizar estado en FORGE_MASTER_BACKLOG.md
2. Registrar aprendizaje en campo `Aprendizaje`
3. Desbloquear tareas dependientes (cambiar estado de `blocked` a `ready`)
4. Si la tarea era P0 → generar inmediatamente la siguiente P0 si existe
5. Actualizar métricas relevantes en FORGE_METRICS_SYSTEM.md

---

## Centro de control (texto plano, sin dashboard de código)

```
┌─────────────────────────────────────────────────────┐
│           FORGE EXECUTION STATUS                    │
│                         2026-05-30                  │
├─────────────────────────────────────────────────────┤
│  CRITICAL_QUEUE  │ 4 pending │ 0 active │ 0 blocked │
│  PRODUCT_QUEUE   │ 8 pending │ 0 active │ 2 blocked │
│  GROWTH_QUEUE    │ 6 pending │ 0 active │ 0 blocked │
│  SALES_QUEUE     │ 5 pending │ 0 active │ 1 blocked │
│  CONTENT_QUEUE   │ 4 pending │ 0 active │ 0 blocked │
│  RESEARCH_QUEUE  │ 3 pending │ 0 active │ 0 blocked │
│  AUTOMATION_Q    │ 2 pending │ 0 active │ 0 blocked │
│  TECH_DEBT_Q     │ 5 pending │ 0 active │ 0 blocked │
├─────────────────────────────────────────────────────┤
│  Total tareas:   37 (actualizar en MASTER_BACKLOG)  │
│  Sprint actual:  Semana 1 — Estabilización          │
│  MRR actual:     €0 (no lanzado)                   │
│  Próximo hito:   Deploy en Vercel con URL pública   │
└─────────────────────────────────────────────────────┘
```

**→ Ver FORGE_MASTER_BACKLOG.md para lista completa de tareas**
