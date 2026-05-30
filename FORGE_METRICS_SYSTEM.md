# FORGE — Metrics System
**Fase 11 completada:** 2026-05-30

---

## North Star Metric

**MRR (Monthly Recurring Revenue)**

El MRR encapsula todo: adquisición, activación, retención y conversión. Si sube, el negocio funciona. Si baja, hay que diagnosticar cuál de los 4 vectores falló.

---

## KPIs por capa

### Negocio
| KPI | Fórmula | Frecuencia | Target Mes 3 |
|-----|---------|-----------|-------------|
| MRR | Usuarios Pro × €14.99 | Mensual | €750 |
| Churn rate | Bajas Pro / Total Pro × 100 | Mensual | <10% |
| CAC | Coste adquisición / Nuevos usuarios | Mensual | <€5 (orgánico) |
| LTV | ARPU / Churn rate | Mensual | >€150 |
| MRR Growth | (MRR actual - MRR anterior) / anterior | Mensual | +40% |

### Producto
| KPI | Fórmula | Frecuencia | Target |
|-----|---------|-----------|--------|
| DAU/MAU | Usuarios activos día / activos mes | Semanal | >0.35 |
| Day 7 Retention | Usuarios activos Día 7 / registrados Día 0 | Por cohorte | >30% |
| Day 30 Retention | Usuarios activos Día 30 / registrados Día 0 | Por cohorte | >15% |
| Activation rate | Usuarios con ≥3 días de datos / total registrados | Semanal | >50% |
| Oracle messages/usuario activo | Total mensajes / DAU | Semanal | >2/sesión |
| Life Score entries/semana | Total logs diarios / semana | Semanal | >5 entradas/usuario |

### Crecimiento
| KPI | Fórmula | Frecuencia | Target Mes 3 |
|-----|---------|-----------|-------------|
| Visitantes únicos | Plausible: unique visitors | Semanal | 8,000 |
| Sign-up rate | Registros / Visitantes únicos | Semanal | >5% |
| Fuentes de tráfico | Plausible: referrers | Semanal | Reddit >40% |
| Viral coefficient | Referidos por usuario / conversión referidos | Mensual | >0.15 |

---

## Tracking Setup

### Plausible Analytics (prioridad)

**Instalar en `layout.tsx` o `layout-shell.tsx`:**
```html
<script 
  defer 
  data-domain="forge-os.com" 
  src="https://plausible.io/js/script.js">
</script>
```

**Eventos custom a trackear:**
```typescript
// En oracle/page.tsx — al enviar mensaje:
window.plausible?.('Oracle Message Sent')

// En onboarding — al completar setup:
window.plausible?.('Setup Completed')

// Al ver pricing page:
window.plausible?.('Pricing Viewed')

// Al iniciar checkout:
window.plausible?.('Checkout Started')

// Al completar upgrade:
window.plausible?.('Upgraded to Pro', { props: { plan: 'monthly' } })
```

### Dashboard de métricas interno (futuro)

Una vez con usuarios reales y Supabase, crear `/admin/metrics` con:
- MRR actual vs target
- Cohorte de retención (tabla Day 1/3/7/14/30)
- Top fuentes de tráfico
- Oracle usage por usuario
- Life Score promedio de usuarios activos

---

## Cohorte de retención — template

```
Semana de registro | D1 | D3 | D7 | D14 | D30
-------------------|----|----|----|----|----
2026-W22 (launch)  | —  | —  | —  | —  | —

(Completar cuando haya usuarios reales)
```

**Cómo leer la cohorte:**
- D1 > 80%: El onboarding funciona (llegan al primer valor)
- D7 > 30%: El hook de retención funciona (Life Score diario, streak)
- D30 > 15%: El producto tiene retención real
- Si D1 alto pero D7 bajo: El problema está entre Día 1 y Día 7

---

## Coste de API (Anthropic)

### Cálculo de coste por usuario

```
Escenario conservador (usuario casual):
  - 2 consultas Oracle/día × 30 días = 60 consultas/mes
  - ~500 tokens entrada + ~300 tokens salida por consulta
  - 60 × (500 × $3/1M + 300 × $15/1M) = 60 × ($0.0015 + $0.0045) = $0.36/mes
  → ~€0.33/usuario Pro/mes

Escenario power user (5 consultas/día):
  - 5 × 30 = 150 consultas/mes
  - Mismo cálculo × 2.5 = €0.83/mes
```

**Con rate limiting (20 req/min):** El coste máximo por usuario es controlable.

### Proyección de coste API

| Usuarios Pro | Coste API est. | MRR | Margen |
|-------------|----------------|-----|--------|
| 15 | €7 | €225 | 97% |
| 50 | €25 | €750 | 97% |
| 130 | €60 | €1,950 | 97% |
| 400 | €185 | €5,994 | 97% |

**Conclusión:** El margen del negocio es ~97% por la baja intensidad de uso de la API. Si aumenta el uso, activar Ollama como fallback para consultas no críticas.

---

## Alertas y umbrales

| Alerta | Umbral | Acción |
|--------|--------|--------|
| MRR cae | >5% en una semana | Revisar churn, contactar usuarios que cancelaron |
| Coste API | >€50/mes | Revisar rate limits, activar caché de respuestas |
| Day 7 retention | <20% | Urgente: revisar onboarding y push notifications |
| Activation rate | <30% | Simplificar Setup, mejorar guided first actions |
| Oracle usage | <1 msg/usuario/semana | Oracle no está entregando valor — revisar prompts |

---

## Weekly Metrics Review (domingo)

```
Checklist semanal:

□ DAU/MAU ratio (Plausible)
□ Nuevos registros
□ Fuentes de tráfico principales
□ Oracle mensajes enviados (total)
□ MRR (si hay Stripe)
□ Cualquier usuario que canceló → entender por qué
□ Actualizar dashboard en FORGE_EXECUTION_SYSTEM.md
```

**Tiempo:** 15 minutos cada domingo.

---

## Resumen Fase 11

**El único número que importa hoy:** MRR = €0. Cada tarea del backlog debe evaluarse con la pregunta: "¿Esto mueve el MRR hacia €500?"

**Las métricas sin Plausible son ciegas.** PROD-014 (instalar Plausible) tiene que entrar en el Sprint 2 sin falta.

**La retención Day 7 es el KPI más predictivo de revenue.** Si Day 7 > 30%, los usuarios pagan. Si Day 7 < 20%, hay que resolver el problema antes de escalar adquisición.

**→ Fase 12:** `FORGE_UI_STRATEGY.md`
