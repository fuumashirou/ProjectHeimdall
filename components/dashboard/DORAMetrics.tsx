'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DORA_INTERPRETATIONS } from '@/lib/dora-interpretations';
import type { DORAMetrics as DORAMetricsType, DORALevel } from '@/lib/types';

/**
 * @description Componente que muestra las 4 métricas DORA con clasificación visual.
 *
 * @param metrics - Objeto con las 4 métricas DORA calculadas
 */
type DORAMetricsProps = {
  metrics: DORAMetricsType;
};

const LEVEL_COLORS: Record<DORALevel, { bg: string; text: string; label: string }> = {
  elite: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Elite' },
  high: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', label: 'High' },
  medium: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', label: 'Medium' },
  low: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', label: 'Low' },
};

const UNIT_LABELS: Record<string, string> = {
  per_day: '/día',
  per_week: '/semana',
  per_month: '/mes',
  hours: 'horas',
  days: 'días',
  percent: '%',
};

const METRIC_DESCRIPTIONS: Record<string, string> = {
  deploymentFrequency: 'Frecuencia con la que se hacen merge de branches a main',
  leadTimeForChanges: 'Tiempo promedio desde el primer commit de un branch hasta su merge',
  changeFailureRate: 'Porcentaje de cambios que requieren hotfix',
  mttr: 'Tiempo promedio de recuperación después de un fallo',
};

/**
 * @description Renderiza una badge con el nivel DORA
 */
function LevelBadge({ level }: { level: DORALevel }) {
  const colors = LEVEL_COLORS[level];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
      {colors.label}
    </span>
  );
}

/**
 * @description Formatea el valor de una métrica con su unidad
 */
function formatMetricValue(value: number, unit: string): string {
  if (unit === 'percent') {
    return `${value}%`;
  }
  return `${value} ${UNIT_LABELS[unit] || unit}`;
}

type MetricKey = 'deploymentFrequency' | 'leadTimeForChanges' | 'changeFailureRate' | 'mttr';

export function DORAMetrics({ metrics }: DORAMetricsProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCard = (key: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const metricCards = [
    {
      key: 'deploymentFrequency' as MetricKey,
      title: 'Deployment Frequency',
      value: metrics.deploymentFrequency.value,
      unit: metrics.deploymentFrequency.unit,
      level: metrics.deploymentFrequency.level,
    },
    {
      key: 'leadTimeForChanges' as MetricKey,
      title: 'Lead Time for Changes',
      value: metrics.leadTimeForChanges.value,
      unit: metrics.leadTimeForChanges.unit,
      level: metrics.leadTimeForChanges.level,
    },
    {
      key: 'changeFailureRate' as MetricKey,
      title: 'Change Failure Rate',
      value: metrics.changeFailureRate.value,
      unit: metrics.changeFailureRate.unit,
      level: metrics.changeFailureRate.level,
    },
    {
      key: 'mttr' as MetricKey,
      title: 'MTTR',
      value: metrics.mttr.value,
      unit: metrics.mttr.unit,
      level: metrics.mttr.level,
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        DORA Metrics
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric) => {
          const isExpanded = expandedCards.has(metric.key);
          const interpretation = DORA_INTERPRETATIONS[metric.key][metric.level];

          return (
            <Card key={metric.key}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {metric.title}
                  </CardTitle>
                  <LevelBadge level={metric.level} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatMetricValue(metric.value, metric.unit)}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {METRIC_DESCRIPTIONS[metric.key]}
                </p>

                <button
                  type="button"
                  onClick={() => toggleCard(metric.key)}
                  className="flex items-center gap-1 mt-3 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                  {isExpanded ? 'Hide details' : 'View details'}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    isExpanded ? 'max-h-60 opacity-100 mt-3' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="rounded-md bg-gray-50 dark:bg-gray-800/50 p-3 space-y-2">
                    <div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Interpretation</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{interpretation.interpretation}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Recommendation</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{interpretation.recommendation}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
