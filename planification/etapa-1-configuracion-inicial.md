# ETAPA 1: Configuración Inicial ✅

## Objetivo
Crear la base del proyecto Next.js con todas las dependencias y configuraciones necesarias para el desarrollo del dashboard de productividad.

## Archivos Involucrados
```
package.json              → Dependencias y scripts del proyecto
tsconfig.json             → Configuración de TypeScript
next.config.js            → Configuración de Next.js
tailwind.config.ts        → Configuración de Tailwind CSS
postcss.config.js         → Configuración de PostCSS
eslint.config.mjs         → Configuración de ESLint
app/globals.css           → Estilos globales
app/layout.tsx            → Layout principal de la aplicación
```

## Tareas
- [x] Inicializar proyecto Next.js 15 con App Router y TypeScript
- [x] Configurar Tailwind CSS con tema personalizado (dark mode)
- [x] Instalar dependencias:
  - Octokit (GitHub API SDK)
  - Recharts (gráficos)
  - shadcn/ui (componentes UI)
- [x] Configurar ESLint con reglas estrictas:
  - JSDoc obligatorio
  - Límite de complejidad ciclomática
  - Orden de imports
- [x] Configurar variables de entorno:
  - `GITHUB_TOKEN`: Token de acceso a GitHub API
  - `GITHUB_ORG`: Organización de GitHub
  - `GITHUB_REPOS`: Lista de repositorios (separados por coma)
- [x] Configurar scripts en package.json:
  - `dev`, `build`, `start`
  - `lint`, `lint:fix`
  - `type-check`

## Notas
- El proyecto usa Next.js 15 con App Router (no Pages Router)
- El tema oscuro está habilitado por defecto via Tailwind
- Las variables de entorno se leen desde `.env.local` (no incluido en git)
