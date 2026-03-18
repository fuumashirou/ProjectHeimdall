import { AlertCircle, Zap } from 'lucide-react';

/**
 * @description Componente placeholder para la visualización de uso de tokens de Cursor.
 * Muestra un mensaje informativo indicando que la funcionalidad está en desarrollo
 * y prepara la estructura para futura implementación de métricas de tokens.
 *
 * @example
 * ```typescript
 * <TokenUsage />
 * ```
 *
 * @returns Componente React que renderiza un placeholder con mensaje "Coming Soon"
 */
export function TokenUsage(): React.ReactNode {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-full">
          <AlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full">
          <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Cursor Token Usage
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            Track AI token usage across your team. Monitor costs and optimize AI-assisted
            development.
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Coming Soon
          </span>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-500 max-w-md">
          We&apos;re working on integrating with Cursor API to provide detailed token usage
          analytics.
        </p>
      </div>
    </div>
  );
}
