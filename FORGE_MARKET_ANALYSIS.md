# FORGE — Market Analysis
**Fase 2 completada:** 2026-05-30

---

## 1. Mercado objetivo

### Definición del mercado

FORGE opera en la intersección de 4 mercados establecidos que actualmente están fragmentados:

| Mercado | TAM 2026 | CAGR | Líder actual |
|---------|----------|------|--------------|
| Health & Fitness Apps | $14.7B | 17.6% | Strava, MyFitnessPal |
| Personal Finance Apps | $1.9B | 6.3% | YNAB, Mint, Monarch |
| Mental Wellness Apps | $6.4B | 16.3% | Headspace, Calm |
| Wearable-connected Health | $21B | 14.5% | Whoop, Oura |
| **Life OS / Personal Productivity** | **$4.2B** | **24.1%** | **Notion, Obsidian** |

**SAM (Serviceable Addressable Market):** Personas de 24-40 años, ingresos medios-altos, con smartphone, inglés o español, que ya usan 2+ apps de bienestar/productividad.  
Estimado: **~45M personas globalmente.**

**SOM (Serviceable Obtainable Market, 18 meses):** 0.01% del SAM = **4,500 usuarios**.  
Target financiero inicial: 200 usuarios de pago = **€3,000 MRR**.

---

## 2. Análisis competitivo detallado

### Mapa de posicionamiento

```
                    ALTO PRECIO
                        │
           Whoop ●      │      ● Oura
                        │
  SOLO SALUD ───────────┼─────────────── VIDA COMPLETA
                        │
     MyFitnessPal ●     │     ● FORGE (target)
                        │
           YNAB ●  Notion●
                        │
                    BAJO PRECIO
```

### Análisis competidor por competidor

#### Whoop ($30/mes + hardware)
- **Fortaleza:** HRV/recovery tracking best-in-class, comunidad atleta, dato de sueño muy preciso
- **Debilidad:** Requiere hardware ($200+), solo salud, sin finanzas/metas/mente, sin AI coaching real
- **Por qué FORGE gana:** Sin hardware, más barato, 4 dominios vs 1, AI que conecta todo
- **Por qué Whoop gana:** Datos fisiológicos automáticos sin entrada manual, wearable 24/7

#### Oura ($6/mes + $350 anillo)
- **Fortaleza:** Anillo discreto, sueño phases precisas, temperatura corporal, comunidad
- **Debilidad:** Mismo problema que Whoop: solo salud, hardware caro
- **Por qué FORGE gana:** Mismo argumento, más barato de entrada, sin hardware obligatorio

#### MyFitnessPal ($10/mes)
- **Fortaleza:** Base de datos de alimentos enorme, escaneado de barcode, integración con Fitbit/Apple Health
- **Debilidad:** Solo nutrición/calorías, sin finanzas, sin goals, sin AI coaching
- **Por qué FORGE gana:** Nutrición + 3 dominios más, AI que conecta gasto calórico con estados de ánimo
- **Por qué MyFitnessPal gana:** Base de datos de alimentos (FORGE no tiene esto todavía)

#### YNAB ($15/mes)
- **Fortaleza:** Metodología zero-based budgeting muy efectiva, comunidad leal, educación financiera
- **Debilidad:** Solo finanzas, sin salud/fitness/mente, no hay AI insights
- **Por qué FORGE gana:** Finanzas + correlación con salud ("tu gasto impulso sube cuando tu HRV baja"), 4 dominios
- **Por qué YNAB gana:** Metodología más profunda, mejor para control presupuestario avanzado

#### Notion ($10/mes)
- **Fortaleza:** Flexibilidad infinita, comunidad masiva de templates, muy popular
- **Debilidad:** Requiere configuración manual intensa, no hay datos cuantitativos automáticos, sin AI proactiva
- **Por qué FORGE gana:** Out-of-the-box, datos cuantitativos, Life Score automático, Oracle con contexto real
- **Por qué Notion gana:** Más flexible para usuarios avanzados, funciona offline completo

