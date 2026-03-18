# ETAPA 4: Componentes del Dashboard ✅

## Objetivo
Crear los componentes visuales del dashboard: gráficos de commits, estadísticas de líneas de código, estadísticas de PRs y uso de tokens.

## Archivos Involucrados
```
components/dashboard/CommitChart.tsx      → Gráfico de barras de commits
components/dashboard/LOCStats.tsx         → Estadísticas de líneas de código
components/dashboard/PRStats.tsx          → Estadísticas de pull requests
components/dashboard/TokenUsage.tsx       → Uso de tokens (placeholder)
components/dashboard/DORAMetrics.tsx      → Métricas DORA
components/dashboard/PeriodSelector.tsx   → Selector global de período
components/ui/button.tsx                 → Componente botón (shadcn/ui)
components/ui/card.tsx                   → Componente card (shadcn/ui)
components/ui/tabs.tsx                   → Componente tabs (shadcn/ui)
```

## Tareas
- [x] **CommitChart**:
  - Gráfico de barras usando Recharts (BarChart)
  - ~~Selector de período de tiempo (7d, 30d, 90d)~~ → movido a selector global
  - Soporte para tema oscuro
  - Tooltip con detalles al hacer hover
  - Responsive (se adapta al contenedor)
- [x] **Selector de período global** (`components/dashboard/PeriodSelector.tsx`):
  - Selector único que controla el período de todo el dashboard
  - Opciones: 7d (default), 30d, 90d, 1y
  - Advertencia visual en 1y: "Puede tardar más en cargar"
  - Afecta: CommitChart, LOCStats, PRStats, DORAMetrics
- [x] **LOCStats**:
  - Grid de 3 columnas: additions, deletions, net
  - Indicadores de tendencia (↑ verde, ↓ rojo)
  - Iconos diferenciados por tipo de métrica
  - Cards con shadcn/ui
- [x] **PRStats**:
  - Grid de 4 columnas: open, closed, merged, avg merge time
  - Indicadores de tendencia
  - Formateo del tiempo promedio de merge (horas/días)
  - Cards con shadcn/ui
- [x] **TokenUsage**:
  - Placeholder con mensaje "Coming Soon"
  - Diseño preparado para futura integración con Cursor API

## Tareas DORA
- [x] **DORAMetrics** (`components/dashboard/DORAMetrics.tsx`):
  - Panel con las 4 métricas DORA en cards
  - **Deployment Frequency**: valor + clasificación (Elite/High/Medium/Low)
  - **Lead Time for Changes**: tiempo promedio + clasificación
  - **Change Failure Rate**: porcentaje + clasificación
  - **MTTR**: tiempo promedio + clasificación
  - Código de colores según nivel DORA (Elite=verde, High=azul, Medium=amarillo, Low=rojo)
  - Tooltip explicativo en cada métrica

### Clasificación DORA
| Métrica | Elite | High | Medium | Low |
|---|---|---|---|---|
| Deployment Frequency | Múltiples/día | 1/día - 1/semana | 1/semana - 1/mes | < 1/mes |
| Lead Time | < 1 hora | < 1 día | < 1 semana | > 1 semana |
| Change Failure Rate | < 5% | < 10% | < 15% | > 15% |
| MTTR | < 1 hora | < 1 día | < 1 semana | > 1 semana |

## Limitaciones Conocidas

> **⚠️ TokenUsage** es solo un placeholder visual, no tiene funcionalidad real

> ✅ LOCStats ahora muestra datos reales (resuelto en etapa 3)

## Notas
- Todos los componentes soportan tema oscuro automáticamente
- Se usa shadcn/ui para consistencia visual
- Recharts es lazy-loaded para mejor performance
- Los componentes son "presentacionales" (reciben datos como props)
