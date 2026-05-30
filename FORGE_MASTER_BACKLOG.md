# FORGE — Master Backlog
**Última actualización:** 2026-05-30

---

## CRITICAL_QUEUE — Bloquea crecimiento o ingresos

| ID | Título | P | Impacto | Esfuerzo | ROI | Estado | Deps | Agente | Creado | Completado | Aprendizaje |
|----|--------|---|---------|----------|-----|--------|------|--------|--------|------------|-------------|
| CRIT-001 | Rate limiting /api/oracle (20 req/min/IP) | P0 | 10 | 2 | 5.0 | ready | — | Product | 2026-05-30 | — | — |
| CRIT-002 | Crear PWA icons (192px + 512px) | P0 | 8 | 1 | 8.0 | ready | — | Product | 2026-05-30 | — | — |
| CRIT-003 | Inicializar Git + primer commit | P0 | 9 | 1 | 9.0 | ready | — | Product | 2026-05-30 | — | — |
| CRIT-004 | Deploy en Vercel (URL pública) | P0 | 10 | 3 | 3.3 | blocked | CRIT-003 | Product | 2026-05-30 | — | — |

---

## PRODUCT_QUEUE — Mejoras de producto

| ID | Título | P | Impacto | Esfuerzo | ROI | Estado | Deps | Agente | Creado | Completado | Aprendizaje |
|----|--------|---|---------|----------|-----|--------|------|--------|--------|------------|-------------|
| PROD-001 | Skeleton loading states en todas las páginas | P0 | 8 | 2 | 4.0 | ready | — | Product | 2026-05-30 | — | — |
| PROD-002 | Markdown rendering en Oracle (asteriscos → bold) | P1 | 8 | 1 | 8.0 | ready | — | Product | 2026-05-30 | — | — |
| PROD-003 | Hacer hrv/rhr opcionales en VitalEntry + Setup | P1 | 7 | 2 | 3.5 | ready | — | Product | 2026-05-30 | — | — |
| PROD-004 | Workout templates (Push/Pull/Legs/Cardio) | P1 | 7 | 3 | 2.3 | ready | — | Product | 2026-05-30 | — | — |
| PROD-005 | Oracle guidance con pocos datos (usa setup baseline) | P1 | 8 | 2 | 4.0 | ready | — | Product | 2026-05-30 | — | — |
| PROD-006 | Cap localStorage 365 entradas/store | P0 | 9 | 1 | 9.0 | ready | — | Product | 2026-05-30 | — | — |
| PROD-007 | Cache in-memory para localStorage reads (OPT-01) | P1 | 7 | 2 | 3.5 | ready | PROD-006 | Product | 2026-05-30 | — | — |
| PROD-008 | Error Boundary global en layout-shell.tsx | P1 | 7 | 1 | 7.0 | ready | — | Product | 2026-05-30 | — | — |
| PROD-009 | Eliminar deps muertas (@base-ui, better-sqlite3) | P1 | 6 | 1 | 6.0 | ready | — | Product | 2026-05-30 | — | — |
| PROD-010 | Quick Log FAB: hacer hrv/rhr realmente opcionales | P1 | 7 | 1 | 7.0 | ready | PROD-003 | Product | 2026-05-30 | — | — |
| PROD-011 | "Comparativa con ayer" en Command Center | P2 | 6 | 2 | 3.0 | pending | — | Product | 2026-05-30 | — | — |
| PROD-012 | Life Score histórico como gráfica en Command Center | P2 | 7 | 2 | 3.5 | pending | — | Product | 2026-05-30 | — | — |
| PROD-013 | Push notifications PWA (daily morning brief) | P0 | 9 | 4 | 2.25 | pending | CRIT-002 | Product | 2026-05-30 | — | — |
| PROD-014 | Instalar Plausible Analytics | P1 | 8 | 1 | 8.0 | blocked | CRIT-004 | Product | 2026-05-30 | — | — |
| PROD-015 | CSV import para finanzas (Wealth) | P1 | 8 | 4 | 2.0 | pending | — | Product | 2026-05-30 | — | — |
| PROD-016 | Guided first actions en Command Center Day 1 (vacío) | P1 | 7 | 2 | 3.5 | pending | — | Product | 2026-05-30 | — | — |
| PROD-021 | "Top 3 daily actions" en Command Center (Daily Decision Center) | P1 | 9 | 2 | 4.5 | ready | — | Product | 2026-05-30 | — | — |
| PROD-017 | Fix: Quick Log FAB no oscurece contenido en mobile | P2 | 5 | 1 | 5.0 | ready | — | Product | 2026-05-30 | — | — |
| PROD-018 | Fix: Habits grid trunca nombres largos | P2 | 4 | 1 | 4.0 | ready | — | Product | 2026-05-30 | — | — |
| PROD-019 | Fix: Workout tab — confirmación de guardado visible | P2 | 5 | 1 | 5.0 | ready | — | Product | 2026-05-30 | — | — |
| PROD-020 | Fix: Notifications toggle en Settings (no funcional) | P2 | 4 | 1 | 4.0 | pending | PROD-013 | Product | 2026-05-30 | — | — |

