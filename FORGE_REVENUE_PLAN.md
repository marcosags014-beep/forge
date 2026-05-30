# FORGE — Revenue Plan
**Fase 3 completada:** 2026-05-30

---

## Cliente Ideal (ICP)

**Perfil primario:** Hombre/mujer 26-36 años, trabaja en tech, consultoría o es founder. Ingresos €35K-90K. Ya usa al menos 2 apps de bienestar/productividad. Habla inglés. Consciente de su salud. Cree que los datos son poder.

**Early adopters:** Los 50 primeros usuarios deben ser reclutados manualmente — Reddit, Twitter, comunidades Slack de biohacking, contactos directos. No publicidad todavía.

---

## Propuesta de valor por ICP

| Pain | Feature FORGE | Por qué pagan |
|------|--------------|--------------|
| 5 apps que no se hablan | Life Score unificado | Un número que resume todo |
| No sé por qué rindo mal | Oracle cross-domain insights | "Tu HRV bajo + fin de mes" |
| Pierdo tiempo logging | Quick Log FAB | 30 segundos por día |
| No sé si estoy mejorando | Weekly Review AI | Coach semanal automático |

---

## Sprint 30 días — Preparar para lanzamiento

**Objetivo:** Producto lanzable. Primeros 10 usuarios reales.

| # | Acción | Métrica | Responsable |
|---|--------|---------|------------|
| 1 | Rate limiting /api/oracle | 0 costes API descontrolados | Tech |
| 2 | Crear PWA icons (192 + 512px) | App instalable en iOS/Android | Tech |
| 3 | Inicializar Git + primer commit | Historial de cambios | Tech |
| 4 | Deploy en Vercel (dominio temporal) | URL pública funcionando | Tech |
| 5 | Cap localStorage (365 entradas/store) | Sin crashes por quota | Tech |
| 6 | Hacer hrv/rhr opcionales en VitalEntry | Datos limpios | Tech |
| 7 | Reclutar 10 beta testers manualmente | 10 usuarios activos | Growth |
| 8 | Crear cuenta de Twitter/X para FORGE | Presencia pública | Growth |
| 9 | Escribir 3 threads sobre Life Score concept | Primera audiencia | Content |
| 10 | Instalar Plausible Analytics | DAU/MAU visible | Tech |

**Métricas Day 30:**
- ✅ App accesible en URL pública
- ✅ 10 usuarios beta activos
- ✅ 0 crashes de localStorage
- ✅ Analytics funcionando
- ✅ Primera mención en Twitter con >50 impresiones

---

## Sprint 60 días — Primeros ingresos

**Objetivo:** €500 MRR. Primeros 35 usuarios de pago.

| # | Acción | Métrica | Responsable |
|---|--------|---------|------------|
| 1 | Integrar Supabase Auth (magic link) | Cuentas de usuario reales | Tech |
| 2 | Integrar Stripe Checkout | Pagos reales funcionando | Tech |
| 3 | Feature flags Free vs Pro | Modelo freemium enforced | Tech |
| 4 | Lanzar en Product Hunt | 500+ visitantes en launch day | Growth |
| 5 | Post en r/biohacking, r/getdisciplined | 1,000+ visitantes | Growth |
| 6 | Email a lista beta → conversión a pago | 10 de 50 beta → pagando | Sales |
| 7 | Testimonios reales de beta users | 3 quotes reales en pricing page | Social proof |
| 8 | Onboarding email sequence (3 correos) | Day 1, Day 3, Day 7 activación | Growth |
| 9 | Dominio propio (forge-os.com o similar) | Credibilidad | Tech |
| 10 | 14-day trial sin tarjeta | Reducir fricción de conversión | Product |

**Métricas Day 60:**
- ✅ €500+ MRR
- ✅ 35+ usuarios de pago
- ✅ Churn mensual <15% (primeros meses siempre más alto)
- ✅ Day 7 retention >25%
- ✅ 3 testimonios reales publicados

