'use client';

import { RefreshCw, AlertCircle } from 'lucide-react';
import { useState } from 'react';

import { AuthorBreakdown } from '@/components/dashboard/AuthorBreakdown';
import { CommitChart } from '@/components/dashboard/CommitChart';
import { DORAMetrics } from '@/components/dashboard/DORAMetrics';
import { LOCStats } from '@/components/dashboard/LOCStats';
import { PeriodSelector } from '@/components/dashboard/PeriodSelector';
import { PRStats } from '@/components/dashboard/PRStats';
import { TokenUsage } from '@/components/dashboard/TokenUsage';
import { useGitHubData } from '@/hooks/useGitHubData';
import type { TimePeriod } from '@/lib/types';

/**
 * @description Página principal del dashboard de productividad.
 * Muestra todas las métricas del equipo incluyendo commits, líneas de código,
 * pull requests, métricas DORA y uso de tokens.
 *
 * @returns Componente React que renderiza el dashboard completo
 */
export default function DashboardPage(): React.ReactNode {
  const [period, setPeriod] = useState<TimePeriod>('7d');

  const {
    commitsData,
    locStats,
    prStats,
    doraMetrics,
    authorStats,
    loading,
    error,
    refresh,
  } = useGitHubData({
    owner: process.env.NEXT_PUBLIC_GITHUB_ORG || '',
    repo: process.env.NEXT_PUBLIC_GITHUB_REPOS?.split(',')[0] || '',
    period,
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Team Productivity Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your team&#39;s activity and performance
            </p>
          </div>

          <div className="flex items-center gap-4">
            <PeriodSelector period={period} onPeriodChange={setPeriod} />
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-300 mb-1">
                Error loading data
              </h3>
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        )}

        {/* Dashboard Content */}
        {!loading && !error && (
          <div className="space-y-6">
            {/* Team Metrics Section */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Team Metrics
              </h2>

              {/* DORA Metrics */}
              {doraMetrics && (
                <DORAMetrics metrics={doraMetrics} />
              )}

              {/* Commit Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <CommitChart data={commitsData} period="day" />
              </div>

              {/* LOC Stats */}
              {locStats && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Lines of Code
                  </h2>
                  <LOCStats stats={locStats} />
                </div>
              )}

              {/* PR Stats */}
              {prStats && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Pull Requests
                  </h2>
                  <PRStats stats={prStats} />
                </div>
              )}
            </div>

            {/* Individual Metrics Section */}
            {authorStats.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Individual Metrics
                </h2>
                <AuthorBreakdown authors={authorStats} />
              </div>
            )}

            {/* Token Usage */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <TokenUsage />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
