# FORGE — Continuous Operation Mode
**Fase 17 completada:** 2026-05-30

---

## Qué es el modo de operación continua

FORGE no tiene sprints que "terminan". Opera como un sistema vivo:
- El backlog siempre tiene ≥20 tareas pending
- El sprint siempre tiene las 10 tareas de mayor ROI activas
- Cada domingo hay revisión y replanificación
- Cada mes hay revisión de KPIs y ajuste de hipótesis

Este documento define el protocolo de operación semanal, mensual y trimestral.

---

## Protocolo semanal (cada domingo, ~45 min)

### Parte 1: Review (15 min)
```
1. Leer FORGE_MASTER_BACKLOG.md
2. Marcar tareas completadas esta semana
3. Registrar aprendizaje en cada tarea cerrada
4. Identificar cualquier tarea bloqueada >3 días
```

### Parte 2: Métricas (10 min)
```
5. Revisar Plausible: visitantes, fuentes, eventos
6. Si hay Stripe: MRR, nuevos Pro, cancelaciones
7. Actualizar FORGE_METRICS_SYSTEM.md con datos de la semana
8. Comparar contra targets del FORGE_5000_PLAN.md
```

### Parte 3: Planificación (20 min)
```
9. Ordenar tareas por ROI en cada cola
10. Seleccionar top 10 para el siguiente sprint
11. Si alguna cola < 5 tareas pending → generar nuevas tareas
12. Actualizar el dashboard en FORGE_COMMAND_CENTER.md
```

---

## Protocolo mensual (primer domingo del mes, ~2h)

### Revisión de KPIs
```
□ MRR vs target del mes
□ Usuarios Pro vs target
□ DAU/MAU ratio
□ Day 7 retention (por cohorte)
□ Free → Pro conversion rate
□ Principales fuentes de tráfico
□ Coste API Anthropic del mes
```

### Revisión de hipótesis
```
Abrir FORGE_MASTER_CONTEXT.md → sección "Hipótesis de negocio"
Para cada hipótesis:
  □ ¿Sigue siendo válida con datos del mes?
  □ ¿Hay nueva evidencia (feedback usuarios, métricas)?
  □ ¿Se valida, refuta o sigue sin datos?
```

### Generación de trabajo nuevo
```
□ Revisar FORGE_PRODUCT_AUDIT.md → ¿qué fricciones siguen sin resolver?
□ Revisar feedback de usuarios del mes → ¿qué piden más?
□ Revisar competidores → ¿lanzaron algo relevante?
□ Revisar FORGE_5000_PLAN.md → ¿estamos en la ruta correcta?
□ Generar ≥10 tareas nuevas para el backlog
```

### Decisión de pivote (si necesario)
```
Criterios para reconsiderar la estrategia:
- MRR 50%+ por debajo del target 2 meses seguidos
- D7 retention <15% después de 60 días de intentos
- Ningún canal de adquisición funcionando después de 3 meses
- Feedback unánime de usuarios sobre un problema no resuelto
```

---

## Protocolo trimestral (primer domingo del trimestre, ~4h)

### Revisión estratégica completa
```
□ Leer todos los FORGE_*.md y actualizar lo que está obsoleto
□ Revisar el posicionamiento: ¿sigue siendo correcto?
□ Revisar el roadmap de FORGE_5000_PLAN.md
□ ¿Estamos en el canal de crecimiento correcto?
□ ¿El ICP sigue siendo el correcto?
```

### Decisiones de producto
```
□ ¿Qué features del backlog han sido pedidas más de 5 veces?
□ ¿Hay features implementadas que nadie usa? → deprecar
□ ¿El Life Score es el hook de retención que esperábamos?
□ ¿Oracle está generando el valor diferencial prometido?
```

### OKRs del trimestre siguiente
```
Format: "En [fecha], habremos [resultado medible] como evidencia de [hipótesis]"

Ejemplo Q3 2026:
  OKR 1: En 2026-09-30, MRR ≥ €2,000 como evidencia de que 
          el canal Reddit es sostenible.
  OKR 2: En 2026-09-30, D7 retention ≥ 35% como evidencia de 
          que las push notifications funcionan.
  OKR 3: En 2026-09-30, Product Hunt top 5 como evidencia de 
          que el producto tiene tracción suficiente para escalar.
```

---

## Reglas de continuidad del sistema

### Regla 1: El backlog nunca se vacía
Si FORGE_MASTER_BACKLOG.md tiene < 20 tareas pending, ejecutar el análisis del FORGE_EXECUTION_SYSTEM.md para generar nuevas tareas.

### Regla 2: Las tareas P0 tienen prioridad absoluta
Si hay una tarea P0, es la primera en ejecutarse en el sprint. No hay negociación.

### Regla 3: Sin tareas artificiales
Antes de añadir una tarea, preguntarse: "¿Esto directamente mejora usuarios, retención o ingresos?"
Si la respuesta es "no claramente", no se añade.

### Regla 4: Los bloqueos se escalan en 3 días
Si una tarea lleva >3 días blocked sin resolución → crear subtarea de desbloqueo o archivar temporalmente.

