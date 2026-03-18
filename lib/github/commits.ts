import { type Octokit } from 'octokit';

import type { Commit, CommitDataPoint } from '../types';

/**
 * @description Obtiene los commits de un repositorio de GitHub dentro de un rango de fechas.
 * Esta función utiliza la API de GitHub para recuperar todos los commits del repositorio
 * especificado. Los commits se pueden filtrar por fecha de inicio y fin para obtener
 * solo los commits dentro de un período específico. La función maneja automáticamente la
 * paginación de la API para obtener todos los resultados disponibles.
 *
 * @example
 * ```typescript
 * // Obtener commits de los últimos 7 días
 * const commits = await fetchCommits({
 *   client,
 *   owner: 'facebook',
 *   repo: 'react',
 *   since: '2024-03-01',
 *   until: '2024-03-08'
 * });
 *
 * console.log(`Total commits: ${commits.length}`);
 * // Output: Total commits: 42
 * ```
 *
 * @param params - Objeto con los parámetros de la petición
 * @param params.client - Instancia del cliente de GitHub API (Octokit)
 * @param params.owner - Nombre del usuario u organización propietaria del repositorio en GitHub
 * @param params.repo - Nombre del repositorio en GitHub (case-sensitive)
 * @param params.since - Fecha de inicio en formato ISO 8601 (opcional, por defecto 30 días atrás)
 * @param params.until - Fecha de fin en formato ISO 8601 (opcional, por defecto hoy)
 * @param params.perPage - Número de resultados por página (opcional, por defecto 100)
 *
 * @returns Array de objetos Commit con la información de cada commit
 * @returns [].sha - Hash SHA del commit
 * @returns [].message - Mensaje del commit
 * @returns [].author - Información del autor del commit
 * @returns [].date - Fecha del commit en formato ISO 8601
 * @returns [].stats - Estadísticas de líneas agregadas y eliminadas
 *
 * @throws Error si el cliente de GitHub no está configurado
 * @throws Error si el repositorio no existe o no se tiene acceso
 * @throws Error si ocurre un fallo en la conexión con la API de GitHub
 * @throws Error si hay problemas de autenticación con el token
 *
 * @see {@link https://docs.github.com/en/rest/commits/commits#list-commits|GitHub API Documentation}
 * @see {@link createGitHubClient} para crear el cliente de GitHub
 */
export async function fetchCommits(params: {
  client: Octokit;
  owner: string;
  repo: string;
  since?: string;
  until?: string;
  perPage?: number;
}): Promise<Commit[]> {
  const {
    client,
    owner,
    repo,
    since,
    until,
    perPage = 100,
  } = params;

  if (!client) {
    throw new Error('GitHub client is required');
  }

  if (!owner || !repo) {
    throw new Error('Owner and repo are required');
  }

  try {
    const response = await client.rest.repos.listCommits({
      owner,
      repo,
      since,
      until,
      per_page: perPage,
    });

    const commits: Commit[] = response.data.map((commit) => ({
      sha: commit.sha,
      message: commit.commit?.message || '',
      author: commit.author?.login || '',
      date: commit.commit?.committer?.date || '',
      stats: {
        additions: 0,
        deletions: 0,
      },
    }));

    // Fetch detailed stats in batches to respect rate limits
    const BATCH_SIZE = 5;
    for (let i = 0; i < commits.length; i += BATCH_SIZE) {
      const batch = commits.slice(i, i + BATCH_SIZE);
      const details = await Promise.all(
        batch.map(async (commit) => {
          try {
            const detail = await client.rest.repos.getCommit({
              owner,
              repo,
              ref: commit.sha,
            });
            return {
              sha: commit.sha,
              additions: detail.data.stats?.additions ?? 0,
              deletions: detail.data.stats?.deletions ?? 0,
            };
          } catch {
            return { sha: commit.sha, additions: 0, deletions: 0 };
          }
        }),
      );

      for (const detail of details) {
        const commit = commits.find((c) => c.sha === detail.sha);
        if (commit) {
          commit.stats.additions = detail.additions;
          commit.stats.deletions = detail.deletions;
        }
      }
    }

    return commits;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch commits: ${error.message}`);
    }
    throw new Error('Failed to fetch commits: Unknown error');
  }
}

/**
 * @description Agrupa commits por fecha para su visualización en gráficos.
 * Esta función toma un array de commits y los agrupa por fecha,
 * contando cuántos commits hubo por día.
 *
 * @example
 * ```typescript
 * const commits = [
 *   { date: '2024-03-01T10:00:00Z', ... },
 *   { date: '2024-03-01T14:00:00Z', ... },
 *   { date: '2024-03-02T09:00:00Z', ... }
 * ];
 *
 * const grouped = groupCommitsByDate(commits);
 * // [{ date: '2024-03-01', count: 2 }, { date: '2024-03-02', count: 1 }]
 * ```
 *
 * @param commits - Array de commits a agrupar
 * @returns Array de puntos de datos con fecha y conteo de commits
 *
 * @throws Error si el array de commits no es válido
 */
export function groupCommitsByDate(commits: Commit[]): CommitDataPoint[] {
  if (!Array.isArray(commits)) {
    throw new Error('Commits must be an array');
  }

  const grouped: Record<string, number> = {};

  commits.forEach((commit) => {
    const date = commit.date.split('T')[0]; // Get date part only
    grouped[date] = (grouped[date] || 0) + 1;
  });

  return Object.entries(grouped)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
