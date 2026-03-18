import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from 'lucide-react';

import type { LOCStats } from '@/lib/types';

/**
 * @description Componente que muestra estadísticas de líneas de código.
 * Visualiza el total de líneas agregadas, eliminadas y la diferencia neta
 * con comparaciones con el período anterior.
 *
 * @example
 * ```typescript
 * <LOCStats
 *   stats={{
 *     additions: 1500,
 *     deletions: 750,
 *     net: 750,
 *     period: '7d'
 *   }}
 *   previousStats={{
 *     additions: 1200,
 *     deletions: 600,
 *     net: 600,
 *     period: '7d'
 *   }}
 * />
 * ```
 *
 * @param stats - Estadísticas actuales de líneas de código
 * @param stats.additions - Total de líneas agregadas
 * @param stats.deletions - Total de líneas eliminadas
 * @param stats.net - Diferencia neta entre adiciones y eliminaciones
 * @param stats.period - Período de tiempo de las estadísticas
 * @param previousStats - Estadísticas del período anterior para comparación (opcional)
 *
 * @returns Componente React que renderiza las estadísticas de LOC
 */
type LOCStatsProps = {
  stats: LOCStats;
  previousStats?: LOCStats;
};

export function LOCStats({ stats, previousStats }: LOCStatsProps) {
  const getChangeIcon = (
    current: number,
    previous: number | undefined,
  ): React.ReactNode => {
    if (!previous) return <MinusIcon className="w-4 h-4 text-gray-500" />;

    const diff = current - previous;

    if (diff > 0) {
      return <ArrowUpIcon className="w-4 h-4 text-green-600" />;
    } if (diff < 0) {
      return <ArrowDownIcon className="w-4 h-4 text-red-600" />;
    }
    return <MinusIcon className="w-4 h-4 text-gray-500" />;
  };

  const getChangePercentage = (
    current: number,
    previous: number | undefined,
  ): string => {
    if (!previous || previous === 0) return '0%';

    const percentage = ((current - previous) / previous) * 100;
    return `${Math.abs(percentage).toFixed(1)}%`;
  };

  const getChangeColor = (
    current: number,
    previous: number | undefined,
  ): string => {
    if (!previous) return 'text-gray-500';

    const diff = current - previous;

    if (diff > 0) return 'text-green-600';
    if (diff < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Additions
          </h4>
          {getChangeIcon(stats.additions, previousStats?.additions)}
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {stats.additions.toLocaleString()}
        </div>
        {previousStats && (
          <div
            className={`text-sm mt-1 ${getChangeColor(stats.additions, previousStats.additions)}`}
          >
            {getChangePercentage(stats.additions, previousStats.additions)} vs previous
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Deletions
          </h4>
          {getChangeIcon(stats.deletions, previousStats?.deletions)}
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {stats.deletions.toLocaleString()}
        </div>
        {previousStats && (
          <div
            className={`text-sm mt-1 ${getChangeColor(stats.deletions, previousStats.deletions)}`}
          >
            {getChangePercentage(stats.deletions, previousStats.deletions)} vs previous
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Net Change
          </h4>
          {getChangeIcon(stats.net, previousStats?.net)}
        </div>
        <div className={`text-2xl font-bold ${stats.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {stats.net >= 0 ? '+' : ''}
          {stats.net.toLocaleString()}
        </div>
        {previousStats && (
          <div className={`text-sm mt-1 ${getChangeColor(stats.net, previousStats.net)}`}>
            {getChangePercentage(stats.net, previousStats.net)} vs previous
          </div>
        )}
      </div>
    </div>
  );
}
