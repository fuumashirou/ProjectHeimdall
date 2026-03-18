import type { Commit, Deployment, ChangeFailure, DORAMetrics, DORALevel } from '../types';

const MERGE_BRANCH_REGEX = /^Merge branch '(.+?)'/;
const HOTFIX_REGEX = /hotfix/i;
const FIX_REGEX = /\bfix\b/i;

/**
 * @description Clasifica commits de main en merge commits (deployments) y commits directos.
 *
 * @param commits - Array de commits del branch main
 * @returns Objeto con deployments y directCommits separados
 */
export function classifyCommits(commits: Commit[]): {
  deployments: Deployment[];
  directCommits: Commit[];
} {
  const deployments: Deployment[] = [];
  const directCommits: Commit[] = [];

  for (const commit of commits) {
    const match = commit.message.match(MERGE_BRANCH_REGEX);
    if (match) {
      deployments.push({
        sha: commit.sha,
        date: commit.date,
        message: commit.message,
        branchName: match[1],
      });
    } else {
      directCommits.push(commit);
    }
  }

  return { deployments, directCommits };
}

/**
 * @description Identifica hotfixes entre los commits directos a main.
 * - Alta confianza: mensaje contiene "hotfix"
 * - Confianza media: mensaje contiene "fix" (sin ser un merge)
 *
 * @param directCommits - Array de commits directos a main (no merge commits)
 * @returns Array de ChangeFailure con nivel de confianza
 */
export function identifyHotfixes(directCommits: Commit[]): ChangeFailure[] {
  const hotfixes: ChangeFailure[] = [];

  for (const commit of directCommits) {
    if (HOTFIX_REGEX.test(commit.message)) {
      hotfixes.push({
        sha: commit.sha,
        date: commit.date,
        message: commit.message,
        confidence: 'high',
      });
    } else if (FIX_REGEX.test(commit.message)) {
      hotfixes.push({
        sha: commit.sha,
        date: commit.date,
        message: commit.message,
        confidence: 'medium',
      });
    }
  }

  return hotfixes;
}

/**
 * @description Calcula la frecuencia de deployments en el período.
 *
 * @param deployments - Array de deployments detectados
 * @param periodDays - Número de días del período analizado
 * @returns Objeto con valor, unidad y clasificación DORA
 */
export function calculateDeploymentFrequency(
  deployments: Deployment[],
  periodDays: number,
): DORAMetrics['deploymentFrequency'] {
  const count = deployments.length;

  if (periodDays <= 0) {
    return { value: 0, unit: 'per_day', level: 'low' };
  }

  const perDay = count / periodDays;
  const perWeek = perDay * 7;
  const perMonth = perDay * 30;

  let unit: 'per_day' | 'per_week' | 'per_month';
  let value: number;

  if (perDay >= 1) {
    unit = 'per_day';
    value = Math.round(perDay * 10) / 10;
  } else if (perWeek >= 1) {
    unit = 'per_week';
    value = Math.round(perWeek * 10) / 10;
  } else {
    unit = 'per_month';
    value = Math.round(perMonth * 10) / 10;
  }

  let level: DORALevel;
  if (perDay >= 1) {
    level = 'elite';
  } else if (perWeek >= 1) {
    level = 'high';
  } else if (perMonth >= 1) {
    level = 'medium';
  } else {
    level = 'low';
  }

  return { value, unit, level };
}

/**
 * @description Calcula el lead time promedio para cambios.
 * Usa la API de comparación de GitHub para obtener los commits del branch
 * y calcular el tiempo desde el primer commit hasta el merge.
 *
 * @param deployments - Array de deployments con branchName
 * @param allCommits - Todos los commits del período para estimar lead time
 * @returns Objeto con valor, unidad y clasificación DORA
 */
export function calculateLeadTimeForChanges(
  deployments: Deployment[],
  allCommits: Commit[],
): DORAMetrics['leadTimeForChanges'] {
  if (deployments.length === 0) {
    return { value: 0, unit: 'hours', level: 'elite' };
  }

  const leadTimes: number[] = [];

  for (const deployment of deployments) {
    const mergeDate = new Date(deployment.date);

    // Find commits that happened before this merge and after the previous merge
    const deploymentIndex = allCommits.findIndex((c) => c.sha === deployment.sha);
    if (deploymentIndex === -1) continue;

    // Look for the earliest non-merge commit before this deployment
    // that isn't part of a previous deployment
    let earliestCommitDate: Date | null = null;

    for (let i = deploymentIndex + 1; i < allCommits.length; i++) {
      const commit = allCommits[i];
      // Stop if we hit another merge commit
      if (MERGE_BRANCH_REGEX.test(commit.message)) break;
      earliestCommitDate = new Date(commit.date);
    }

    if (earliestCommitDate) {
      const diffMs = mergeDate.getTime() - earliestCommitDate.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      if (diffHours > 0) {
        leadTimes.push(diffHours);
      }
    }
  }

  if (leadTimes.length === 0) {
    return { value: 0, unit: 'hours', level: 'elite' };
  }

  const avgHours = leadTimes.reduce((sum, lt) => sum + lt, 0) / leadTimes.length;

  let unit: 'hours' | 'days';
  let value: number;

  if (avgHours >= 24) {
    unit = 'days';
    value = Math.round((avgHours / 24) * 10) / 10;
  } else {
    unit = 'hours';
    value = Math.round(avgHours * 10) / 10;
  }

  let level: DORALevel;
  if (avgHours < 1) {
    level = 'elite';
  } else if (avgHours < 24) {
    level = 'high';
  } else if (avgHours < 168) {
    level = 'medium';
  } else {
    level = 'low';
  }

  return { value, unit, level };
}

