import { useState, useEffect, useCallback } from 'react';

import { getGitHubClientFromEnv } from '@/lib/github/client';
import { calculateAuthorStats } from '@/lib/github/author-stats';
import { fetchCommits, groupCommitsByDate } from '@/lib/github/commits';
import { calculateDORAMetrics } from '@/lib/github/dora';
import { fetchPullRequests, calculatePRStats } from '@/lib/github/pull-requests';
import { calculateLOCStats } from '@/lib/github/stats';
import { getStartDate } from '@/lib/utils';
import type { AuthorStats, Commit, CommitDataPoint, DORAMetrics, LOCStats, PRStats, TimePeriod } from '@/lib/types';

/**
 * @description Mapa de períodos a días para el cálculo de DORA metrics.
 */
const PERIOD_DAYS: Record<TimePeriod, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '12m': 365,
};

/**
 * @description Hook personalizado para obtener y gestionar datos de GitHub.
 * Orquesta fetch de commits, pull requests y métricas DORA.
 * El período controla el rango de todos los datos.
 *
 * @param params.owner - Organización o usuario dueño del repositorio
 * @param params.repo - Nombre del repositorio
 * @param params.period - Período de tiempo para todas las métricas
 *
 * @returns Datos, métricas y estados del dashboard
 */
export function useGitHubData(params: {
  owner: string;
  repo: string;
  period: TimePeriod;
}) {
  const { owner, repo, period } = params;

  const [commits, setCommits] = useState<Commit[]>([]);
  const [commitsData, setCommitsData] = useState<CommitDataPoint[]>([]);
  const [locStats, setLOCStats] = useState<LOCStats | null>(null);
  const [prStats, setPRStats] = useState<PRStats | null>(null);
  const [doraMetrics, setDoraMetrics] = useState<DORAMetrics | null>(null);
  const [authorStats, setAuthorStats] = useState<AuthorStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const client = getGitHubClientFromEnv();
      const since = getStartDate(period);

      // Fetch commits
      const commitsResult = await fetchCommits({
        client,
        owner,
        repo,
        since,
      });

      setCommits(commitsResult);
      setCommitsData(groupCommitsByDate(commitsResult));
      setLOCStats(calculateLOCStats(commitsResult, period));
      setAuthorStats(calculateAuthorStats(commitsResult));

      // Calculate DORA metrics from commits
      setDoraMetrics(calculateDORAMetrics(commitsResult, PERIOD_DAYS[period]));

      // Fetch pull requests
      const prsResult = await fetchPullRequests({
        client,
        owner,
        repo,
        state: 'all',
      });

      setPRStats(calculatePRStats(prsResult, period));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [owner, repo, period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    commits,
    commitsData,
    locStats,
    prStats,
    doraMetrics,
    authorStats,
    loading,
    error,
    refresh: fetchData,
  };
}
