# ETAPA 5: Integración y Página Principal ✅

## Objetivo
Conectar todos los componentes del dashboard en una página funcional, implementar el hook de datos y crear la landing page.

## Archivos Involucrados
```
hooks/useGitHubData.ts           → Hook principal para fetch de datos
app/dashboard/page.tsx           → Página del dashboard
app/page.tsx                     → Landing page
```

## Tareas
- [x] Implementar hook `useGitHubData` en `hooks/useGitHubData.ts`:
  - Orquesta fetch de commits, pull requests y métricas DORA
  - Maneja estados: loading, error, data
  - Acepta configuración: org, repos, timeRange
  - Retorna datos formateados para cada componente
- [x] Agregar fetch de métricas DORA al hook `useGitHubData`:
  - Incluye llamada a `calculateDORAMetrics()` de `lib/github/dora.ts`
  - Retorna `DORAMetrics` junto con el resto de datos
- [x] Implementar página del dashboard en `app/dashboard/page.tsx`:
  - Layout con grid responsivo
  - Integración de CommitChart, LOCStats, PRStats, DORAMetrics, TokenUsage
- [x] Agregar componente DORAMetrics al dashboard
  - Estado de carga (spinner)
  - Estado de error (mensaje con opción de retry)
  - Header con título y selector de período
- [x] Implementar landing page en `app/page.tsx`:
  - Presentación del proyecto Heimdall
  - Call-to-action (CTA) hacia el dashboard
  - Diseño responsive
- [x] Integrar selector de período global en el dashboard:
  - `PeriodSelector` controla el estado de período (7d default, 30d, 90d, 1y)
  - Cambio de período dispara re-fetch de todos los datos (commits, PRs, DORA)
  - CommitChart ya no tiene selector local de período

## Limitaciones Conocidas

> **⚠️ Selector de repositorios hardcodeado al primer repositorio**
> - Se necesita implementar selección dinámica de múltiples repos
> - La variable `GITHUB_REPOS` soporta múltiples repos separados por coma
> - Pero el hook actualmente solo usa el primero

## Notas
- `useGitHubData` hace las llamadas desde el cliente (Client Component)
- En futuro se podría migrar a Server Actions para mejor seguridad del token
- El período es estado local del dashboard, controlado por `PeriodSelector`
- DORA metrics se calculan sobre los mismos commits ya obtenidos (sin requests extra)
