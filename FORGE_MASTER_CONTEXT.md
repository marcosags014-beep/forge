# FORGE — Master Context Document

**Versión:** 1.0  
**Fecha:** 2026-05-30  
**Estado del producto:** MVP funcional · No lanzado · En desarrollo activo  
**Fuente de verdad:** Este documento debe actualizarse ante cualquier cambio estratégico.

---

## 1. Qué es FORGE

FORGE es un sistema operativo personal — una sola aplicación que unifica el seguimiento de salud, fitness, finanzas, objetivos, hábitos, tareas y journaling, con una capa de inteligencia artificial que ve las conexiones entre todos los dominios simultáneamente.

**Frase de posicionamiento:**  
*"The all-in-one Life OS for people with big ambitions and limited time."*

**La idea central:**  
La mayoría de las aplicaciones de bienestar son siloed. Whoop mide tu sueño. YNAB mide tu dinero. Strava mide tus entrenamientos. Ninguna sabe que tu peor semana financiera coincide con tu HRV más bajo, o que tu energía cae siempre el miércoles porque no duermes bien el martes. FORGE sí lo sabe. Y te lo dice.

---

## 2. Para quién es FORGE

### Perfil primario: El Ambitious Builder

- **Edad:** 24–40 años
- **Mentalidad:** Orientado al rendimiento. Lee sobre biohacking, finanzas personales, productividad. Tiene grandes ambiciones y siente que el tiempo es su recurso más escaso.
- **Comportamiento actual:** Usa 3–6 apps distintas: un tracker de fitness, una app de finanzas, Notion para metas, quizás un diario. Siente que nada está conectado.
- **Dolor principal:** Información fragmentada → decisiones desinformadas → sensación de no progresar a pesar del esfuerzo.
- **Emoción clave:** Quiere sentir que tiene su vida bajo control y que cada día importa.

### Segmentos secundarios

| Segmento | Por qué les encaja FORGE |
|----------|--------------------------|
| Emprendedores / founders | Necesitan gestionar rendimiento personal como gestionan su empresa — con datos |
| Atletas amateurs | Quieren la profundidad de Whoop sin pagar €200/año por el dispositivo |
| Estudiantes de postgrado | Alto estrés, poco presupuesto, necesitan optimizar cada área |
| Profesionales con burnout | Quieren identificar qué los está agotando — FORGE puede mostrarlo |

### Quién NO es el usuario objetivo
- Personas sin hábito de tracking previo (curva de aprendizaje demasiado alta sin onboarding guiado)
- Usuarios mayores de 55 (requiere alfabetización digital alta)
- Personas que buscan solo una funcionalidad (existen apps mejores para cada nicho aislado)

---

## 3. Qué problema resuelve

### El problema real (no el superficial)

Las personas ambiciosas toman malas decisiones — no por falta de ambición, sino por **falta de visibilidad sistémica de sí mismas**.

Ejemplos concretos:
- Un founder lleva 3 semanas de bajo rendimiento. No sabe que su HRV lleva 21 días en declive y que está cognitivamente operando al 60%.
- Una profesional se pregunta por qué gasta de más en food delivery. No ha conectado que sus gastos impulsivos suben siempre la semana que su estado de ánimo está bajo.
- Un atleta amateur se lesiona. Había ignorado 8 días consecutivos de readiness baja que FORGE habría detectado.

**FORGE no es una app de tracking. FORGE es un sistema de alertas tempranas para tu vida.**

### La solución en una frase

> "Tu Life Score es un número de 0 a 100 que refleja tu rendimiento real en salud, cuerpo, finanzas y mente. Si baja, Oracle te dice exactamente por qué y qué hacer."

---

## 4. Módulos y funcionalidades actuales

### Command Center (`/`)
- Life Score Ring: 0–100, color-coded (verde/amarillo/rojo), animación SVG
- Daily Call: GREEN / YELLOW / RED basado en readiness del día
- 4 Domain Pills: Health, Body, Wealth, Mind con trend arrows
- AI Morning Brief: narración generada por Claude con contexto de todos los datos
- Insight Flash: tarjetas de insights críticos con dismiss
- Quick tasks + habit checklist con streaks
- Achievement unlock badge

