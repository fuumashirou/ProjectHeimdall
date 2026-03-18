# ETAPA 2: Tipos y Utilidades ✅

## Objetivo
Definir los tipos TypeScript del dominio y crear funciones utilitarias reutilizables que serán la base para el resto de la aplicación.

## Archivos Involucrados
```
lib/types.ts              → Definiciones de tipos TypeScript
lib/utils.ts              → Funciones utilitarias generales
```

## Tareas
- [x] Definir tipos en `lib/types.ts`:
  - `Commit`: sha, message, author, date, additions, deletions
  - `PullRequest`: id, title, state, author, createdAt, mergedAt, closedAt
  - `CommitDataPoint`: date, count (para gráficos)
  - `LOCStats`: additions, deletions, net, trend
  - `PRStats`: open, closed, merged, avgMergeTime
  - `CursorUsageData`: placeholder para futura integración
  - `DashboardConfig`: org, repos, timeRange
- [x] Actualizar tipo `TimePeriod` para incluir `'1y'`
- [x] Actualizar `getStartDate()` en `lib/utils.ts` para soportar período `'1y'`
- [x] Definir tipos DORA en `lib/types.ts`:
  - `DORAMetrics`: deploymentFrequency, leadTimeForChanges, changeFailureRate, mttr
  - `DORALevel`: elite, high, medium, low
  - `Deployment`: sha, date, prNumber, title (merge de PR a main)
  - `ChangeFailure`: sha, date, message, confidence (high/medium)
- [x] Implementar utilidades en `lib/utils.ts`:
  - `cn()`: Merge de clases CSS (clsx + tailwind-merge)
  - `formatDate()`: Formateo de fechas legible
  - `getDaysDiff()`: Diferencia en días entre dos fechas
  - `getStartDate()`: Calcular fecha inicio según período seleccionado
  - `groupBy()`: Agrupar arrays por una clave

## Notas
- Los tipos son la fuente de verdad para toda la aplicación
- `cn()` es estándar de shadcn/ui para combinar clases de Tailwind
- `getStartDate()` soporta períodos: 7d, 30d, 90d, 1y
