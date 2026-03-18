import { GitPullRequest, GitMerge, CheckCircle } from 'lucide-react';

import type { PRStats } from '@/lib/types';

/**
 * @description Componente que muestra estadísticas de pull requests.
 * Visualiza la cantidad de PRs abiertas, cerradas, mergeadas y el tiempo
 * promedio de merge con comparaciones con el período anterior.
 *
 * @example
 * ```typescript
 * <PRStats
 *   stats={{
 *     open: 5,
 *     closed: 20,
 *     merged: 18,
 *     avgTimeToMerge: 2.5,
 *     period: '7d'
 *   }}
 *   previousStats={{
 *     open: 4,
 *     closed: 15,
 *     merged: 14,
 *     avgTimeToMerge: 3.0,
 *     period: '7d'
 *   }}
 * />
 * ```
 *
 * @param stats - Estadísticas actuales de pull requests
 * @param stats.open - Número de pull requests abiertas
 * @param stats.closed - Número de pull requests cerradas
 * @param stats.merged - Número de pull requests mergeadas
 * @param stats.avgTimeToMerge - Tiempo promedio en días para hacer merge
 * @param stats.period - Período de tiempo de las estadísticas
 * @param previousStats - Estadísticas del período anterior para comparación (opcional)
 *
 * @returns Componente React que renderiza las estadísticas de PRs
 */
type PRStatsProps = {
  stats: PRStats;
  previousStats?: PRStats;
};

export function PRStats({ stats, previousStats }: PRStatsProps) {
  const getChange = (
    current: number,
    previous: number | undefined,
  ): { value: number; trend: 'up' | 'down' | 'stable' } => {
    if (!previous) return { value: 0, trend: 'stable' };

    const diff = current - previous;
    const percentage = (diff / previous) * 100;

    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (Math.abs(percentage) > 5) {
      trend = diff > 0 ? 'up' : 'down';
    }

    return { value: Math.abs(percentage), trend };
  };

  const renderStatCard = (
    title: string,
    value: number,
    icon: React.ReactNode,
    color: string,
    previousValue?: number,
  ): React.ReactNode => {
    const change = previousValue ? getChange(value, previousValue) : null;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {icon}
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </h4>
          </div>
          {change && (
            <div
              className={`text-sm font-medium ${
                change.trend === 'up' && title !== 'Avg Time to Merge'
                  ? 'text-green-600'
                  : change.trend === 'down' && title === 'Avg Time to Merge'
                    ? 'text-green-600'
                    : change.trend === 'up' && title === 'Avg Time to Merge'
                      ? 'text-red-600'
                      : 'text-red-600'
              }`}
            >
              {change.trend === 'up' ? '+' : ''}
              {change.value.toFixed(1)}
              %
            </div>
          )}
        </div>
        <div className={`text-2xl font-bold ${color}`}>
          {value.toLocaleString()}
          {title === 'Avg Time to Merge' && ' days'}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {renderStatCard(
        'Open',
        stats.open,
        <GitPullRequest className="w-4 h-4 text-blue-600" />,
        'text-blue-600',
        previousStats?.open,
      )}
      {renderStatCard(
        'Closed',
        stats.closed,
        <CheckCircle className="w-4 h-4 text-gray-600" />,
        'text-gray-600',
        previousStats?.closed,
      )}
      {renderStatCard(
        'Merged',
        stats.merged,
        <GitMerge className="w-4 h-4 text-green-600" />,
        'text-green-600',
        previousStats?.merged,
      )}
      {renderStatCard(
        'Avg Time to Merge',
        stats.avgTimeToMerge,
        <GitMerge className="w-4 h-4 text-purple-600" />,
        'text-purple-600',
        previousStats?.avgTimeToMerge,
      )}
    </div>
  );
}