### Vitals (`/vitals`)
- Logging: horas de sueño, calidad de sueño, HRV, RHR, energía (1-10), humor (1-10), notas
- Readiness Score: `sleep×0.35 + HRV×0.30 + energy×0.20 + mood×0.15`
- Gráficas 14 días: líneas para cada métrica
- Historial completo con indicador de Daily Call por día

### Body (`/body`)
- **Tab Workouts:** Logger de ejercicios con sets, reps y peso por ejercicio. Historial con duración.
- **Tab Nutrition:** Macros (calorías, proteína, carbos, grasa, agua), lista de comidas del día
- **Tab Body:** Registro de peso corporal, % grasa corporal, tendencia con AreaChart

### Wealth (`/wealth`)
- Logging de ingresos y gastos con categoría, descripción y fecha
- Pie chart de distribución de gastos por categoría
- Bar chart de cash flow mensual (últimos 6 meses)
- Proyecciones de inversión compuesta: ajustable por ahorro mensual (€) y retorno anual (1–15%), área chart 0–20 años
- Historial de transacciones (últimas 20)

### Mind (`/mind`) — 4 tabs
- **Habits:** Grid de 7 días por hábito, streak counter, add/delete, toggle por día
- **Tasks:** Lista con prioridades (high/medium/low), due date, link a goal, toggle completado
- **Goals:** Barra de progreso, categorías, milestones, status (active/completed/paused)
- **Achievements:** 16 logros desbloqueables basados en comportamiento real, grid locked/unlocked

### Insights (`/insights`)
- Motor de insights client-side (sin AI): 12 tipos de tarjetas con severidad alert/warning/win/info
- Mental health detection: detecta 3+ días de mood ≤3 → banner con recursos de crisis
- Sleep/Mood Correlation: ScatterChart con coeficiente de Pearson r y label textual
- Deep AI Analysis: envía todos los datos a Claude, devuelve 3–5 insight cards adicionales
- Dismiss individual por insight

### Journal (`/journal`)
- Mood slider diario (1-10)
- Editor libre de texto con contador de palabras
- 7 prompts rotativos para guiar la reflexión
- "Ask Oracle": Oracle lee la entrada y responde con 2-3 frases de coaching
- Navegación por días anteriores
- Lista de entradas recientes

### Review (`/review`)
- Radar chart de los 4 dominios
- Domain Rings con delta semana anterior
- Wins e improvements calculados localmente
- AI Coach Assessment: Claude genera narrativa 150–200 palabras + wins + improvements + focus próxima semana
- Navegación por semanas anteriores

### Oracle (`/oracle`)
- Chat completo con historial persistente (localStorage)
- 5 modos de agente: Life Coach, Health, Fitness, Finance, Planner
- Contexto completo de todos los datos del usuario en cada mensaje
- Starter questions sugeridas
- Clear chat

### Setup (`/setup`) — Onboarding en 5 pasos
1. **Identity:** nombre + foco principal (health/fitness/wealth/mind)
2. **Baseline vitals:** sliders para sueño, HRV, RHR, energía, humor → salva como primera entrada de vitals
3. **Habits:** 3 hábitos iniciales con sugerencias según el foco elegido
4. **Financial goal:** selección de objetivo financiero preestablecido o custom
5. **Meet Oracle:** introducción al AI con mensaje personalizado → redirige al Command Center

### Settings (`/settings`)
- Editar nombre de perfil
- Estadísticas de datos (conteo por módulo)
- Export completo de datos como JSON
- Zona de peligro: reset completo con confirmación

### Pricing (`/pricing`) — Landing page
- Hero + propuesta de valor
- "FORGE replaces all of these" (Whoop, MyFitnessPal, YNAB, Notion) — €289–529/año vs FORGE gratis
- Free tier vs Pro tier (€14.99/mes o €99/año)
- Testimonios (3, actualmente ficticios)
- Sección de confianza (local-first, no data selling)

---

## 5. Arquitectura técnica