---

## GROWTH_QUEUE — Adquisición y distribución

| ID | Título | P | Impacto | Esfuerzo | ROI | Estado | Deps | Agente | Creado | Completado | Aprendizaje |
|----|--------|---|---------|----------|-----|--------|------|--------|--------|------------|-------------|
| GROW-001 | Crear cuenta Twitter/X para FORGE | P1 | 7 | 1 | 7.0 | ready | — | Growth | 2026-05-30 | — | — |
| GROW-002 | Reclutar 10 beta testers manualmente (Reddit, Slack) | P0 | 9 | 3 | 3.0 | blocked | CRIT-004 | Growth | 2026-05-30 | — | — |
| GROW-003 | Post en r/biohacking presentando FORGE concept | P1 | 7 | 2 | 3.5 | pending | CRIT-004 | Growth | 2026-05-30 | — | — |
| GROW-004 | Post en r/getdisciplined sobre Life Score concept | P1 | 7 | 2 | 3.5 | pending | CRIT-004 | Growth | 2026-05-30 | — | — |
| GROW-005 | Preparar launch en Product Hunt (assets, tagline, demo) | P1 | 8 | 4 | 2.0 | pending | CRIT-004 | Growth | 2026-05-30 | — | — |
| GROW-006 | Configurar SEO básico: meta tags, og:image, sitemap | P1 | 6 | 2 | 3.0 | pending | CRIT-004 | Product | 2026-05-30 | — | — |

---

## SALES_QUEUE — Ventas y monetización

| ID | Título | P | Impacto | Esfuerzo | ROI | Estado | Deps | Agente | Creado | Completado | Aprendizaje |
|----|--------|---|---------|----------|-----|--------|------|--------|--------|------------|-------------|
| SALE-001 | Integrar Supabase Auth (magic link login) | P0 | 10 | 5 | 2.0 | pending | CRIT-004 | Product | 2026-05-30 | — | — |
| SALE-002 | Integrar Stripe Checkout (plan Pro €14.99/mes) | P0 | 10 | 5 | 2.0 | blocked | SALE-001 | Finance | 2026-05-30 | — | — |
| SALE-003 | Feature flags Free vs Pro (enforcement en app) | P0 | 10 | 3 | 3.3 | blocked | SALE-002 | Product | 2026-05-30 | — | — |
| SALE-004 | 14-day trial sin tarjeta de crédito | P1 | 8 | 2 | 4.0 | blocked | SALE-002 | Product | 2026-05-30 | — | — |
| SALE-005 | Dominio propio (forge-os.com o similar) | P1 | 7 | 1 | 7.0 | pending | CRIT-004 | Operations | 2026-05-30 | — | — |

---

## CONTENT_QUEUE — Contenido y autoridad

| ID | Título | P | Impacto | Esfuerzo | ROI | Estado | Deps | Agente | Creado | Completado | Aprendizaje |
|----|--------|---|---------|----------|-----|--------|------|--------|--------|------------|-------------|
| CONT-001 | Thread: "Por qué un solo Life Score cambia todo" | P1 | 7 | 2 | 3.5 | blocked | GROW-001 | Content | 2026-05-30 | — | — |
| CONT-002 | Thread: "Cómo correlacionar sueño, finanzas y rendimiento" | P1 | 7 | 2 | 3.5 | blocked | GROW-001 | Content | 2026-05-30 | — | — |
| CONT-003 | Thread: "El problema con tener 5 apps de bienestar" | P1 | 6 | 2 | 3.0 | blocked | GROW-001 | Content | 2026-05-30 | — | — |
| CONT-004 | Video demo de 90 segundos mostrando Oracle en acción | P1 | 8 | 3 | 2.7 | pending | CRIT-004 | Content | 2026-05-30 | — | — |

---

## RESEARCH_QUEUE — Investigación y validación

| ID | Título | P | Impacto | Esfuerzo | ROI | Estado | Deps | Agente | Creado | Completado | Aprendizaje |
|----|--------|---|---------|----------|-----|--------|------|--------|--------|------------|-------------|
| RESE-001 | Validar: ¿hay demanda real de Life Score en Reddit? | P1 | 8 | 2 | 4.0 | ready | — | Research | 2026-05-30 | — | — |
| RESE-002 | Analizar apps competidoras lanzadas en Product Hunt Q1 2026 | P2 | 6 | 3 | 2.0 | pending | — | Research | 2026-05-30 | — | — |
| RESE-003 | Identificar 10 comunidades Slack/Discord de biohacking activas | P1 | 7 | 2 | 3.5 | ready | — | Research | 2026-05-30 | — | — |

---

## AUTOMATION_QUEUE — Automatizaciones de alto ROI

| ID | Título | P | Impacto | Esfuerzo | ROI | Estado | Deps | Agente | Creado | Completado | Aprendizaje |
|----|--------|---|---------|----------|-----|--------|------|--------|--------|------------|-------------|
| AUTO-001 | Script de arranque inteligente con verificación de RAM | P2 | 5 | 2 | 2.5 | ready | — | Operations | 2026-05-30 | — | — |
| AUTO-002 | Weekly digest email automático (resumen Life Score) | P2 | 6 | 4 | 1.5 | pending | SALE-001 | Automation | 2026-05-30 | — | — |

