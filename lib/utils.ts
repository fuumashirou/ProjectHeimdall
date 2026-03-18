import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * @description Combina clases de CSS de Tailwind de forma inteligente,
 * resolviendo conflictos y eliminando duplicados.
 *
 * @example
 * ```typescript
 * // Combina clases y resuelve conflictos
 * const className = cn('px-2 py-1', 'px-4'); // Resultado: 'py-1 px-4'
 *
 * // Condicionales
 * const activeClass = cn('base-class', isActive && 'active-class');
 * ```
 *
 * @param inputs - Clases de CSS para combinar
 * @returns String con las clases combinadas
 *
 * @see {@link https://clsx.com|clsx Documentation}
 * @see {@link https://github.com/dcastil/tailwind-merge|tailwind-merge Documentation}
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * @description Formatea una fecha ISO 8601 a un formato legible.
 *
 * @example
 * ```typescript
 * formatDate('2024-03-01T10:00:00Z'); // 'Mar 1, 2024'
 * formatDate('2024-03-01T10:00:00Z', 'short'); // '03/01/24'
 * ```
 *
 * @param isoDate - Fecha en formato ISO 8601
 * @param format - Formato deseado ('full' | 'short' | 'time')
 * @returns String con la fecha formateada
 *
 * @throws Error si la fecha proporcionada no es válida
 */
export function formatDate(
  isoDate: string,
  format: 'full' | 'short' | 'time' = 'full',
): string {
  const date = new Date(isoDate);

  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${isoDate}`);
  }

  switch (format) {
    case 'full':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    case 'short':
      return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit',
      });
    case 'time':
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    default:
      return date.toLocaleDateString();
  }
}

/**
 * @description Calcula la diferencia en días entre dos fechas.
 *
 * @example
 * ```typescript
 * getDaysDiff('2024-03-01', '2024-03-08'); // 7
 * getDaysDiff('2024-03-08', '2024-03-01'); // -7
 * ```
 *
 * @param startDate - Fecha de inicio en formato ISO 8601 o YYYY-MM-DD
 * @param endDate - Fecha de fin en formato ISO 8601 o YYYY-MM-DD
 * @returns Diferencia en días entre las dos fechas
 *
 * @throws Error si alguna de las fechas no es válida
 */
export function getDaysDiff(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error(`Invalid dates: ${startDate}, ${endDate}`);
  }

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * @description Obtiene la fecha de inicio para un período específico.
 *
 * @example
 * ```typescript
 * getStartDate('7d');  // Fecha de hace 7 días
 * getStartDate('30d'); // Fecha de hace 30 días
 * getStartDate('12m'); // Fecha de hace 12 meses
 * ```
 *
 * @param period - Período de tiempo ('7d' | '30d' | '90d' | '12m')
 * @returns Fecha de inicio en formato ISO 8601
 *
 * @throws Error si el período no es válido
 */
export function getStartDate(period: '7d' | '30d' | '90d' | '12m' = '7d'): string {
  const now = new Date();

  if (period === '12m') {
    const startDate = new Date(now);
    startDate.setMonth(startDate.getMonth() - 12);
    return startDate.toISOString();
  }

  const days = Number.parseInt(period, 10);

  if (Number.isNaN(days) || days <= 0) {
    throw new Error(`Invalid period: ${period}`);
  }

  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  return startDate.toISOString();
}

/**
 * @description Agrupa un array por una propiedad específica.
 *
 * @example
 * ```typescript
 * const data = [
 *   { date: '2024-03-01', value: 1 },
 *   { date: '2024-03-01', value: 2 },
 *   { date: '2024-03-02', value: 3 }
 * ];
 *
 * groupBy(data, 'date');
 * // { '2024-03-01': [{...}, {...}], '2024-03-02': [{...}] }
 * ```
 *
 * @param array - Array de objetos a agrupar
 * @param key - Propiedad por la cual agrupar
 * @returns Objeto con los elementos agrupados
 */
export function groupBy<T extends Record<string, unknown>>(
  array: T[],
  key: keyof T,
): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    (result[groupKey] = result[groupKey] || []).push(item);
    return result;
  }, {} as Record<string, T[]>);
}
