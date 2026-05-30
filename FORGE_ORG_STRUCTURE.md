# FORGE — Organization Structure
**Fase 6 completada:** 2026-05-30

---

## Realidad operativa

FORGE es operado por 1 persona (Marcos) + Claude Code como partner de ejecución + AI local stack (Hermes, Ollama, Ruv Swarm) para tareas específicas.

La "organización" es una estructura de agentes especializados, no un equipo humano. Cada agente tiene scope definido, herramientas específicas y KPIs claros.

---

## Estructura de agentes

### CEO Agent — Marcos + Claude Code (primario)
**Responsabilidad:** Visión, decisiones estratégicas, aprobación de cambios críticos  
**Herramientas:** Claude Code (main), FORGE_MASTER_CONTEXT.md, FORGE_5000_PLAN.md  
**KPIs:** MRR, usuarios Pro, Life Score promedio de usuarios  
**Límite:** Ninguna decisión de arquitectura, pricing o lanzamiento sin revisión de este agent  

### Product Agent — Claude Code (Sonnet 4.6)
**Responsabilidad:** Código, features, bugs, UX, testing  
**Herramientas:** Claude Code con acceso completo al repo  
**Modelo:** claude-sonnet-4-6 (default)  
**KPIs:** Features lanzadas/semana, bugs cerrados, TypeScript errors = 0  
**Límite:** No cambiar arquitectura de datos sin aprobación CEO Agent  

### Research Agent — Hermes (claude-opus-4.6 via OpenRouter)
**Responsabilidad:** Análisis de mercado, investigación de competidores, validación de hipótesis, análisis profundo  
**Herramientas:** `hermes chat -m anthropic/claude-opus-4.6`  
**Activar con:** `hermes chat` cuando se necesita research de larga duración  
**KPIs:** Hipótesis validadas/mes, insights de mercado accionables  
**Límite:** Solo research y análisis — nunca ejecuta cambios en código  

### Analyzer Agent — aios-analyzer (Ollama: deepseek-r1:1.5b)
**Responsabilidad:** Análisis de datos de FORGE, métricas, patrones, detección de anomalías  
**Herramientas:** `ollama run aios-analyzer`  
**Activar cuando:** Hay datos de usuarios que analizar, métricas que revisar  
**KPIs:** Insights de datos generados/semana  
**Límite:** Solo análisis — no toma decisiones  

### Content Agent — aios-content (Ollama: phi4-mini)
**Responsabilidad:** Borradores de posts, threads de Twitter, copy de landing, emails  
**Herramientas:** `ollama run aios-content`  
**Activar con:** `ollama run aios-content` para generación de contenido  
**KPIs:** Posts publicados/semana, engagement promedio  
**Límite:** Todos los contenidos requieren revisión humana antes de publicar  

### Growth Agent — Claude Code (Haiku para tareas simples)
**Responsabilidad:** SEO, comunidades, Reddit posts, Product Hunt, viral mechanics  
**Herramientas:** Claude Code, FORGE_GROWTH_ENGINE.md  
**KPIs:** Visitantes/semana, conversiones desde canales orgánicos  
**Límite:** No crear cuentas en plataformas sin aprobación. No publicar sin revisión.  

### Finance Agent — Claude Code
**Responsabilidad:** MRR tracking, coste API Anthropic, proyecciones, Stripe reporting  
**Herramientas:** FORGE_METRICS_SYSTEM.md, datos de Stripe (cuando existan)  
**KPIs:** MRR, churn, CAC, LTV, margen bruto  
**Límite:** Solo reporta — no configura pagos sin aprobación  

### Coder Agent — aios-coder (Ollama: qwen2.5:3b)
**Responsabilidad:** Snippets de código rápidos, refactors menores, revisión de tipos  
**Herramientas:** `ollama run aios-coder`  
**Activar cuando:** Tarea de código bien definida que no requiere contexto completo del repo  
**Límite:** Solo código — no toca arquitectura ni base de datos  

### Operations Agent — Ruv Swarm (MCP mode)
**Responsabilidad:** Orquestación de tareas paralelas, gestión de backlog, sprints automáticos  
**Herramientas:** `ruv-swarm mcp start`  
**Estado:** Instalado, no integrado en flujo de trabajo todavía  
**Activar cuando:** Hay 5+ tareas independientes que ejecutar en paralelo  

---

## Flujo de trabajo estándar

```
Marcos identifica necesidad
    ↓
CEO Agent (Claude Code) define scope y prioridad
    ↓
¿Es research? → Research Agent (Hermes)
¿Es código? → Product Agent (Claude Code)
¿Es contenido? → Content Agent (aios-content)
¿Es análisis? → Analyzer Agent (aios-analyzer)
    ↓
Output revisado por Marcos
    ↓
Aprobado → Ejecutado → Documentado en backlog
```

---

## Protocolo de escalación

| Situación | Acción |
|-----------|--------|
| Bug crítico (app caída) | Product Agent inmediato, CEO aprueba fix |
| Decision de pricing | CEO Agent solo — no delegar |
| Contenido público | Content Agent borrador → Revisión humana → Publicar |
| Gasto >€50 (API, herramienta) | CEO aprueba siempre |
| Cambio en modelo de datos | CEO + Product Agent en conjunto |
| Lanzamiento de feature | CEO aprueba, Product ejecuta |

---

## Herramientas por agente

| Agente | CLI / Tool | Cuándo usar |
|--------|-----------|------------|
| CEO | Claude Code (Sonnet) | Siempre — es el default |
| Research | `hermes chat` | Deep research, análisis de mercado |
| Analyzer | `ollama run aios-analyzer` | Datos, métricas, patrones |
| Content | `ollama run aios-content` | Drafts de copy y posts |
| Coder | `ollama run aios-coder` | Snippets rápidos |
| Operations | `ruv-swarm mcp start` | Tareas paralelas en swarm |

---

## KPIs organizacionales

| KPI | Frecuencia | Target |
|-----|-----------|--------|
| Features shipped | Semanal | ≥2 |
| Bugs críticos abiertos | Diario | 0 |
| MRR | Mensual | +20%/mes |
| DAU/MAU | Semanal | >0.35 |
| Contenido publicado | Semanal | ≥3 posts |
| Hipótesis validadas | Mensual | ≥2 |

---

## Resumen Fase 6

La organización es lean por diseño: 1 humano + Claude Code como brazo ejecutor + 4 agentes especializados locales. La clave es no confundir el trabajo: Research no ejecuta código, Content no decide pricing, Finance solo reporta.

**Regla de oro:** Claude Code (Sonnet 4.6) es el agente default para todo. Los demás agentes se activan solo cuando tienen ventaja específica (coste, especialización, paralelismo).

**→ Fase 7:** `FORGE_EXECUTION_SYSTEM.md` + `FORGE_MASTER_BACKLOG.md`
