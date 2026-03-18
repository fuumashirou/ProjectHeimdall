# ETAPA 3: Integración GitHub API ✅

## Objetivo
Implementar la capa de integración con la API de GitHub usando Octokit, incluyendo fetch de commits, pull requests y cálculos estadísticos.

## Archivos Involucrados
```
lib/github/client.ts          → Cliente GitHub API (Octokit)
lib/github/commits.ts         → Operaciones de commits
lib/github/pull-requests.ts   → Operaciones de pull requests
lib/github/stats.ts           → Cálculos estadísticos
```

## Tareas
- [x] Implementar cliente GitHub en `lib/github/client.ts`:
  - `createGitHubClient()`: Crea instancia de Octokit con token
  - `getGitHubClientFromEnv()`: Crea cliente desde variables de entorno
- [x] Implementar operaciones de commits en `lib/github/commits.ts`:
  - `fetchCommits()`: Obtiene commits de un repositorio con paginación
  - `groupCommitsByDate()`: Agrupa commits por fecha para gráficos
- [x] Implementar operaciones de PRs en `lib/github/pull-requests.ts`:
  - `fetchPullRequests()`: Obtiene PRs con filtros de estado y fecha
  - `calculatePRStats()`: Calcula métricas (open, closed, merged, avg merge time)
- [x] Implementar estadísticas en `lib/github/stats.ts`:
  - `calculateLOCStats()`: Calcula additions, deletions, net y tendencia
  - `getCommitTrends()`: Calcula tendencias de actividad de commits

## Tareas DORA
- [x] Implementar módulo DORA en `lib/github/dora.ts`:
  - `classifyCommits()`: Clasifica commits de main en merge commits y commits directos
  - `identifyDeployments()`: Extrae merge commits como deployments
  - `identifyHotfixes()`: Filtra commits directos con "hotfix"/"fix" en el mensaje
  - `calculateDeploymentFrequency()`: Merge commits por período (diario/semanal/mensual)
  - `calculateLeadTimeForChanges()`: Tiempo desde primer commit del branch hasta su merge commit
  - `calculateChangeFailureRate()`: Proporción de hotfixes vs total de cambios a main
  - `calculateMTTR()`: Tiempo promedio entre un merge commit y su hotfix posterior
  - `calculateDORAMetrics()`: Orquesta todas las métricas y retorna `DORAMetrics`

## Lógica de Detección (basada en commits, sin PRs)
- **Deployment** = merge commit en main (mensaje contiene `Merge branch '...'`)
- **Change Failure** = commit directo a main con "hotfix" en mensaje (alta confianza) o con "fix" en mensaje (confianza media)
- **Lead Time** = fecha del primer commit del branch → fecha del merge commit (se obtiene comparando el branch ref en el merge commit con la API de comparación)
- **MTTR** = fecha del merge commit (deployment) → fecha del hotfix posterior más cercano

## Limitaciones Resueltas

> ✅ `fetchCommits()` ahora obtiene additions/deletions reales
> - Hace fetch individual por commit (`GET /repos/{owner}/{repo}/commits/{sha}`)
> - Procesa en lotes de 5 para respetar rate limits
> - Si falla un commit individual, usa 0 como fallback

## Mejoras Pendientes
- [ ] Cachear resultados para no repetir llamadas
- [x] Fetch real de additions/deletions por commit
- [x] Rate limiting: procesamiento en lotes de 5 requests concurrentes
