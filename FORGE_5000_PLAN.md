# FORGE — Plan €5,000 MRR
**Fase 16 completada:** 2026-05-30

---

## El posicionamiento correcto (validado por análisis de mercado)

**No posicionar como:** "App de productividad, salud y finanzas"
**Posicionar como:** "El sistema que te ayuda a tomar mejores decisiones cada día"

La oportunidad no está en ser el mejor tracker de cualquiera de esas categorías. Está en ser el único que conecta todas y genera recomendaciones concretas. Ese es el moat.

**Tagline actualizado:** "Your life, scored. Your decisions, optimized."

---

## Situación de partida

| Variable | Hoy (2026-05-30) | Target €5K |
|---------|-----------------|------------|
| MRR | €0 | €5,000 |
| Usuarios Pro | 0 | 334 |
| Usuarios Free | 0 | 3,340 |
| Deploy | ❌ | ✅ 6+ meses |
| Stripe | ❌ | ✅ |
| Auth | ❌ | ✅ |
| Retención D7 | — | >35% |
| Canal principal | — | Reddit+Twitter |

---

## Los 4 motores de crecimiento hacia €5K

### Motor 1: Producto (retención)
Sin un producto que retenga, escalar adquisición es tirar dinero.
**Target:** Day 7 retention >35% antes de escalar cualquier canal

Palancas:
- Push notifications (mayor impacto single)
- Life Score como gancho emocional diario
- Oracle con contexto rico desde Day 1
- Weekly Review AI (feature Pro de alto valor)

### Motor 2: Distribución orgánica (adquisición)
Reddit + Twitter son los canales de €0 → €2K MRR.
**Target:** 1 post de Reddit con >200 upvotes en primeros 60 días

Palancas:
- Historia personal real con datos de FORGE
- Timing: martes/miércoles por la mañana
- Crosspost a 3-4 subreddits relacionados

### Motor 3: Conversión (monetización)
Stripe + gates bien diseñados convierten tráfico en MRR.
**Target:** 10% Free → Pro conversion

Palancas:
- Gate en Oracle al mensaje 10 (alto valor percibido)
- 14-day trial sin tarjeta (reduce fricción)
- Pricing page con social proof real

### Motor 4: Referidos (amplificación)
Un programa simple (1 mes gratis por referido convertido) puede representar el 15-20% de nuevos usuarios en Mes 3+.

---

## Ruta crítica hacia €5K

```
FASE A (Mes 1): Deploy + primeros usuarios (€0 → €0, pero con tracción)
  → Git + deploy Vercel
  → Rate limiting activo
  → 10 beta testers manuales
  → Plausible instalado

FASE B (Mes 2): Primera monetización (€0 → €225)
  → Supabase Auth
  → Stripe Checkout
  → Feature gates
  → Product Hunt preparado
  → 15 usuarios Pro

FASE C (Mes 3): Escala inicial (€225 → €750)
  → Product Hunt launch
  → Push notifications
  → Campaña Reddit activa
  → 50 usuarios Pro

FASE D (Mes 4-5): Momentum (€750 → €2,500)
  → CSV import finanzas
  → Apple Health/Google Fit (si hay demanda)
  → Programa de referidos
  → Dominio + SEO inicial
  → 170 usuarios Pro

FASE E (Mes 6): €5K en vista (€2,500 → €5,000)
  → Plan anual prominente
  → Outreach B2B (coaches, nutricionistas)
  → 1 canal de contenido sostenido (newsletter o podcast)
  → 334 usuarios Pro
```

---

## Análisis de oportunidades — Priorización por ROI

*(Basado en análisis estratégico de mercado)*

### Nivel 1 — Alto ROI (implementar en primeros 90 días)

| Oportunidad | Estado FORGE | Acción |
|-------------|-------------|--------|
| FORGE Score (Life Score) | ✅ Implementado | Mejorar comunicación del concepto |
| Daily Command Center | ✅ Implementado | Añadir "qué hacer hoy" basado en datos |
| Sistema de Decisiones (Oracle) | ✅ Implementado | Mejorar contexto inicial (setup → Oracle) |
| Sistema de Priorización | ⚠️ Parcial | Oracle recomienda pero no prioriza tareas explícitamente |

**Brecha más valiosa a cerrar:** "Daily Command Center" debería mostrar 3 acciones prioritarias basadas en el Life Score y datos actuales. Oracle ya puede generarlas — solo falta mostrarlas prominentemente.

### Nivel 2 — Medio ROI (Mes 3-6)

| Oportunidad | Descripción | Esfuerzo |
|-------------|-------------|---------|
| Motor de Energía | Detectar horas de máximo rendimiento con datos de HRV + sueño | Medio |
| Mentor Personal IA | Oracle con contexto más profundo de objetivos a largo plazo | Bajo |
| Dashboard Integral | Vista única limpia — el Command Center ya lo hace | Bajo |

