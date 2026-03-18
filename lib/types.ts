/**
 * @description Tipos y interfaces para el dashboard de productividad.
 * Este archivo contiene todas las definiciones de tipos utilizadas en la aplicación
 * para garantizar tipado estático y evitar errores en tiempo de desarrollo.
 */

/**
 * @description Representa un commit individual de GitHub con su información básica
 * y estadísticas de líneas de código modificadas.
 *
 * @example
 * ```typescript
 * const commit: Commit = {
 *   sha: 'abc123',
 *   message: 'Add new feature',
 *   author: 'john-doe',
 *   date: '2024-03-01T10:00:00Z',
 *   stats: { additions: 100, deletions: 50 }
 * };
 * ```
 */
type Commit = {
  /**
   * @description Hash SHA del commit que lo identifica de forma única
   */
  sha: string;

  /**
   * @description Mensaje del commit que describe los cambios realizados
   */
  message: string;

  /**
   * @description Nombre de usuario del autor del commit en GitHub
   */
  author: string;

  /**
   * @description Fecha del commit en formato ISO 8601
   */
  date: string;

  /**
   * @description Estadísticas de líneas de código modificadas en el commit
   */
  stats: {
    /**
     * @description Número de líneas de código agregadas en el commit
     */
    additions: number;

    /**
     * @description Número de líneas de código eliminadas en el commit
     */
    deletions: number;
  };
};

/**
 * @description Representa una pull request con su estado y métricas relevantes
 *
 * @example
 * ```typescript
 * const pullRequest: PullRequest = {
 *   id: 1,
 *   number: 42,
 *   title: 'Add new feature',
 *   state: 'open',
 *   createdAt: '2024-03-01T10:00:00Z',
 *   mergedAt: null,
 *   author: 'john-doe'
 * };
 * ```
 */
type PullRequest = {
  /**
   * @description ID único de la pull request
   */
  id: number;

  /**
   * @description Número de la pull request en el repositorio
   */
  number: number;

  /**
   * @description Título descriptivo de la pull request
   */
  title: string;

  /**
   * @description Estado actual de la pull request
   */
  state: 'open' | 'closed' | 'merged';

  /**
   * @description Fecha de creación de la pull request en formato ISO 8601
   */
  createdAt: string;

  /**
   * @description Fecha de merge de la pull request o null si no está mergeada
   */
  mergedAt: string | null;

  /**
   * @description Nombre de usuario del autor de la pull request
   */
  author: string;
};

/**
 * @description Representa los datos de commits agrupados por fecha
 *
 * @example
 * ```typescript
 * const commitData: CommitDataPoint[] = [
 *   { date: '2024-03-01', count: 5 },
 *   { date: '2024-03-02', count: 8 }
 * ];
 * ```
 */
type CommitDataPoint = {
  /**
   * @description Fecha en formato ISO 8601
   */
  date: string;

  /**
   * @description Número de commits realizados en esa fecha
   */
  count: number;
};

/**
 * @description Representa las estadísticas de líneas de código para un período
 *
 * @example
 * ```typescript
 * const locStats: LOCStats = {
 *   additions: 1500,
 *   deletions: 750,
 *   net: 750,
 *   period: '7d'
 * };
 * ```
 */
type LOCStats = {
  /**
   * @description Total de líneas de código agregadas en el período
   */
  additions: number;

  /**
   * @description Total de líneas de código eliminadas en el período
   */
  deletions: number;

  /**
   * @description Diferencia neta entre adiciones y eliminaciones
   */
  net: number;

  /**
   * @description Período de tiempo de las estadísticas
   */
  period: '7d' | '30d' | '90d' | '12m';
};

/**
 * @description Representa las estadísticas de pull requests para un período
 *
 * @example
 * ```typescript
 * const prStats: PRStats = {
 *   open: 5,
 *   closed: 20,
 *   merged: 18,
 *   avgTimeToMerge: 2.5,
 *   period: '7d'
 * };
 * ```
 */
type PRStats = {
  /**
   * @description Número de pull requests abiertas actualmente
   */
  open: number;

  /**
   * @description Número de pull requests cerradas en el período
   */
  closed: number;

  /**
   * @description Número de pull requests mergeadas en el período
   */
  merged: number;

  /**
   * @description Tiempo promedio en días para hacer merge de una PR
   */
  avgTimeToMerge: number;

  /**
   * @description Período de tiempo de las estadísticas
   */
  period: '7d' | '30d' | '90d' | '12m';
};

/**
 * @description Representa los datos de uso de tokens de Cursor
 */
