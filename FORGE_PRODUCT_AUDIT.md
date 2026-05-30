# FORGE — Product Audit
**Fase 4 completada:** 2026-05-30

---

## 1. Evaluación por módulo

| Módulo | Utilidad | UX | Completitud | Retención | Nota |
|--------|---------|-----|------------|----------|------|
| Command Center | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Alta | Core loop está bien |
| Vitals | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Alta | Falta auto-import wearable |
| Oracle | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Muy alta | El diferenciador más fuerte |
| Insights | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | Media | Necesita más tipos de insight |
| Mind | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | Alta | 4 tabs = algo denso |
| Wealth | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | Media | Entrada manual es fricción |
| Body | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | Media | Logger de workouts es laborioso |
| Journal | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Alta | Muy bien ejecutado |
| Review | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | Media | Solo útil con datos suficientes |
| Setup | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | N/A | Falta validación de datos |
| Settings | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | Baja | Funcional pero no sticky |
| Pricing | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | N/A | Copy bueno, sin social proof real |

---

## 2. Flujo de usuario — Análisis de activación

### Flujo ideal (primera sesión)
```
Landing (/pricing) → Setup (5 pasos) → Command Center → Life Score visible → First insight → Oracle chat
```

### Puntos de abandono identificados

**Abandono 1: Setup Paso 2 — Baseline Vitals**
- **Fricción:** El usuario no sabe su HRV. El slider está en 60ms por defecto.
- **Problema:** Si guarda HRV=60 sin saberlo, el Life Score está basado en datos inventados.
- **Fix:** Hacer HRV y RHR opcionales, añadir tooltip "No tienes wearable? No pasa nada — déjalo en blanco".

**Abandono 2: Command Center vacío (Day 1)**
- **Fricción:** Si el usuario no tiene datos suficientes, el Life Score es 0 o muy bajo. Desmotiva.
- **Problema:** Los datos del setup no alimentan bien todos los módulos.
- **Fix:** "Your Life Score will grow as you log more data — here's what to do first" → guided first actions.

**Abandono 3: Body tab — Workout logger**
- **Fricción:** Añadir ejercicios, sets, reps y pesos es laborioso sin el músculo de memoria.
- **Problema:** Si el primer log tarda 5 minutos, el usuario no vuelve.
- **Fix:** Quick workout templates (Push Day, Pull Day, Legs, Cardio) con ejercicios pre-cargados.

**Abandono 4: Wealth — Entrada manual de transacciones**
- **Fricción:** Loggear cada gasto a mano es lo más aburrido posible.
- **Problema:** Sin datos financieros, el Life Score de Wealth es 0, el Cross-domain insight no funciona.
- **Fix prioritario:** Importación de CSV bancario (gratis) o Plaid (de pago) como prioridad de roadmap.

**Abandono 5: Oracle sin contexto (primeros días)**
- **Fricción:** Oracle dice "no tengo suficientes datos para analizarte".
- **Problema:** El diferenciador #1 del producto no funciona en los primeros 3-5 días.
- **Fix:** Oracle tiene contexto del setup (baseline vitals) desde Day 1. Usar eso para dar una primera respuesta útil aunque los datos sean escasos.

---

## 3. Análisis de retención (teórico, sin usuarios reales)

### Daily Active Usage hooks
| Hook | ¿Existe? | Fuerza |
|------|---------|-------|
| Life Score diario | ✅ | Alta — es un número que sube y baja |
| Habit streak | ✅ | Alta — el usuario no quiere romperla |
| Daily Morning Brief | ✅ | Media — solo si tiene datos |
| Push notifications | ❌ | Crítico para retención — no existe |
| Email resumen semanal | ❌ | Falta implementar |
| "Comparativa con ayer" | ❌ | Sería muy potente |

### Weekly Active Usage hooks
| Hook | ¿Existe? | Fuerza |
|------|---------|-------|
| Weekly Review | ✅ | Media — requiere ir a /review activamente |
| Achievement unlock | ✅ | Baja-media — solo los primeros días |
| AI insights nuevos | ✅ | Media — regenera automáticamente |

### Evaluación de retención Day 7 (estimada sin datos reales)
- Con push notifications: ~35-40%
- Sin push notifications (actual): ~15-20%
- **Las notificaciones push son el mayor palanca de retención no implementada.**

---

## 4. UX — Problemas específicos

### Críticos
1. **Sin loading states en navegación:** El contenido aparece sin skeleton. En mobile con conexión lenta parece que la app está rota.
2. **PWA no instalable:** Icons PNG faltan. El banner "Add to Home Screen" no aparece en iOS.
3. **Sidebar ocupa ml-60 en desktop siempre:** En pantallas de 13" (MacBook Air), el contenido tiene poco espacio horizontal en páginas con tablas o charts.