### Stack
```
Frontend:    Next.js 16.2.6 + React 19.2.4 + TypeScript 5 (strict)
Styling:     Tailwind CSS v4 + shadcn/ui + custom FORGE design tokens
Charts:      Recharts 3.8.1
Icons:       lucide-react
AI:          Anthropic SDK → claude-sonnet-4-6
Persistence: localStorage (prefijo forge_*)
Deploy:      No deployado — dev local en puerto 3001
PWA:         manifest.json configurado, icons PNG pendientes
```

### Modelo de datos
Todo vive en el browser. 12 claves de localStorage:
```
forge_vitals        — VitalEntry[]    (sueño, HRV, RHR, energía, humor)
forge_workouts      — WorkoutEntry[]  (ejercicios, sets, duración)
forge_nutrition     — NutritionEntry[] (macros diarios)
forge_body          — BodyMetric[]    (peso, % grasa)
forge_finance       — Transaction[]   (ingresos/gastos con categoría)
forge_goals         — Goal[]          (título, progreso %, milestones)
forge_habits        — Habit[]         (nombre, completions: string[])
forge_tasks         — Task[]          (título, prioridad, dueDate)
forge_chat          — ChatMessage[]   (historial Oracle)
forge_journal       — JournalEntry[]  (contenido, mood, fecha)
forge_achievements  — Achievement[]   (logros desbloqueados)
forge_profile       — UserProfile     (nombre, foco, joinedAt)
```

### Scoring Engine (client-side, sin AI)
```
Readiness  = sleep×0.35 + HRV×0.30 + energy×0.20 + mood×0.15   → 0-100
Life Score = health×0.30 + body×0.20 + wealth×0.25 + mind×0.25  → 0-100
Daily Call = GREEN (≥75) | YELLOW (≥50) | RED (<50)
```

### Único endpoint de servidor
`POST /api/oracle` — proxy hacia Anthropic API.  
- Acepta: `mode`, `message`, `agentPrompt`, `history`, `userData`
- Token limits: brief=200, insights=600, review=800, chat=1024
- Sin rate limiting (crítico)
- Sin autenticación (MVP)

---

## 6. Propuesta de valor diferencial

### El argumento central de venta
FORGE no compite con apps de nicho. Compite con el **conjunto de 4-6 apps que el usuario ya usa**. Su propuesta es:

1. **Unificación:** Un solo lugar para todo
2. **Correlación cross-domain:** "Tu gasto en comida a domicilio sube un 40% las semanas con HRV bajo" — ninguna app individual puede decir esto
3. **Life Score:** Una métrica que resume quién eres hoy — más honesta que un mood tracker, más accionable que un fitness score
4. **Oracle:** AI que habla con contexto real, no con contexto genérico de chatbot
5. **Privacidad local-first:** Datos nunca salen del dispositivo sin permiso explícito

### Por qué alguien pagaría €14.99/mes

| Razón | Justificación |
|-------|---------------|
| Reemplaza 4+ apps | El usuario ya paga €50–100/año por apps peores y separadas |
| Oracle es genuinamente útil | Claude claude-sonnet-4-6 con contexto completo → respuestas específicas, no genéricas |
| Life Score crea hábito | Una métrica diaria que sube o baja genera engagement natural |
| Privacy argument | En un mundo post-Cambridge Analytica, "tus datos son tuyos" tiene valor real |
| No hay alternativa directa | Ningún competidor hace exactamente esto |

---

## 7. Análisis competitivo

### Competidores directos (ninguno hace exactamente esto)