type CursorUsageData = {
  /**
   * @description ID único del usuario en Cursor
   */
  userId: string;

  /**
   * @description Nombre de usuario
   */
  userName: string;

  /**
   * @description Número total de tokens utilizados en el período
   */
  tokensUsed: number;

  /**
   * @description Período de tiempo de los datos
   */
  period: '7d' | '30d' | '90d' | '12m';
};

/**
 * @description Período de tiempo para filtrar los datos del dashboard
 *
 * @example
 * ```typescript
 * const period: TimePeriod = '7d'; // Últimos 7 días
 * ```
 */
type TimePeriod = '7d' | '30d' | '90d' | '12m';

/**
 * @description Opciones de configuración para el dashboard
 *
 * @example
 * ```typescript
 * const config: DashboardConfig = {
 *   timePeriod: '7d',
 *   repos: ['repo1', 'repo2'],
 *   showCursor: true
 * };
 * ```
 */
type DashboardConfig = {
  /**
   * @description Período de tiempo seleccionado
   */
  timePeriod: TimePeriod;

  /**
   * @description Lista de repositorios a monitorear
   */
  repos: string[];

  /**
   * @description Booleano para mostrar u ocultar datos de Cursor
   */
  showCursor: boolean;
};

/**
 * @description Nivel de clasificación DORA para cada métrica
 */
type DORALevel = 'elite' | 'high' | 'medium' | 'low';

/**
 * @description Representa un deployment (merge commit a main)
 *
 * @example
 * ```typescript
 * const deployment: Deployment = {
 *   sha: 'abc123',
 *   date: '2024-03-01T10:00:00Z',
 *   message: "Merge branch 'feature/new-login'",
 *   branchName: 'feature/new-login'
 * };
 * ```
 */
type Deployment = {
  /** @description Hash SHA del merge commit */
  sha: string;
  /** @description Fecha del merge en formato ISO 8601 */
  date: string;
  /** @description Mensaje del merge commit */
  message: string;
  /** @description Nombre del branch mergeado, extraído del mensaje */
  branchName: string;
};

/**
 * @description Representa un cambio que causó un fallo (hotfix o commit directo a main)
 *
 * @example
 * ```typescript
 * const failure: ChangeFailure = {
 *   sha: 'def456',
 *   date: '2024-03-02T14:00:00Z',
 *   message: 'hotfix: fix login redirect',
 *   confidence: 'high'
 * };
 * ```
 */
type ChangeFailure = {
  /** @description Hash SHA del commit */
  sha: string;
  /** @description Fecha del commit en formato ISO 8601 */
  date: string;
  /** @description Mensaje del commit */
  message: string;
  /** @description Nivel de confianza: 'high' si contiene "hotfix", 'medium' si contiene "fix" */
  confidence: 'high' | 'medium';
};

/**
 * @description Representa las 4 métricas DORA con sus valores y clasificaciones
 *
 * @example
 * ```typescript
 * const dora: DORAMetrics = {
 *   deploymentFrequency: { value: 3.5, unit: 'per_day', level: 'elite' },
 *   leadTimeForChanges: { value: 4.2, unit: 'hours', level: 'high' },
 *   changeFailureRate: { value: 8, unit: 'percent', level: 'high' },
 *   mttr: { value: 2.1, unit: 'hours', level: 'high' }
 * };
 * ```
 */
type DORAMetrics = {
  /** @description Frecuencia de deployments en el período */
  deploymentFrequency: {
    value: number;
    unit: 'per_day' | 'per_week' | 'per_month';
    level: DORALevel;
  };
  /** @description Tiempo promedio desde primer commit hasta merge */
  leadTimeForChanges: {
    value: number;
    unit: 'hours' | 'days';
    level: DORALevel;
  };
  /** @description Porcentaje de cambios que causan fallos */
  changeFailureRate: {
    value: number;
    unit: 'percent';
    level: DORALevel;
  };
  /** @description Tiempo promedio de recuperación tras un fallo */
  mttr: {
    value: number;
    unit: 'hours' | 'days';
    level: DORALevel;
  };
};

/**
 * @description Estadísticas de actividad por autor individual
 */
type AuthorStats = {
  /** @description Nombre de usuario del autor */
  author: string;
  /** @description Número total de commits del autor */
  commits: number;
  /** @description Total de líneas agregadas */
  additions: number;
  /** @description Total de líneas eliminadas */
  deletions: number;
};

export type {
  Commit,
  PullRequest,
  CommitDataPoint,
  LOCStats,
  PRStats,
  CursorUsageData,
  TimePeriod,
  DashboardConfig,
  DORALevel,
  Deployment,
  ChangeFailure,
  DORAMetrics,
  AuthorStats,
};