### Regla 5: Cada tarea completada genera aprendizaje
El campo "Aprendizaje" en el backlog no es opcional. Si no hay aprendizaje, fue una tarea mal definida.

---

## Estado del sistema al cerrar las 17 fases

```
┌─────────────────────────────────────────────────────────────┐
│           FORGE — SISTEMA COMPLETO (2026-05-30)             │
├─────────────────────────────────────────────────────────────┤
│  Documentación estratégica:  17/17 fases completadas ✅     │
│  Backlog:                    49 tareas (20 ready, 7 blocked) │
│  Sprint actual:              Semana 1 — Estabilización       │
│  Próxima acción crítica:     Git init + deploy Vercel        │
├─────────────────────────────────────────────────────────────┤
│  FORGE_MASTER_CONTEXT.md    ✅  FORGE_MARKET_ANALYSIS.md  ✅ │
│  FORGE_REVENUE_PLAN.md      ✅  FORGE_PRODUCT_AUDIT.md    ✅ │
│  FORGE_TECH_OPTIMIZATION.md ✅  FORGE_ORG_STRUCTURE.md    ✅ │
│  FORGE_EXECUTION_SYSTEM.md  ✅  FORGE_MASTER_BACKLOG.md   ✅ │
│  FORGE_GROWTH_ENGINE.md     ✅  FORGE_CONTENT_SYSTEM.md   ✅ │
│  FORGE_SALES_SYSTEM.md      ✅  FORGE_METRICS_SYSTEM.md   ✅ │
│  FORGE_UI_STRATEGY.md       ✅  FORGE_MOBILE_PLAN.md      ✅ │
│  FORGE_AUTOMATION_SYSTEM.md ✅  FORGE_COMMAND_CENTER.md   ✅ │
│  FORGE_5000_PLAN.md         ✅  FORGE_CONTINUOUS_OPERATION ✅│
│  SYSTEM_AUDIT.md            ✅  ANALYSIS_REPORT.md        ✅ │
├─────────────────────────────────────────────────────────────┤
│  El sistema está operativo.                                  │
│  La siguiente sesión empieza leyendo:                        │
│  1. FORGE_MASTER_BACKLOG.md (¿qué hay que hacer?)           │
│  2. FORGE_COMMAND_CENTER.md (¿cuál es el estado?)           │
│  3. Las 3 primeras tareas del sprint actual                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Cómo empezar cada sesión de trabajo en FORGE

```
Paso 1: Leer el estado actual
  → FORGE_MASTER_BACKLOG.md → sprint actual → tareas activas

Paso 2: Elegir la tarea de mayor ROI sin bloqueantes
  → Ordenar ready por ROI Score → tomar la primera

Paso 3: Ejecutar
  → Product Agent (Claude Code) para código
  → Research Agent (Hermes) para análisis
  → Content Agent (aios-content) para copy

Paso 4: Cerrar tarea
  → Marcar completed en backlog
  → Registrar aprendizaje
  → Desbloquear dependientes

Paso 5: Si es fin de sprint (domingo)
  → Ejecutar protocolo semanal
```

---

## Análisis de oportunidades de mercado — Integración

*(Del análisis estratégico recibido)*

Las 8 oportunidades identificadas mapeadas contra el estado actual de FORGE:

| Oportunidad | Estado | Prioridad siguiente |
|-------------|--------|-------------------|
| FORGE Score | ✅ Life Score implementado | Mejorar Daily Brief con "top 3 actions" |
| Daily Command Center | ✅ Existe, falta "qué hacer hoy" | PROD-016: Guided first actions + top 3 |
| Sistema de Decisiones | ✅ Oracle lo hace | Mejorar contexto inicial y prompts |
| Motor de Energía | ❌ No existe | Pendiente validación con usuarios |
| Coste de Oportunidad | ❌ No existe | Pendiente validación con usuarios |
| Mentor Personal IA | ✅ Oracle con contexto | Mejorar memoria de objetivos en Oracle |
| Sistema de Priorización | ⚠️ Parcial (Oracle recomienda) | Top 3 acciones en Command Center |
| Dashboard Integral | ✅ Command Center actual | No complejizar — está bien |

**Conclusión del análisis:** FORGE ya tiene 5 de las 8 oportunidades implementadas. La brecha más valiosa es la "Top 3 daily actions" — alta diferenciación, bajo esfuerzo, alto impacto en retención diaria.

---

## El único verdadero norte

FORGE existe para ayudar a Marcos — y eventualmente a miles de usuarios — a vivir mejor y tomar mejores decisiones. Toda métrica, toda tarea, toda feature debe evaluarse contra esa pregunta:

**"¿Esto ayuda al usuario a tomar mejores decisiones sobre su tiempo, energía y dinero?"**

Si la respuesta es sí: construir.
Si es no: eliminar.
Si no está claro: preguntar a 5 usuarios reales.

---

*Sistema FORGE v1.0 — Operativo desde 2026-05-30*
*17 fases completadas. El producto está listo para lanzarse.*
