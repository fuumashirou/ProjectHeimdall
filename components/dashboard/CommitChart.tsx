'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts';

import type { CommitDataPoint } from '@/lib/types';

/**
 * @description Componente que muestra un gráfico de barras con la distribución de commits
 * por día. El gráfico es interactivo y permite filtrar los datos por período de tiempo.
 * Utiliza Recharts para la renderización y soporta temas claros y oscuros.
 *
 * @example
 * ```typescript
 * // Uso básico
 * <CommitChart
 *   data={commitsData}
 *   period="week"
 *   onPeriodChange={(newPeriod) => console.log(newPeriod)}
 * />
 *
 * // Uso con tema oscuro
 * <CommitChart
 *   data={commitsData}
 *   period="month"
 *   theme="dark"
 *   showLegend={true}
 * />
 * ```
 *
 * @param data - Array de objetos con la información de commits por fecha
 * @param data[].date - Fecha del commit en formato ISO 8601
 * @param data[].count - Número de commits en esa fecha
 * @param period - Período de visualización ('day' | 'week' | 'month')
 * @param onPeriodChange - Callback que se ejecuta cuando cambia el período seleccionado
 * @param theme - Tema del gráfico ('light' | 'dark')
 * @param showLegend - Booleano para mostrar u ocultar la leyenda del gráfico
 *
 * @returns Componente React que renderiza un gráfico de barras interactivo
 *
 * @see {@link https://recharts.org/|Recharts Documentation}
 */
type CommitChartProps = {
  data: CommitDataPoint[];
  period: 'day' | 'week' | 'month';
  onPeriodChange?: (period: 'day' | 'week' | 'month') => void;
  theme?: 'light' | 'dark';
  showLegend?: boolean;
};

/**
 * @description Componente personalizado de tooltip para el gráfico de commits
 */
function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>): React.ReactNode {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
          {label}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Commits:{' '}
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {payload[0].value}
          </span>
        </p>
      </div>
    );
  }

  return null;
}

export function CommitChart({
  data,
  period,
  onPeriodChange,
  theme = 'light',
  showLegend = false,
}: CommitChartProps) {
  const isDark = theme === 'dark';

  return (
    <div className="w-full h-96">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Commits Activity
        </h3>
        {onPeriodChange && (
          <div className="flex gap-2">
            {(['day', 'week', 'month'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onPeriodChange(p)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  period === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
          <XAxis
            dataKey="date"
            stroke={isDark ? '#9ca3af' : '#6b7280'}
            fontSize={12}
          />
          <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend
              wrapperStyle={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280' }}
            />
          )}
          <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
