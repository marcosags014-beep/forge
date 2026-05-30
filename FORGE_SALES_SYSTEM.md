# FORGE — Sales System
**Fase 10 completada:** 2026-05-30

---

## Embudo de conversión completo

```
TRÁFICO ORGÁNICO
(Reddit, Twitter, SEO, referidos)
        ↓
LANDING (/pricing)
  → Entender propuesta de valor
  → Ver social proof
  → CTA: "Start Free" o "Try Pro 14 days"
        ↓
ONBOARDING (/setup)
  → 5 pasos, ~3 minutos
  → Primer Life Score visible
  → Oracle introduce capability
        ↓
ACTIVACIÓN (Day 1-3)
  → Usuario logea datos 3+ días consecutivos
  → Hace su primera consulta a Oracle
  → Habit streak > 1
        ↓
CONVERSIÓN (Day 3-14)
  → Encuentra feature bloqueada (Oracle límite, historial)
  → Ve upgrade prompt contextual
  → Stripe Checkout → Pro activado
        ↓
RETENCIÓN (Month 1+)
  → Life Score sube con uso consistente
  → Weekly Review AI entrega valor real
  → Streak psicológico evita churn
        ↓
REFERIDO
  → Usuario comparte insight llamativo
  → Link de referido en perfil
  → +1 mes gratis por conversión referida
```

---

## Feature Gates (Free vs Pro)

| Feature | Free | Pro (€14.99/mes) |
|---------|------|-----------------|
| Tracking básico (vitals, workouts, habits, journal) | ✅ ilimitado | ✅ ilimitado |
| Life Score diario | ✅ | ✅ |
| Historial últimos 30 días | ✅ | ✅ |
| Historial ilimitado | ❌ | ✅ |
| Oracle chat | 10 mensajes/mes | ✅ ilimitado |
| Insights básicos (3 máx) | ✅ | ✅ |
| Deep AI Analysis (insights avanzados) | ❌ | ✅ |
| Weekly Review AI | ❌ | ✅ |
| Export datos (CSV/JSON) | ❌ | ✅ |
| Correlación cross-domain | ❌ | ✅ |
| Soporte prioritario | ❌ | ✅ |

**Lógica del gate:** El usuario Free tiene suficiente para ver el valor del producto. Los límites aparecen en los momentos de mayor engagement (después de consultar Oracle 10 veces), no antes de que el usuario entienda por qué pagar.

---

## Stripe — Configuración

### Productos a crear

```
Producto 1: FORGE Pro Monthly
  - Precio: €14.99/mes
  - Recurring: monthly
  - Trial: 14 días sin tarjeta (o con tarjeta, decidir)
  
Producto 2: FORGE Pro Annual
  - Precio: €119.88/año (€9.99/mes equivalente — 33% descuento)
  - Mostrar precio anual prominentemente
  - Badge "Save 33%"
```

### Flujo de pago

```
Usuario en app → Encuentra gate → Modal "Upgrade to Pro"
  ↓
/pricing → CTA "Start 14-day free trial"
  ↓
Stripe Checkout (hosted by Stripe)
  - Email + tarjeta
  - Resumen: "€0 hoy, €14.99 en 14 días"
  ↓
Webhook stripe → actualizar cuenta Pro en Supabase
  ↓
Redirect a /welcome-pro
  ↓
Email automático: "You're now FORGE Pro" + qué features tiene
```

### Variables de entorno necesarias

```
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_PRO_ANNUAL_PRICE_ID=price_...
```

---

## Upgrade Prompts — Diseño UX

**Principio:** El prompt aparece en contexto, nunca como interrupción forzada.

### Oracle — al llegar a 10 mensajes
```tsx
// En oracle/page.tsx, cuando messageCount >= 10:
<div className="border border-orange-500/30 rounded-lg p-4 bg-orange-500/5">
  <p className="text-sm text-muted-foreground">
    You've used your 10 free Oracle messages this month.
  </p>
  <p className="font-medium mt-1">
    Unlock unlimited conversations with FORGE Pro
  </p>
  <Button className="mt-3 w-full">
    Start 14-day free trial →
  </Button>
</div>
```

### Historial — al intentar ver >30 días
```tsx
// En review/page.tsx, cuando selectedPeriod > 30:
<div className="...">
  <Lock className="text-orange-500" />
  <p>Full history requires FORGE Pro</p>
  <Button>Upgrade to view all data</Button>
</div>
```

