# Etapa 9: Corregir Período 1y → 12 Meses

## Objetivo
Cambiar el período "1 año" (365 días fijos) a "12 meses" (12 meses calendario reales) para mayor precisión.

## Archivos modificados
- `lib/types.ts` — `'1y'` → `'12m'` en `TimePeriod` y todos los tipos que lo referencian
- `lib/utils.ts` — `getStartDate()`: case `'12m'` usa `setMonth(getMonth() - 12)` en vez de `setFullYear`
- `hooks/useGitHubData.ts` — `PERIOD_DAYS`: `'12m': 365` (aproximación aceptable para DORA)
- `components/dashboard/PeriodSelector.tsx` — Label "12 meses", warning de carga lenta actualizado
- `lib/github/stats.ts` — Referencias `'1y'` → `'12m'`
- `lib/github/pull-requests.ts` — Referencias `'1y'` → `'12m'`

## Decisiones técnicas
- Se usa `setMonth(getMonth() - 12)` para calcular 12 meses calendario reales
- `PERIOD_DAYS` mantiene 365 como aproximación para el cálculo de frecuencia DORA
- Se actualizaron JSDoc comments para reflejar el nuevo valor

## Estado
Completada