| Producto | Hace qué | Precio | Diferencia con FORGE |
|----------|----------|--------|----------------------|
| Whoop | HRV, sueño, recovery | €200 hardware + €30/mes | Solo salud, requiere dispositivo |
| Oura | HRV, sueño, temperatura | €350 anillo + €6/mes | Solo salud, requiere dispositivo |
| MyFitnessPal | Nutrición, calorías | €10/mes | Solo nutrición/fitness, sin AI cross-domain |
| YNAB | Presupuesto personal | €15/mes | Solo finanzas, sin conexión con salud |
| Notion | Notas, gestión personal | €8/mes | Requiere configuración manual, no AI proactiva |
| Headspace/Calm | Meditación, sueño | €13/mes | Solo mental wellness, sin datos de vida |
| Daylio | Mood tracking | Gratis/€3 | Solo humor, sin cross-domain |
| Google Health (lanzado 19 May 2026) | Salud integrada Android | $9.99/mes | Solo salud, sin finanzas, sin mente, sin AI coaching |
| Apple Health | Aggregador de salud | Gratis | Sin AI, sin finanzas, sin goals, requiere iOS |

### Ventana competitiva
Google lanzó su app de salud el 19 de mayo de 2026. Pero es health-only. La **ventana de 12–18 meses** en la que FORGE puede establecerse como el player de Life OS cross-domain es real y estrecha.

### Defensa competitiva a largo plazo
1. **Datos propietarios acumulados:** Cuanto más tiempo usa el usuario FORGE, más difícil es migrar (años de historial)
2. **Network effects del scoring:** Si "Life Score" se convierte en un término reconocido (como "readiness score" de Whoop), crea moat de marca
3. **Herramienta de coaching:** Coaches personales, nutricionistas y psicólogos podrían recomendar FORGE a sus clientes (canal B2B2C)

---

## 8. Estado actual del negocio

### Lo que existe
- ✅ MVP funcional completo con 12 módulos
- ✅ AI integrada (Oracle con claude-sonnet-4-6)
- ✅ Diseño de producto profesional, dark mode, responsive
- ✅ Onboarding completo en 5 pasos
- ✅ Pricing page con copy de conversión
- ✅ PWA manifest (instalable en móvil, icons pendientes)
- ✅ Export de datos como JSON

### Lo que falta para lanzar
- ❌ **Pagos:** No hay Stripe ni ningún sistema de pago integrado
- ❌ **Autenticación:** No hay cuentas de usuario — datos solo locales
- ❌ **Backend/DB:** Sin Supabase, Neon, ni ninguna persistencia en servidor
- ❌ **Sincronización cross-device:** Los datos no se sincronizan entre teléfono y ordenador
- ❌ **Deploy en producción:** No hay hosting configurado (Vercel, Railway, etc.)
- ❌ **PWA icons:** `/public/icons/icon-192.png` y `icon-512.png` no existen
- ❌ **Rate limiting API:** Cualquiera puede agotar el crédito de Anthropic
- ❌ **Notificaciones:** UI de toggles existe pero sin lógica real
- ❌ **Testimonios reales:** Los 3 testimonios en pricing son ficticios
- ❌ **Analytics:** No hay Plausible, Posthog ni ningún tracking de uso
- ❌ **App nativa:** Solo PWA — no está en App Store ni Google Play
- ❌ **Email:** Sin sistema de comunicación con usuarios

### Ingresos actuales
**€0.** Producto no monetizado, no deployado.

### Target financiero declarado
**€10,000** en ingresos. Requiere:
- A €14.99/mes: 667 usuarios Pro activos
- A €99/año: 102 usuarios anuales
- Mix realista: ~200 usuarios mensuales + 50 anuales → €3,000–4,000 MRR primeros 90 días si se lanza bien

---

## 9. Onboarding — Análisis profundo

### Fortalezas del onboarding actual
- **Tiempo declarado de 3 minutos** — realista y honesto
- **Personalización inmediata:** El foco elegido (health/fitness/wealth/mind) adapta las sugerencias de hábitos y el tono
- **Baseline inmediato:** El usuario tiene su primer Life Score en el momento en que termina el setup — gratificación instantánea
- **"Meet Oracle"** es el cierre perfecto: humaniza la AI antes de que el usuario la use

### Debilidades del onboarding
- **Sin validación:** Se puede avanzar con datos imposibles (HRV: 20ms, mood: 1)
- **Sin guardia de re-entrada:** Si el usuario limpia localStorage, vuelve al setup como si fuera nuevo — sin warning
- **Paso 4 (objetivo financiero) es saltable** pero Paso 2 (vitals) es obligatorio aunque el usuario no tenga datos
- **Sin gamificación de Day 1:** El usuario no sabe cuándo habrá "ganado" suficientes datos para que el sistema sea útil
- **Sin email capture:** Pierde al usuario para siempre si cierra el browser sin instalar la PWA