---

## TECH_DEBT_QUEUE — Optimización técnica

| ID | Título | P | Impacto | Esfuerzo | ROI | Estado | Deps | Agente | Creado | Completado | Aprendizaje |
|----|--------|---|---------|----------|-----|--------|------|--------|--------|------------|-------------|
| TECH-001 | useMemo para calculateLifeScores y generateInsights | P2 | 6 | 1 | 6.0 | ready | — | Product | 2026-05-30 | — | — |
| TECH-002 | Separar store.ts en módulos (vitals, finance, habits…) | P3 | 5 | 5 | 1.0 | pending | — | Product | 2026-05-30 | — | — |
| TECH-003 | Headers de seguridad en next.config.ts | P1 | 7 | 1 | 7.0 | ready | — | Product | 2026-05-30 | — | — |
| TECH-004 | Probar build de producción local (next build) | P1 | 8 | 1 | 8.0 | ready | — | Product | 2026-05-30 | — | — |
| TECH-005 | Eliminar import LineChart muerto en wealth/page.tsx | P2 | 3 | 1 | 3.0 | completed | — | Product | 2026-05-30 | 2026-05-30 | Ya corregido en sesión anterior |

---

## Resumen por estado

| Cola | Pending | Ready | Active | Blocked | Completed |
|------|---------|-------|--------|---------|-----------|
| CRITICAL | 0 | 3 | 0 | 1 | 0 |
| PRODUCT | 7 | 10 | 0 | 2 | 1 |
| GROWTH | 4 | 2 | 0 | 0 | 0 |
| SALES | 3 | 0 | 0 | 2 | 0 |
| CONTENT | 2 | 0 | 0 | 2 | 0 |
| RESEARCH | 1 | 2 | 0 | 0 | 0 |
| AUTOMATION | 1 | 1 | 0 | 0 | 0 |
| TECH_DEBT | 2 | 3 | 0 | 0 | 1 |
| **TOTAL** | **20** | **21** | **0** | **7** | **2** |

---

## Sprint actual — Semana 1: Estabilización (2026-05-30 → 2026-06-05)

**Objetivo:** Tener FORGE deployado con URL pública + primeros 3 beta testers

**Tareas del sprint (ordenadas por ROI):**

| Orden | ID | ROI | Título |
|-------|----|-----|--------|
| 1 | CRIT-003 | 9.0 | Inicializar Git + primer commit |
| 2 | PROD-006 | 9.0 | Cap localStorage 365 entradas/store |
| 3 | PROD-002 | 8.0 | Markdown rendering en Oracle |
| 4 | TECH-004 | 8.0 | Probar build de producción local |
| 5 | CRIT-002 | 8.0 | Crear PWA icons |
| 6 | CRIT-001 | 5.0 | Rate limiting /api/oracle |
| 7 | CRIT-004 | 3.3 | Deploy en Vercel (desbloquea 7 tareas) |
| 8 | TECH-003 | 7.0 | Headers de seguridad next.config.ts |
| 9 | PROD-008 | 7.0 | Error Boundary global |
| 10 | PROD-009 | 6.0 | Eliminar deps muertas |

---

## Sprint siguiente — Semana 2: Activación (2026-06-06 → 2026-06-12)

**Objetivo:** Primeros 10 beta testers activos + Oracle funcionando bien desde Day 1

| Orden | ID | ROI | Título |
|-------|----|-----|--------|
| 1 | GROW-002 | 3.0 | Reclutar 10 beta testers (desbloqueado por CRIT-004) |
| 2 | PROD-014 | 8.0 | Instalar Plausible Analytics |
| 3 | PROD-005 | 4.0 | Oracle guidance con pocos datos |
| 4 | PROD-003 | 3.5 | hrv/rhr opcionales en VitalEntry |
| 5 | PROD-001 | 4.0 | Skeleton loading states |
| 6 | GROW-001 | 7.0 | Crear Twitter/X para FORGE |
| 7 | GROW-006 | 3.0 | SEO básico |
| 8 | RESE-001 | 4.0 | Validar demanda Life Score en Reddit |
| 9 | RESE-003 | 3.5 | Identificar comunidades Slack/Discord |
| 10 | PROD-016 | 3.5 | Guided first actions Day 1 |

---

## Próximos hitos

| Hito | Target | Tareas que lo desbloquean |
|------|--------|--------------------------|
| URL pública live | 2026-06-02 | CRIT-003 → CRIT-004 |
| 10 beta testers activos | 2026-06-10 | CRIT-004 → GROW-002 |
| Oracle usable desde Day 1 | 2026-06-08 | PROD-005 |
| Primeros ingresos posibles | 2026-07-01 | SALE-001 → SALE-002 → SALE-003 |
| €500 MRR | 2026-07-30 | Todo Sprint 2 + SALE-002 |
