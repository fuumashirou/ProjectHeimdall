import { type Octokit } from 'octokit';

import type { PullRequest } from '../types';

/**
 * @description Obtiene las pull requests de un repositorio de GitHub.
 * Esta función recupera todas las pull requests del repositorio especificado,
 * permitiendo filtrar por estado (abiertas, cerradas o todas).
 *
 * @example
 * ```typescript
 * // Obtener pull requests abiertas
 * const openPRs = await fetchPullRequests({
 *   client,
 *   owner: 'facebook',
 *   repo: 'react',
 *   state: 'open'
 * });
 *
 * // Obtener todas las pull requests
 * const allPRs = await fetchPullRequests({
 *   client,
 *   owner: 'facebook',
 *   repo: 'react',
 *   state: 'all'
 * });
 * ```
 *
 * @param params - Objeto con los parámetros de la petición
 * @param params.client - Instancia del cliente de GitHub API (Octokit)
 * @param params.owner - Nombre del usuario u organización propietaria del repositorio
 * @param params.repo - Nombre del repositorio en GitHub
 * @param params.state - Estado de las pull requests a recuperar ('open' | 'closed' | 'all')
 * @param params.since - Fecha de inicio en formato ISO 8601 (opcional)
 * @param params.until - Fecha de fin en formato ISO 8601 (opcional)
 *
 * @returns Array de objetos PullRequest con la información de cada PR
 * @returns [].id - ID único de la pull request
 * @returns [].number - Número de la pull request
 * @returns [].title - Título de la pull request
 * @returns [].state - Estado de la pull request
 * @returns [].createdAt - Fecha de creación
 * @returns [].mergedAt - Fecha de merge (null si no está mergeada)
 * @returns [].author - Autor de la pull request
 *
 * @throws Error si el cliente de GitHub no está configurado
 * @throws Error si el repositorio no existe o no se tiene acceso
 * @throws Error si ocurre un fallo en la conexión con la API de GitHub
 *
 * @see {@link https://docs.github.com/en/rest/pulls/pulls#list-pull-requests|GitHub API Documentation}
 */
export async function fetchPullRequests(params: {
  client: Octokit;
  owner: string;
  repo: string;
  state: 'open' | 'closed' | 'all';
  since?: string;
  until?: string;
}): Promise<PullRequest[]> {
  const {
    client,
    owner,
    repo,
    state,
    since,
    until: _until,
  } = params;

  if (!client) {
    throw new Error('GitHub client is required');
  }

  if (!owner || !repo) {
    throw new Error('Owner and repo are required');
  }

  try {
    const response = await client.rest.pulls.list({
      owner,
      repo,
      state,
      sort: 'created',
      direction: 'desc',
      since,
    });

    return response.data.map((pr) => ({
      id: pr.id,
      number: pr.number,
      title: pr.title,
      state: (pr.state === 'closed' && pr.merged_at ? 'merged' : pr.state) as PullRequest['state'],
      createdAt: pr.created_at,
      mergedAt: pr.merged_at,
      author: pr.user?.login || '',
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch pull requests: ${error.message}`);
    }
    throw new Error('Failed to fetch pull requests: Unknown error');
  }
}

/**
 * @description Calcula estadísticas de las pull requests.
 * Esta función analiza un array de pull requests y calcula métricas
 * como cantidad de abiertas, cerradas, mergeadas y tiempo promedio de merge.
 *
 * @example
 * ```typescript
 * const prs = await fetchPullRequests({...});
 * const stats = calculatePRStats(prs);
 *
 * console.log(`Open: ${stats.open}, Merged: ${stats.merged}`);
 * // Output: Open: 5, Merged: 18
 * ```
 *
 * @param pullRequests - Array de pull requests a analizar
 * @param period - Período de tiempo de las estadísticas
 * @returns Objeto con las estadísticas calculadas
 * @returns open - Número de pull requests abiertas
 * @returns closed - Número de pull requests cerradas
 * @returns merged - Número de pull requests mergeadas
 * @returns avgTimeToMerge - Tiempo promedio en días para hacer merge
 *
 * @throws Error si el array de pull requests no es válido
 */
export function calculatePRStats(
  pullRequests: PullRequest[],
  period: '7d' | '30d' | '90d' | '12m' = '7d',
): {
  open: number;
  closed: number;
  merged: number;
  avgTimeToMerge: number;
  period: '7d' | '30d' | '90d' | '12m';
} {
  if (!Array.isArray(pullRequests)) {
    throw new Error('Pull requests must be an array');
  }

  const open = pullRequests.filter((pr) => pr.state === 'open').length;
  const closed = pullRequests.filter((pr) => pr.state === 'closed').length;
  const merged = pullRequests.filter((pr) => pr.state === 'merged').length;

  const mergedPRs = pullRequests.filter((pr) => pr.state === 'merged' && pr.mergedAt);
  let avgTimeToMerge = 0;

  if (mergedPRs.length > 0) {
    const totalDays = mergedPRs.reduce((total, pr) => {
      const created = new Date(pr.createdAt).getTime();
      const merged = new Date(pr.mergedAt!).getTime();
      return total + (merged - created) / (1000 * 60 * 60 * 24);
    }, 0);
    avgTimeToMerge = Math.round((totalDays / mergedPRs.length) * 10) / 10;
  }

  return {
    open,
    closed,
    merged,
    avgTimeToMerge,
    period,
  };
}
