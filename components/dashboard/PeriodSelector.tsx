'use client';

import type { TimePeriod } from '@/lib/types';

/**
 * @description Selector global de período de tiempo para el dashboard.
 * Controla el rango de datos de todos los componentes.
 *
 * @param period - Período actualmente seleccionado
 * @param onPeriodChange - Callback cuando el usuario cambia el período
 */
type PeriodSelectorProps = {
  period: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
};

const PERIODS: { value: TimePeriod; label: string }[] = [
  { value: '7d', label: '7 días' },
  { value: '30d', label: '30 días' },
  { value: '90d', label: '90 días' },
  { value: '12m', label: '12 meses' },
];

export function PeriodSelector({ period, onPeriodChange }: PeriodSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      {PERIODS.map((p) => (
        <button
          key={p.value}
          type="button"
          onClick={() => onPeriodChange(p.value)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            period === p.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {p.label}
        </button>
      ))}
      {period === '12m' && (
        <span className="text-xs text-amber-600 dark:text-amber-400 ml-2">
          Puede tardar más en cargar
        </span>
      )}
    </div>
  );
}
