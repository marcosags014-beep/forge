# FORGE — UI Strategy
**Fase 12 completada:** 2026-05-30

---

## Stack UI actual — Evaluación

| Componente | Estado | Veredicto |
|------------|--------|-----------|
| Next.js 16 App Router | Activo | Mantener — es el core |
| React 19 | Activo | Mantener |
| Tailwind CSS v4 | Activo | Mantener — buen sistema de design tokens |
| shadcn/ui | Activo | Mantener — componentes maduros |
| Recharts | Activo | Mantener — suficiente para el MVP |
| @base-ui/react | Muerto | Eliminar — dep sin uso |
| Lucide React | Activo | Mantener |

**Conclusión:** El stack es sólido. No cambiar hasta €5K MRR. La prioridad es arreglar UX, no refactorizar herramientas.

---

## Evaluación de UIs alternativas de Chat

### Pregunta: ¿Debería reemplazar el Oracle chat custom por Open WebUI, LibreChat o AnythingLLM?

**Análisis:**

| Opción | Ventaja | Desventaja | Veredicto |
|--------|---------|-----------|-----------|
| Open WebUI embebido | UI madura, muchas features | Difícil de incrustar en Next.js, branding ajeno | ❌ No usar |
| LibreChat | Soporte multi-modelo | Muy pesado, requiere Docker, no se integra en FORGE | ❌ No usar |
| AnythingLLM | Local knowledge base | Caso de uso distinto, no es un chat de bienestar | ❌ No usar |
| Oracle custom (actual) | Integrado, branded, contexto de datos de FORGE | Requiere mantener | ✅ Mantener |

**Decisión: Oracle custom es el correcto.** El diferenciador de FORGE es que Oracle tiene contexto de TODOS tus datos. Ninguna UI externa tiene eso. El chat custom en Next.js es la única opción que permite inyectar el contexto del usuario (Life Score, vitals, habits, finanzas) en el system prompt.

---

## Mejoras de UI prioritarias

### Críticas (bloquean usabilidad)

**1. Skeleton loading states**
```tsx
// Patrón a aplicar en todas las páginas:
if (!mounted) return (
  <div className="space-y-4">
    <Skeleton className="h-32 w-full rounded-xl" />
    <Skeleton className="h-64 w-full rounded-xl" />
    <Skeleton className="h-48 w-full rounded-xl" />
  </div>
)
```
Aplicar en: Command Center, Oracle, Insights, Wealth, Review

**2. Markdown rendering en Oracle**
```tsx
// Instalar react-markdown:
npm install react-markdown

// En oracle/page.tsx:
import ReactMarkdown from 'react-markdown'

<ReactMarkdown className="prose prose-invert prose-sm max-w-none">
  {message.content}
</ReactMarkdown>
```

**3. PWA — App instalable**
```json
// public/manifest.json — añadir:
{
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### Importantes (mejoran UX significativamente)

**4. Command Center — comparativa con ayer**
```tsx
// En command-center, junto a cada score:
const yesterdayScore = getYesterdayScore()
const delta = todayScore - yesterdayScore
<span className={delta > 0 ? 'text-green-400' : 'text-red-400'}>
  {delta > 0 ? '↑' : '↓'} {Math.abs(delta).toFixed(0)}
</span>
```

**5. Life Score histórico — gráfica mini en Command Center**
```tsx
// Mini sparkline de los últimos 7 días:
import { LineChart, Line } from 'recharts'
<LineChart width={120} height={40} data={last7days}>
  <Line type="monotone" dataKey="score" stroke="#f97316" dot={false} />
</LineChart>
```

**6. Oracle — indicador "pensando"**
```tsx
// Dots animation mientras espera respuesta:
{isLoading && (
  <div className="flex gap-1 p-3">
    {[0,1,2].map(i => (
      <div key={i} className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" 
           style={{ animationDelay: `${i * 0.1}s` }} />
    ))}
  </div>
)}
```

### Menores (polish)

**7. Habits — truncar nombres con tooltip**
```tsx
<Tooltip>
  <TooltipTrigger>
    <span className="truncate max-w-[120px] block">{habit.name}</span>
  </TooltipTrigger>
  <TooltipContent>{habit.name}</TooltipContent>
</Tooltip>
```

**8. Body workout — toast de confirmación**
```tsx
import { toast } from 'sonner'
// Al guardar workout:
toast.success('Workout saved!')
```

---

## Design System — Tokens definidos

```css
/* Colores principales (Tailwind CSS v4) */
--color-primary: oklch(0.705 0.213 47.604);  /* Orange FORGE */
--color-background: oklch(0.145 0 0);         /* Near black */
--color-card: oklch(0.205 0 0);               /* Dark card */
--color-border: oklch(0.269 0 0);             /* Subtle border */
--color-muted: oklch(0.556 0 0);              /* Muted text */

/* Semánticos */
--color-success: oklch(0.627 0.194 142.5);   /* Green */
--color-warning: oklch(0.78 0.189 82.8);      /* Yellow */
--color-danger: oklch(0.595 0.216 27.7);      /* Red */
```

---

## Mobile — Responsive prioridades

### Estado actual
- La app funciona en mobile pero no está optimizada
- Sidebar ocupa demasiado espacio en 13"
- Quick Log FAB se solapa con contenido en scroll

### Fixes inmediatos

**Sidebar colapsable en desktop pequeño:**
```tsx
// En layout-shell.tsx, para pantallas <1280px:
// Usar sidebar como drawer en vez de fija
const [sidebarOpen, setSidebarOpen] = useState(false)
// En <1280px: sidebar como overlay, no como columna fija
```

**FAB — offset para no bloquear contenido:**
```tsx
// Asegurar que no tape el último elemento visible:
className="fixed bottom-6 right-6 z-40"
// Añadir padding-bottom al main para que scroll no quede oculto:
// main: pb-24 en mobile
```

---

## Accesibilidad — mínimo requerido

- [ ] Todos los botones tienen `aria-label` descriptivo
- [ ] Los inputs tienen `htmlFor` / `id` correctos
- [ ] Los charts tienen `aria-label` o `title`
- [ ] Contraste mínimo 4.5:1 para texto sobre fondos
- [ ] Tab navigation funciona en el formulario de Setup

---

## Resumen Fase 12

**Decisión clave:** No reemplazar Oracle con soluciones externas. El contexto personalizado de datos es el moat.

**Quick wins de UI con mayor ROI:**
1. Skeleton loaders → percepción de app "profesional" inmediata
2. Markdown en Oracle → los usuarios lo están pidiendo sin saberlo (ven asteriscos)
3. PWA icons → la app es instalable, lo que aumenta retención un ~15%

**No construir:** Modo claro (no es el audience), tour interactivo con librerías externas (scope creep), tooltips extensos en todos los elementos.

**→ Fase 13:** `FORGE_MOBILE_PLAN.md`
