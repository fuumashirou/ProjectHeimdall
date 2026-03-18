import type { Commit, LOCStats } from '../types';

/**
 * @description Calcula estadísticas de líneas de código modificadas.
 * Esta función analiza un array de commits y calcula el total de líneas
 * agregadas, eliminadas y la diferencia neta.
 *
 * @example
 * ```typescript
 * const commits = [
 *   { stats: { additions: 100, deletions: 50 } },
 *   { stats: { additions: 200, deletions: 75 } }
 * ];
 *
 * const stats = calculateLOCStats(commits, '7d');
 * console.log(`Net: ${stats.net}`);
 * // Output: Net: 175
 * ```
 *
 * @param commits - Array de commits a analizar
 * @param period - Período de tiempo de las estadísticas
 * @returns Objeto con las estadísticas calculadas
 * @returns additions - Total de líneas agregadas
 * @returns deletions - Total de líneas eliminadas
 * @returns net - Diferencia neta entre adiciones y eliminaciones
 * @returns period - Período de tiempo
 *
 * @throws Error si el array de commits no es válido
 */
export function calculateLOCStats(
  commits: Commit[],
  period: '7d' | '30d' | '90d' | '12m' = '7d',
): LOCStats {
  if (!Array.isArray(commits)) {
    throw new Error('Commits must be an array');
  }

  const additions = commits.reduce((total, commit) => total + commit.stats.additions, 0);
  const deletions = commits.reduce((total, commit) => total + commit.stats.deletions, 0);

  return {
    additions,
    deletions,
    net: additions - deletions,
    period,
  };
}

/**
 * @description Obtiene tendencias de commits en diferentes períodos.
 * Esta función compara los commits de diferentes períodos para identificar
 * tendencias de actividad en el repositorio.
 *
 * @example
 * ```typescript
 * const trends = getCommitTrends({
 *   currentCommits: commits7d,
 *   previousCommits: commitsPrevious7d,
 *   currentPeriod: '7d'
 * });
 *
 * console.log(`Change: ${trends.percentageChange}%`);
 * // Output: Change: +15.5%
 * ```
 *
 * @param params - Objeto con los parámetros del análisis
 * @param params.currentCommits - Array de commits del período actual
 * @param params.previousCommits - Array de commits del período anterior
 * @param params.currentPeriod - Período actual ('7d' | '30d' | '90d')
 * @returns Objeto con las tendencias calculadas
 * @returns currentCount - Número de commits en el período actual
 * @returns previousCount - Número de commits en el período anterior
 * @returns percentageChange - Porcentaje de cambio entre períodos
 * @returns trend - Tendencia ('up' | 'down' | 'stable')
 *
 * @throws Error si los arrays de commits no son válidos
 */
export function getCommitTrends(params: {
  currentCommits: Commit[];
  previousCommits: Commit[];
  currentPeriod: '7d' | '30d' | '90d';
}): {
  currentCount: number;
  previousCount: number;
  percentageChange: number;
  trend: 'up' | 'down' | 'stable';
} {
  const { currentCommits, previousCommits, currentPeriod: _currentPeriod } = params;

  if (!Array.isArray(currentCommits) || !Array.isArray(previousCommits)) {
    throw new Error('Commits must be arrays');
  }

  const currentCount = currentCommits.length;
  const previousCount = previousCommits.length;

  if (previousCount === 0) {
    return {
      currentCount,
      previousCount,
      percentageChange: currentCount > 0 ? 100 : 0,
      trend: currentCount > 0 ? 'up' : 'stable',
    };
  }

  const percentageChange = Math.round(
    ((currentCount - previousCount) / previousCount) * 100,
  );

  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (percentageChange > 5) {
    trend = 'up';
  } else if (percentageChange < -5) {
    trend = 'down';
  }

  return {
    currentCount,
    previousCount,
    percentageChange,
    trend,
  };
}