---

## 10. Puntos débiles críticos

### Técnicos
| Problema | Impacto | Urgencia |
|----------|---------|----------|
| Sin rate limiting en /api/oracle | Puede agotar €100+ en API costs en minutos | 🔴 Inmediato |
| PWA icons no existen | App no instalable en iOS/Android | 🔴 Inmediato |
| localStorage sin cap | Crash por quota después de 6–12 meses | 🟡 30 días |
| hrv/rhr requeridos pero se guarda 0 | Corrompe calculateReadiness() | 🟡 30 días |
| Sin error boundaries | Pantalla blanca ante cualquier error de store | 🟡 30 días |
| Deps muertas (better-sqlite3, @base-ui/react) | Bundle size + superficie CVE | 🟢 60 días |
| WorkoutEntry sin campo name | Workaround en QuickLogFAB usa notes como name | 🟢 60 días |

### De producto
| Problema | Impacto |
|----------|---------|
| Sin sincronización cross-device | Usuario pierde datos si cambia de dispositivo |
| Sin notificaciones reales | Principal mecanismo de retención está vacío |
| Sin auth → sin backup cloud | Barrera enorme para pago (usuario no confía en app que puede perder datos) |
| Datos locales incompatibles con modelo freemium | No puedes verificar si el usuario es Pro o Free sin server |
| Sin modo offline real (service worker) | Oracle requiere internet — app parcialmente inútil sin conexión |

### De negocio
| Problema | Impacto |
|----------|---------|
| Sin pagos integrados | No hay forma de monetizar aunque alguien quiera pagar |
| Sin deploy público | Nadie puede probar el producto |
| Sin analytics | No sabes qué usan los usuarios ni dónde abandonan |
| Testimonios ficticios | Riesgo legal y de credibilidad si se lanza sin real social proof |
| Sin estrategia de adquisición | Product sin canal de distribución = árbol que cae en el bosque |

---

## 11. Riesgos

### Riesgos altos
1. **Big tech replicates:** Apple o Google pueden lanzar un Life OS nativo. Google ya tiene su app de salud. El moat de FORGE es la cross-domain AI y el local-first privacy.
2. **Costes de API Anthropic escalan:** A €0.003/1K tokens, con 1,000 usuarios activos diarios haciendo 5 preguntas cada uno, el coste mensual puede ser €500–2,000. Sin rate limiting + pricing correcto, los márgenes se destruyen.
3. **Pérdida de datos del usuario:** Si el usuario limpia cache o cambia de device, pierde todo. Sin sincronización, la retención a largo plazo es imposible.
4. **Regulación de datos de salud:** En algunos países (especialmente EU), datos de salud (HRV, mood) pueden clasificarse como datos sensibles bajo GDPR. El modelo local-first mitiga esto, pero necesita documentación legal.

### Riesgos medios
5. **Churn por falta de valor sin datos:** Los primeros 7 días, con pocos datos, la app parece vacía. El retention hook (Life Score diario) solo funciona cuando hay historial.
6. **Dependencia de Anthropic API:** Outages de la API dejan Oracle inoperativo. Sin fallback a modelo local (Ollama está instalado en el sistema del developer pero no integrado en la app).
7. **App Store rejection:** Apple tiene criterios estrictos para apps de salud. Si FORGE se clasifica como "health app" y hace claims clínicos implícitos, puede ser rechazada.

### Riesgos bajos
8. **Competidor de nicho nos adelanta:** Difícil — el espacio de Life OS cross-domain está poco poblado.

---

## 12. Hipótesis de negocio

Las siguientes hipótesis deben validarse antes de escalar:

| # | Hipótesis | Cómo validar | Riesgo si es falsa |
|---|-----------|--------------|-------------------|
| H1 | El usuario valora la correlación cross-domain más que las funciones individuales | Entrevistar 20 usuarios beta. ¿Qué feature usaron más? | Modelo de negocio requiere reposicionamiento |
| H2 | €14.99/mes es el precio correcto | A/B test con €9.99 y €19.99. Medir conversión | Si el precio es alto → menos conversión. Si es bajo → márgenes insuficientes |
| H3 | El Life Score crea hábito de apertura diaria | Medir Daily Active Users vs Monthly Active Users (DAU/MAU ratio > 0.4 = éxito) | Sin hábito diario, la retención cae a <30% en 90 días |
| H4 | Los usuarios Pro usan Oracle al menos 3x/semana | Tracking de llamadas a /api/oracle por usuario | Si no usan Oracle, el coste de Pro no justifica el valor |
| H5 | El onboarding de 3 minutos no es suficiente para crear valor percibido en Day 1 | Medir % de usuarios que logran Life Score > 50 en Day 1 | Retención de Day 7 < 20% |
| H6 | La privacidad local-first es argumento de venta, no barrera de confianza | Medir conversión desde pricing hacia signup. Entrevistas. | Si el usuario quiere sync cloud, el modelo local-first frena conversión |

---

## 13. Métricas importantes

### Métricas de producto (a medir desde Day 1 de deploy)
```
DAU / MAU ratio              → Target: >0.40 (app de uso diario real)
Day 7 retention              → Target: >30%
Day 30 retention             → Target: >15%
Sessions/user/semana         → Target: >5
Módulos usados por usuario   → Target: >3 (app de nicho = fallo)
% usuarios que abren Oracle  → Target: >40%
Life Score promedio diario   → Proxy de engagement y de datos
```

### Métricas de negocio
```
MRR                          → Target: €10,000 en 12 meses
Free→Pro conversion rate     → Target: >5%
Churn mensual Pro            → Target: <8%
CAC (coste adquisición)      → Target: <€30 (2 meses de Pro)
LTV estimado                 → Target: >€90 (6 meses promedio)
API cost/usuario Pro/mes     → Target: <€2 (mantener margen >85%)
```

---

## 14. Roadmap recomendado

### Fase 0 — Estabilización (Semanas 1–2) · AHORA
> Objetivo: hacer el producto lanzable técnicamente

- [ ] Rate limiting en /api/oracle (protección económica crítica)
- [ ] Crear PWA icons (192px + 512px) — habilita instalación móvil
- [ ] Cap localStorage a 365 entradas por store
- [ ] Hacer hrv y rhr opcionales en VitalEntry
- [ ] Eliminar dependencias muertas (better-sqlite3, @base-ui/react)
- [ ] Error Boundary global en layout-shell
- [ ] Añadir campo name a WorkoutEntry

### Fase 1 — Auth + Persistencia cloud (Semanas 3–8)
> Objetivo: el usuario puede confiar en que no perderá sus datos

- [ ] Supabase Auth (email/magic link — sin fricción de contraseña)
- [ ] Sync localStorage → Supabase en background
- [ ] Modelo local-first: funciona sin internet, sincroniza cuando hay conexión
- [ ] Cross-device sync automático
- [ ] Backup automático diario (cifrado)

### Fase 2 — Monetización (Semanas 6–10)
> Objetivo: cobrar dinero real

- [ ] Stripe Checkout integrado
- [ ] Free vs Pro enforced con feature flags basados en subscription status
- [ ] Free tier: últimos 30 días de datos, sin Oracle, sin Insights AI
- [ ] Pro tier: datos ilimitados + Oracle + Insights AI + export
- [ ] 14-day trial sin tarjeta
- [ ] Customer portal (Stripe) para gestión de suscripción

### Fase 3 — Deploy + Distribución (Semanas 8–12)
> Objetivo: que usuarios reales puedan acceder

- [ ] Deploy en Vercel (gratis para empezar)
- [ ] Dominio propio (forge.app o similar)
- [ ] Analytics básico (Plausible — privacy-friendly, €9/mes)
- [ ] SEO básico (meta tags, OG images)
- [ ] PWA funcional e instalable
- [ ] Capacitor wrapper para app nativa iOS/Android (App Store y Play Store)