/**
 * @description Calcula la tasa de fallos en cambios.
 * Proporción de hotfixes vs total de cambios (deployments + hotfixes).
 *
 * @param hotfixes - Array de hotfixes detectados
 * @param deployments - Array de deployments detectados
 * @returns Objeto con valor (porcentaje), unidad y clasificación DORA
 */
export function calculateChangeFailureRate(
  hotfixes: ChangeFailure[],
  deployments: Deployment[],
): DORAMetrics['changeFailureRate'] {
  const totalChanges = deployments.length + hotfixes.length;

  if (totalChanges === 0) {
    return { value: 0, unit: 'percent', level: 'elite' };
  }

  const rate = (hotfixes.length / totalChanges) * 100;
  const value = Math.round(rate * 10) / 10;

  let level: DORALevel;
  if (rate < 5) {
    level = 'elite';
  } else if (rate < 10) {
    level = 'high';
  } else if (rate < 15) {
    level = 'medium';
  } else {
    level = 'low';
  }

  return { value, unit: 'percent', level };
}

/**
 * @description Calcula el tiempo promedio de recuperación (MTTR).
 * Mide el tiempo entre un deployment (merge commit) y el hotfix posterior más cercano.
 *
 * @param deployments - Array de deployments ordenados por fecha (más reciente primero)
 * @param hotfixes - Array de hotfixes detectados
 * @returns Objeto con valor, unidad y clasificación DORA
 */
export function calculateMTTR(
  deployments: Deployment[],
  hotfixes: ChangeFailure[],
): DORAMetrics['mttr'] {
  if (hotfixes.length === 0 || deployments.length === 0) {
    return { value: 0, unit: 'hours', level: 'elite' };
  }

  const recoveryTimes: number[] = [];
  const sortedHotfixes = [...hotfixes].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const sortedDeployments = [...deployments].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  for (const hotfix of sortedHotfixes) {
    const hotfixDate = new Date(hotfix.date);

    // Find the most recent deployment before this hotfix
    let lastDeploymentBefore: Deployment | null = null;
    for (const deployment of sortedDeployments) {
      const deployDate = new Date(deployment.date);
      if (deployDate < hotfixDate) {
        lastDeploymentBefore = deployment;
      } else {
        break;
      }
    }

    if (lastDeploymentBefore) {
      const diffMs = hotfixDate.getTime() - new Date(lastDeploymentBefore.date).getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      if (diffHours > 0) {
        recoveryTimes.push(diffHours);
      }
    }
  }

  if (recoveryTimes.length === 0) {
    return { value: 0, unit: 'hours', level: 'elite' };
  }

  const avgHours = recoveryTimes.reduce((sum, rt) => sum + rt, 0) / recoveryTimes.length;

  let unit: 'hours' | 'days';
  let value: number;

  if (avgHours >= 24) {
    unit = 'days';
    value = Math.round((avgHours / 24) * 10) / 10;
  } else {
    unit = 'hours';
    value = Math.round(avgHours * 10) / 10;
  }

  let level: DORALevel;
  if (avgHours < 1) {
    level = 'elite';
  } else if (avgHours < 24) {
    level = 'high';
  } else if (avgHours < 168) {
    level = 'medium';
  } else {
    level = 'low';
  }

  return { value, unit, level };
}

/**
 * @description Calcula todas las métricas DORA a partir de los commits de main.
 *
 * @param commits - Array de commits del branch main (ordenados del más reciente al más antiguo)
 * @param periodDays - Número de días del período analizado
 * @returns Objeto DORAMetrics con las 4 métricas calculadas
 */
export function calculateDORAMetrics(
  commits: Commit[],
  periodDays: number,
): DORAMetrics {
  const { deployments, directCommits } = classifyCommits(commits);
  const hotfixes = identifyHotfixes(directCommits);

  return {
    deploymentFrequency: calculateDeploymentFrequency(deployments, periodDays),
    leadTimeForChanges: calculateLeadTimeForChanges(deployments, commits),
    changeFailureRate: calculateChangeFailureRate(hotfixes, deployments),
    mttr: calculateMTTR(deployments, hotfixes),
  };
}