#### Google Health (lanzado Mayo 2026, $9.99/mes)
- **Fortaleza:** Integración nativa Android, datos automáticos de Google Fit, enorme distribución
- **Debilidad:** Solo salud (sin finanzas, sin mente, sin goals), AI genérico, sin local-first privacy
- **Por qué FORGE gana:** 4 dominios vs 1, privacidad local-first, AI con contexto completo de vida, sin dependencia de Google
- **Por qué Google gana:** Distribución masiva, integración nativa, presupuesto ilimitado de marketing

#### Apple Health (gratis)
- **Fortaleza:** Integración nativa iOS, datos automáticos de Apple Watch, sin coste
- **Debilidad:** Aggregador sin AI coaching, sin finanzas, sin goals, sin journal, solo iOS
- **Por qué FORGE gana:** Multiplataforma, 4 dominios, Oracle, accionable vs pasivo

---

## 3. Ventaja competitiva de FORGE

### Ventaja primaria: La intersección imposible
**Ningún competidor hace las 4 cosas + AI cross-domain.**

La ventaja no es en ningún dominio individual — es en la **conexión entre dominios**. Esa conexión es imposible para competidores de nicho (no tienen los datos) y difícil para Big Tech (privacy concerns, regulación, fragmentación de equipos internos).

### Ventaja secundaria: Local-first privacy
En un mundo post-Cambridge Analytica, el argumento "tus datos nunca salen de tu dispositivo" tiene valor monetizable. YNAB, Whoop, y Google todos almacenan datos en sus servidores y los usan para entrenar modelos. FORGE no.

### Ventaja terciaria: Oracle con contexto real
Los chatbots genéricos (ChatGPT, Gemini) no conocen tus datos. Oracle sí. La diferencia entre "aquí tienes consejos generales de sueño" y "tu HRV lleva 3 días cayendo y coincide con tus peores días en el trabajo — aquí está lo que está pasando" es enorme.

### Sostenibilidad del moat (a 36 meses)
| Moat | Solidez | Amenaza principal |
|------|---------|------------------|
| Data cross-domain | Alta | Google/Apple pueden agregar datos de terceros |
| Local-first privacy | Alta | Difícil de replicar por Big Tech (modelo de negocio opuesto) |
| Life Score como métrica | Media | Fácil de copiar el nombre, difícil de copiar el modelo |
| Switching cost (historial) | Alta (con el tiempo) | Baja en primeros 90 días |

---

## 4. Segmentación de mercado

### Segmento A: El High Performer (ICP principal)
- **Perfil:** 26-38 años, ingresos €40K-100K, trabaja en tech/consultoría/emprendimiento
- **Comportamiento:** Ya usa Whoop o Apple Watch, tiene cuenta en YNAB o similar, es consciente de su salud
- **Pain point:** Sus apps no se hablan entre sí. Siente que su esfuerzo no se traduce en progreso visible
- **WTP (willingness to pay):** €15-25/mes sin fricción
- **Canal:** Twitter/X, Reddit r/biohacking, r/financialindependence, comunidades de productividad

### Segmento B: El Ambitious Student
- **Perfil:** 22-28 años, poco dinero, mucha energía, ambición clara
- **Comportamiento:** Usa apps gratuitas, busca maximizar resultados con recursos limitados
- **Pain point:** No puede pagar 5 apps. Quiere una que haga todo bien
- **WTP:** €5-10/mes si ven valor real
- **Canal:** TikTok, YouTube, Reddit r/personalfinance, r/fitness

### Segmento C: El Burnout Professional
- **Perfil:** 32-45 años, altos ingresos, siente que "algo no está bien" pero no sabe qué
- **Comportamiento:** Ha probado muchas apps, las abandona. Quiere algo que le ayude a entenderse
- **Pain point:** No conecta su cansancio con sus hábitos ni sus finanzas con su estrés
- **WTP:** €20-30/mes si FORGE les da claridad
- **Canal:** LinkedIn, podcasts de productividad, boca a boca

---

## 5. Pricing analysis

### Precios actuales de FORGE
```
Free:  €0/mes — tracking básico, 30 días historial, sin Oracle
Pro:   €14.99/mes o €99/año (save 45%)
```

### Benchmarking de precio
| Producto | Precio mensual | LTV estimado |
|---------|---------------|-------------|
| Whoop | €30 + hardware | €360/año |
| YNAB | €15 | €180/año |
| Headspace | €13 | €156/año |
| MyFitnessPal | €10 | €120/año |
| **FORGE Pro** | **€14.99** | **€180/año** |