### Fase 4 — Growth (Meses 3–6)
> Objetivo: primeros 100 usuarios de pago

- [ ] Programa de beta testing con 20–50 usuarios reales (feedback loop)
- [ ] Integración con wearables: Apple Health, Google Fit, Garmin Connect API
- [ ] Notificaciones push reales (PWA Notifications API)
- [ ] Modo social limitado: compartir Life Score (orgánico viral)
- [ ] Content marketing: threads de Twitter/X sobre cross-domain insights (growth orgánico)
- [ ] Explorar canal B2B2C: coaches y nutricionistas recomiendan FORGE a clientes

### Fase 5 — Escalado (Meses 6–12)
> Objetivo: €10,000 MRR

- [ ] Integración con Ollama local como fallback de AI (reducir coste de API)
- [ ] Team/Family plan (€24.99/mes hasta 4 usuarios)
- [ ] API pública para integraciones (Zapier, Make)
- [ ] Exportación a PDF de informes semanales
- [ ] Widget de Life Score para home screen móvil

---

## 15. Oportunidades no exploradas

### Integraciones de alto impacto
1. **Apple Health / HealthKit:** Importar automáticamente sueño, HRV, pasos desde iPhone/Apple Watch → elimina fricción de entrada manual
2. **Plaid API:** Importar transacciones bancarias automáticamente → wealth sin entrada manual
3. **Strava / Garmin:** Importar workouts automáticamente
4. **Notion/Calendar:** Exportar tareas y metas a herramientas ya usadas

### Features de alto impacto no implementadas
1. **Comparativa temporal:** "Esta semana vs las últimas 4" — el usuario necesita ver tendencias, no solo estado actual
2. **Alertas proactivas push:** "Tu HRV lleva 5 días bajando — tómate un día de descanso hoy"
3. **Oracle en Morning Brief personalizado por email:** Resumen diario de 3 líneas enviado a las 7am
4. **Modo Coaching:** Oracle en rol de accountability partner — te pregunta cada día si cumpliste tus hábitos
5. **Life Score histórico** como gráfica en el tiempo (actualmente solo muestra el score actual)

### Modelo de negocio alternativo a explorar
- **B2B:** Vender a coaches de vida, nutritionistas, y psicólogos para que lo usen con clientes (€50–200/mes por "coach account" con hasta 20 clientes)
- **Licencia empresarial:** Empresas que pagan por el wellbeing de sus empleados (€5/empleado/mes)

---

## 16. Identidad de marca

**Nombre:** FORGE  
**Tagline:** "Build the life you deserve."  
**Subtítulo:** "Life OS"  
**Tono:** Directo, exigente, sin condescendencia. Habla al usuario como a un igual que tiene ambición real.  
**Color primario:** Naranja `oklch(0.705 0.213 47.604)` — energía, fuego, forja  
**Fondo:** Negro profundo `oklch(0.09 0.002 285)` — seriedad, foco, élite  
**Siempre oscuro:** Nunca habrá modo claro. Es una decisión de identidad.  
**Voz de Oracle:** Coach de alto rendimiento, no chatbot amigable. Cita números reales. No usa frases genéricas.

---

## 17. Información técnica operativa

**Dev server:** `npm run dev` → localhost:3001  
**API key:** Anthropic en `/Users/marcosgil/forge/.env.local`  
**Modelo AI:** claude-sonnet-4-6 (el más capaz disponible)  
**Build check:** `npx tsc --noEmit` — debe pasar en 0 errores antes de cualquier commit  
**AI Stack local:** Hermes (v0.14) + Ruv Swarm (v1.0.20) + Ollama instalados en sistema — no integrados en FORGE todavía  
**Scripts de gestión AI local:** `ai-start`, `ai-status` (ver `~/AI_STACK_GUIDE.md`)

---

*Este documento es la fuente de verdad de FORGE. Cualquier decisión estratégica, técnica o de producto debe consultarse contra este documento. Actualizar ante cambios significativos.*