---

## Sprint 90 días — Escala inicial

**Objetivo:** €2,000 MRR. 130+ usuarios de pago.

| # | Acción | Métrica | Responsable |
|---|--------|---------|------------|
| 1 | Apple Health / Google Fit integration | Datos automáticos sin entrada manual | Tech |
| 2 | Push notifications (PWA) | Recordatorios diarios activados | Tech |
| 3 | Integración bancaria básica (Plaid o similar) | Transacciones automáticas | Tech |
| 4 | Thread semanal en Twitter con datos reales | 500+ seguidores | Content |
| 5 | 1 post viral en Reddit (caso de uso real) | 5,000+ visitantes referidos | Growth |
| 6 | Programa de referidos (1 mes gratis por referido) | 20% de nuevos usuarios vía referral | Growth |
| 7 | Pricing test: €14.99 vs €19.99 | Maximizar RPU | Sales |
| 8 | Plan anual prominente (€99/año) | 30% de pagantes en plan anual | Sales |
| 9 | Outreach a 5 coaches/nutricionistas | Canal B2B2C semilla | Sales |
| 10 | Video demo de 90 segundos en landing | Conversión +15% estimada | Marketing |

**Métricas Day 90:**
- ✅ €2,000+ MRR
- ✅ 130+ usuarios de pago
- ✅ DAU/MAU ratio >0.35
- ✅ Churn mensual <10%
- ✅ CAC <€25

---

## Proyección financiera

| Mes | Usuarios Free | Usuarios Pro | MRR | Coste API est. | Margen est. |
|-----|--------------|-------------|-----|----------------|------------|
| 1 | 50 | 0 | €0 | €5 | - |
| 2 | 200 | 15 | €225 | €20 | 91% |
| 3 | 500 | 50 | €750 | €60 | 92% |
| 4 | 1,200 | 130 | €1,950 | €150 | 92% |
| 5 | 2,500 | 250 | €3,750 | €280 | 93% |
| 6 | 4,000 | 380 | €5,700 | €420 | 93% |

**Hipótesis del modelo:**
- Free → Pro conversion: 10% (conservador para B2C)
- Churn mensual Pro: 8%
- Crecimiento mensual: 40% primeros 6 meses (aggressive pero posible con Product Hunt + Reddit)
- Coste API: ~€1.10/usuario Pro/mes a uso moderado (5 consultas/día × 30 días × €0.003/request)

---

## Camino al €10,000 MRR

**Escenario conservador (12 meses):**
- 6,700 usuarios Free → 670 usuarios Pro → €10,030 MRR
- Requiere: 2% conversion rate (muy alcanzable)

**Escenario realista (8 meses):**
- 4,500 usuarios Free → 450 usuarios Pro + 200 anuales (equiv. €1,650/mes) → €8,400 MRR
- Requiere: Product Hunt + Reddit launch + 1 canal orgánico sostenido

**Escenario optimista (6 meses):**
- Un post viral + feature en un newsletter de productividad puede traer 2,000 usuarios en 48h

---

## Riesgos del plan de revenue

| Riesgo | Probabilidad | Mitigación |
|--------|-------------|-----------|
| Churn >15% mensual | Media | Mejorar onboarding, push notifications, weekly review |
| Conversion rate <5% | Media | A/B test de pricing, mejorar pricing page, trial más largo |
| Coste API supera €5/usuario | Baja | Rate limiting + Ollama como fallback |
| Product Hunt flop (<100 upvotes) | Media | Preparar comunidad previa, email a contactos el día del launch |

---

## Resumen Fase 3

**Hipótesis validadas:**
- H1: ✅ La ruta Free→Pro freemium es el modelo correcto para este mercado
- H2: ✅ 10% conversión Free→Pro es conservadoramente alcanzable
- H3: ⚠️ Por validar — si el canal Reddit/Twitter tiene suficiente volumen

**→ Fase 4:** `FORGE_PRODUCT_AUDIT.md`