### Nivel 3 — Validar con usuarios reales

| Oportunidad | Hipótesis | Validar cómo |
|-------------|----------|-------------|
| Coste de Oportunidad | "3h en redes = X€ de objetivo no cumplido" | Entrevistar 5 beta users |
| Priorización automática de tareas | FORGE sugiere qué hacer antes | ¿Tiene suficientes datos del usuario? |
| Coaching avanzado | Recomendaciones de cambio de comportamiento | Requiere historial de 30+ días |

---

## Features que mueven el MRR (ranking)

| Feature | Impacto en MRR | Esfuerzo | Prioridad |
|---------|---------------|---------|-----------|
| Stripe integration | 10/10 (sin esto €0 siempre) | Alto | P0 |
| Push notifications | 9/10 (retención +15%) | Medio | P0 |
| Oracle ilimitado (gate) | 8/10 (mayor motivación de upgrade) | Bajo | P0 |
| Weekly Review AI | 7/10 (feature Pro de alto valor) | Bajo | P1 |
| CSV import finanzas | 7/10 (activa Wealth = activa Life Score) | Medio | P1 |
| Daily "top 3 actions" | 7/10 (diferenciación + retención) | Bajo | P1 |
| Programa referidos | 6/10 (amplificación) | Bajo | P2 |
| Plan anual | 6/10 (reduce churn, aumenta LTV) | Muy bajo | P1 |
| Apple Health | 6/10 (activa Vitals automáticamente) | Alto | P2 |
| Motor de energía | 5/10 (nice-to-have) | Medio | P3 |

---

## El feature más subestimado: "Top 3 actions" en Command Center

**Qué es:** Al inicio de cada día, FORGE genera (vía Oracle o algoritmo simple) 3 acciones prioritarias basadas en:
- Life Score más bajo (qué dominio hay que mejorar)
- Hábitos más importantes del día
- Contexto de la semana (final de mes → finanzas; bajo HRV → descanso)

**Ejemplo de output:**
```
Today's Focus (Life Score: 64 ↓3)

1. Sleep by 22:30 — Your HRV has been below baseline for 3 days
2. Log one financial transaction — Wealth score is 0 without data
3. Complete your morning journal — Mind score drives 25% of your Life Score
```

**Por qué es valioso:** Es el Daily Command Center descrito en el análisis de mercado. Reduce la fatiga de decisión. Genera valor inmediato cada día. Es el mejor argumento para volver a la app mañana.

**Esfuerzo estimado:** 2-3 horas de desarrollo. ROI altísimo.

---

## Modelo financiero hacia €5K

| Mes | Free | Pro | MRR | Crecimiento |
|-----|------|-----|-----|-------------|
| 1 | 50 | 0 | €0 | — |
| 2 | 200 | 15 | €225 | — |
| 3 | 500 | 50 | €750 | 233% |
| 4 | 1,100 | 110 | €1,650 | 120% |
| 5 | 2,200 | 220 | €3,300 | 100% |
| 6 | 3,500 | 334 | €5,009 | 52% |

**Hipótesis clave:**
- Conversión Free→Pro: 10%
- Churn mensual Pro: 8%
- Crecimiento usuarios Free: 40%/mes (meses 2-4), 30%/mes (meses 5-6)

**€5K MRR requiere ~334 usuarios Pro.** Con 10% conversion rate, necesitas 3,340 usuarios Free. Con 5% conversion (más conservador), necesitas 6,680. El crecimiento orgánico debe sostenerse.

---

## Riesgos y mitigaciones

| Riesgo | Prob | Impacto | Mitigación |
|--------|------|---------|-----------|
| Retención D7 < 20% | Media | Crítico | Implementar push notifications antes de escalar |
| Conv Free→Pro < 5% | Media | Alto | A/B test gates y pricing page |
| Post Reddit no viral | Alta | Medio | Preparar 5 posts distintos, testear formatos |
| Anthropic sube precios | Baja | Medio | Rate limiting + caché de respuestas |
| Competidor copia el concepto | Media | Bajo | El moat es el contexto de datos del usuario, no la UI |

---

## Resumen Fase 16

**El camino a €5K MRR no es complejo:** Lanzar → retener → convertir → amplificar.

**La decisión más importante:** No escalar adquisición hasta que D7 retention > 30%. Traer 1,000 usuarios con D7 del 15% es peor que traer 300 con D7 del 40%.

**La feature más valiosa no implementada:** "Top 3 daily actions" en el Command Center. Es el Daily Command Center del análisis de mercado. Alto impacto, bajo esfuerzo.

**→ Fase 17:** Continuous Operation Mode
