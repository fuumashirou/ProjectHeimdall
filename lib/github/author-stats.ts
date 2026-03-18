import type { AuthorStats, Commit } from '../types';
import { groupBy } from '../utils';

/**
 * @description Calcula estadísticas de actividad desglosadas por autor.
 * Agrupa los commits por autor y reduce cada grupo a totales de commits,
 * additions y deletions. Ordena por número de commits descendente.
 *
 * @param commits - Array de commits a analizar
 * @returns Array de estadísticas por autor, ordenado por commits desc
 */
export function calculateAuthorStats(commits: Commit[]): AuthorStats[] {
  const grouped = groupBy(commits, 'author');

  return Object.entries(grouped)
    .map(([author, authorCommits]) => ({
      author,
      commits: authorCommits.length,
      additions: authorCommits.reduce((sum, c) => sum + c.stats.additions, 0),
      deletions: authorCommits.reduce((sum, c) => sum + c.stats.deletions, 0),
    }))
    .sort((a, b) => b.commits - a.commits);
}
