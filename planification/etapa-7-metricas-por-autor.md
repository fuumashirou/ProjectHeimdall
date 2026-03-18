# Etapa 7: Métricas por Autor

## Objetivo
Desglosar la actividad de commits por desarrollador, mostrando commits, additions y deletions por cada autor.

## Archivos creados
- `lib/github/author-stats.ts` — Función `calculateAuthorStats(commits)` que agrupa por autor y calcula totales
- `components/dashboard/AuthorBreakdown.tsx` — Tabla responsiva con avatar (inicial), nombre, commits, additions (verde), deletions (rojo)

## Archivos modificados
- `lib/types.ts` — Agregado tipo `AuthorStats`
- `hooks/useGitHubData.ts` — Calcula `authorStats` desde commits existentes, sin API calls extra
- `app/dashboard/page.tsx` — Sección `AuthorBreakdown` después de PR Stats

## Decisiones técnicas
- Se reutiliza `groupBy()` de `lib/utils.ts` para agrupar commits por `author`
- Los autores se ordenan por número de commits descendente
- No se hacen llamadas API adicionales: se calcula desde `commitsResult` existente

## Estado
Completada