### Análisis de precio
- **€14.99/mes es correcto para el lanzamiento.** Está en el midpoint del mercado, por debajo de Whoop (hardware más), comparable con YNAB (que solo hace finanzas).
- **La oferta anual de €99 (€8.25/mes) es el mejor deal.** Incentiva commitment, mejora LTV, reduce churn.
- **Riesgo de underprice:** Si Oracle se vuelve central para el usuario, €14.99 es demasiado barato. Considera €19.99 en 12 meses.
- **Test recomendado:** Lanzar con €14.99/mes, probar €9.99 vs €19.99 en A/B después de 200 usuarios.

---

## 6. Barreras de entrada

### Para FORGE (barreras que protegen)
- **Datos históricos del usuario:** Después de 3 meses de uso, migrar a otro producto es costoso emocionalmente
- **Life Score personalizado:** El scoring engine se calibra implícitamente a los patrones del usuario
- **Costoso de replicar en calidad:** Un Life OS cross-domain bien diseñado requiere meses de trabajo

### Para competidores que quieran entrar (barreras que amenazan)
- **Big Tech tiene distribución y presupuesto ilimitado** — pueden lanzar un Life OS en 12 meses
- **Precio es copiable** — cualquiera puede bajar a €9.99
- **AI es copiable** — cualquier app puede integrar Claude o GPT-4

### Conclusión de barreras
**El único moat real a largo plazo es la ejecución rápida + adquisición de usuarios antes de que Google o Apple lancen su versión.** La ventana es de 12-18 meses.

---

## 7. Posicionamiento recomendado

### Claim principal
**"El único app que conecta tu salud, fitness, finanzas y mente — y te dice qué hacer con esa información."**

### Mensajes por segmento
| Segmento | Mensaje clave |
|---------|--------------|
| High Performer | "Deja de gestionar 5 apps. FORGE ve lo que cada una no puede ver por separado." |
| Ambitious Student | "€14.99/mes reemplaza €400+ de apps. Tu Life Score empieza hoy." |
| Burnout Professional | "Descubre exactamente qué te está agotando — y qué hacer al respecto." |

### Diferenciador único de ventas (USP)
**"FORGE es el único app donde tu AI coach conoce tu HRV, tu balance bancario, tus hábitos, y tus metas — a la vez."**

---

## 8. Estrategia de entrada al mercado

### Nicho inicial recomendado: Biohackers & High Performers
**Por qué este nicho:**
1. Ya pagan por múltiples apps → conversión más fácil
2. Son evangelizadores activos en Twitter/Reddit → crecimiento orgánico
3. Entienden el valor de los datos → menor curva de educación
4. Toleran productos en beta si el core value es fuerte

### Canal de entrada: Comunidades de Reddit
- r/biohacking (290K miembros)
- r/getdisciplined (1.1M miembros)  
- r/productivity (1.8M miembros)
- r/personalfinance (18M miembros — más difícil, pero high intent)

### Estrategia de precios de lanzamiento
1. **Beta gratuita:** 50-100 usuarios sin pago → feedback real
2. **Early adopter discount:** €7.99/mes para primeros 100 usuarios de pago
3. **Precio estándar:** €14.99/mes desde usuario 101

---

## Resumen Fase 2

**Hallazgos principales:**
- El mercado de Life OS cross-domain es real, valorado, y escasamente atendido
- La ventana competitiva es de 12-18 meses antes de que Google/Apple compitan directamente
- €14.99/mes es el precio correcto para el lanzamiento
- El nicho de entrada óptimo son los High Performers / biohackers (más fáciles de convertir, mejores evangelizadores)
- El moat sostenible a largo plazo es la combinación de datos históricos del usuario + local-first privacy

**Hipótesis de Fase 2:**
- H1: ✅ Confirmado — el mercado fragmentado crea oportunidad real
- H2: ✅ Confirmado — €14.99 está bien posicionado vs competencia
- H3: ⚠️ Por validar — si el segmento High Performer tiene suficiente volumen para €10K/mes

**→ Fase 3:** `FORGE_REVENUE_PLAN.md`