### Importantes
4. **Quick Log FAB oscurece contenido en mobile:** El botón flotante a bottom-right se solapa con la última fila de contenido en scroll.
5. **Oracle no tiene markdown rendering:** Las respuestas de Claude tienen asteriscos (*bold*) que se muestran como texto plano. Reduce legibilidad.
6. **Habits grid 7 días trunca hábitos largos:** Un hábito llamado "Morning sunlight exposure before breakfast" queda cortado.
7. **Body page — Workout tab sin confirmación de guardado:** El usuario no sabe si su workout se guardó.

### Menores
8. **Notifications en Settings no son funcionales:** Toggle tiene UI pero no hace nada. Confunde al usuario.
9. **Review page — sin datos = página vacía:** Sin contexto de qué hacer primero.
10. **Journal — prompts se repiten aleatoriamente:** A veces el mismo prompt aparece 2 días seguidos.

---

## 5. Flujo de conversión Free → Pro

### Estado actual
- El botón "FORGE Pro" en sidebar lleva a /pricing
- /pricing tiene CTA "Start Pro Free (14 days)"
- CTA lleva a /setup (onboarding, no a Stripe)
- **Stripe no está integrado → conversión es imposible actualmente**

### Flujo ideal a implementar
```
Usuario Free → Ve feature bloqueada (Oracle, Insights AI) → 
"Upgrade to Pro" modal → Stripe Checkout → 
Cuenta Pro activada → Feature desbloqueada → Email confirmación
```

### Features gate recomendadas
| Feature | Free | Pro |
|---------|------|-----|
| Tracking básico (vitals, workouts, habits) | ✅ | ✅ |
| Life Score | ✅ | ✅ |
| Historial 30 días | ✅ | ❌ |
| Historial ilimitado | ❌ | ✅ |
| Oracle (5 mensajes/mes) | ✅ | ❌ |
| Oracle ilimitado | ❌ | ✅ |
| Insights básicos (3) | ✅ | ❌ |
| Deep AI Analysis | ❌ | ✅ |
| Weekly Review AI | ❌ | ✅ |
| Export datos | ❌ | ✅ |

---

## 6. Evaluación del onboarding

### Puntos fuertes
- 5 pasos bien estructurados
- Progreso visual claro
- "Meet Oracle" como cierre emocional es excelente
- Tiempo real: ~3 minutos

### Puntos débiles
- Sin validación de datos (HRV=0 pasa sin error)
- Sin email capture durante el setup
- Sin explicación de qué es el Life Score antes de ver el Command Center
- Paso 2 asume conocimiento de HRV — la mayoría no sabe qué es

### Score de onboarding: 7/10
El setup es bueno para usuarios early adopter (que saben lo que es HRV). Para usuarios mainstream, necesita más educación inline.

---

## 7. Mejoras prioritarias de producto

| Prioridad | Mejora | Impacto | Esfuerzo |
|-----------|--------|---------|---------|
| P0 | Stripe integración | Revenue | Alto |
| P0 | Push notifications | Retención | Medio |
| P0 | Skeleton loading states | UX básica | Bajo |
| P1 | Markdown rendering en Oracle | UX Oracle | Bajo |
| P1 | Workout templates (Push/Pull/Legs/Cardio) | Activación Body | Medio |
| P1 | CSV import para finanzas | Activación Wealth | Medio |
| P1 | Oracle guidance con pocos datos | Activación Day 1 | Bajo |
| P2 | Apple Health / HealthKit import | Activación Vitals | Alto |
| P2 | "Comparativa con ayer" en Command Center | Retención | Bajo |
| P2 | Life Score histórico como gráfica | Retención | Bajo |

---

## Resumen Fase 4

**Hallazgos:**
- El core loop (log → Life Score → insights → Oracle) está bien diseñado
- Los 5 puntos de abandono más críticos son todos solucionables
- La retención estimada sin push notifications es ~15-20% en Day 7 — demasiado baja
- La conversión Free→Pro es actualmente 0% porque Stripe no está integrado

**Hipótesis de Fase 4:**
- H1: ✅ El Life Score es el hook de retención más fuerte
- H2: ✅ La entrada manual de datos (especialmente finanzas y workouts) es la mayor fricción de activación
- H3: ⚠️ Por validar con usuarios reales — si el Journal+Oracle es suficiente para retener sin notificaciones

**→ Fase 5:** `FORGE_TECH_OPTIMIZATION.md`