### Weekly Review — feature bloqueada
```tsx
// En /review, sección AI Review:
<div className="blur-sm pointer-events-none">
  {/* preview del review */}
</div>
<div className="absolute inset-0 flex items-center justify-center">
  <Button>Unlock AI Weekly Review</Button>
</div>
```

---

## Onboarding email sequence

### Email 1 — Inmediato tras registro
```
Asunto: "Welcome to FORGE — your Life Score starts now"

Cuerpo:
Hi [nombre],

Your FORGE account is active.

One thing to do in the next 10 minutes:
→ Complete your Setup at [link]
(takes 3 minutes, unlocks your first Life Score)

What is the Life Score?
A single number (0-100) that combines your health, 
body, wealth, and mind — updated every day you log data.

See you inside,
Marcos @ FORGE
```

### Email 2 — Día 3 (si no completó setup O no ha vuelto en 2 días)
```
Asunto: "Your Life Score is waiting"

Cuerpo:
Hey [nombre],

Your FORGE dashboard has been waiting for data.

The fastest way to get value from it:
1. Log your sleep from last night (30 seconds)
2. Ask Oracle: "How do I get the most out of FORGE?"

Oracle has context about your goals and will give you 
a personalized answer.

[button: Open FORGE]
```

### Email 3 — Día 7
```
Asunto: "Your first week in FORGE"

Si tiene datos:
"Your average Life Score this week: [X]
Your best day: [día]
Your lowest point: [día + qué bajó]
Oracle observation: [usar API Anthropic para generar insight real]"

Si no tiene datos:
"Tracking takes 2 minutes a day. Here's why it's worth it: [link a caso de uso real]"

CTA: Si free → "You have [N] Oracle messages left. Pro removes the limit."
```

---

## Pricing Page — Copywriting

### Headline
```
"Your entire life, scored.
 One number. Every day. Fully private."
```

### Subheadline
```
"FORGE combines your health, wealth, body, and mind 
 into a single Life Score — then uses AI to connect the dots."
```

### Social proof (cuando exista)
```
"[Nombre, rol] — 'Finally understand why my productivity 
crashes every Q4. Turns out it's finances + sleep, not motivation.'"
```

### Plan Free — copy
```
Free, siempre gratis
✓ Life Score diario
✓ Tracking de vitals, workouts, habits, finanzas
✓ 30 días de historial
✓ 10 mensajes de Oracle al mes

Start free →
```

### Plan Pro — copy
```
€14.99 / mes
o €9.99/mes facturado anual

✓ Todo lo del plan Free
✓ Oracle ilimitado
✓ Historial completo
✓ AI Weekly Review
✓ Deep insights y correlaciones
✓ Export de tus datos

Start 14-day free trial →
No credit card required*
```

---

## Métricas de ventas

| Métrica | Target Mes 1 | Target Mes 2 | Target Mes 3 |
|---------|-------------|-------------|-------------|
| Conversión Free→Pro | — | 8% | 10% |
| Trial→Paid | — | 60% | 65% |
| Churn mensual | — | <15% | <10% |
| MRR | €0 | €225 | €750 |
| Usuarios Pro | 0 | 15 | 50 |
| ARPU | €14.99 | €14.99 | €15.50 |
| CAC orgánico | €0 | €0 | €0 |

---

## Customer Success — mínimo viable

**Para los primeros 50 usuarios:**
- Email personal de Marcos a cada usuario en Día 1 ("Hola, soy Marcos el founder. ¿Cómo te puedo ayudar a sacarle el máximo partido?")
- Canal de Slack/Discord para beta testers (feedback en tiempo real)
- Iteración semanal basada en feedback directo

**Para escalar (50+ usuarios):**
- FAQ en /help
- Chatbot básico con FAQs más comunes
- Tutorial interactivo en onboarding (tooltip tour)

---

## Resumen Fase 10

**La conversión depende de 3 cosas:**
1. El usuario entiende el Life Score en los primeros 5 minutos → onboarding
2. Oracle entrega valor en Day 1 → datos de setup como contexto inicial
3. El gate aparece en el momento de mayor valor percibido → Oracle al límite 10

**Riesgo principal:** Si Stripe no está integrado, el MRR es literalmente €0. Es la tarea más crítica del Sprint 2.

**→ Fase 11:** `FORGE_METRICS_SYSTEM.md`
