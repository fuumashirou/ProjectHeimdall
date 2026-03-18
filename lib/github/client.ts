import { Octokit } from 'octokit';

/**
 * @description Crea una instancia del cliente de GitHub API con autenticación.
 * Esta función inicializa el cliente Octokit con el token de GitHub proporcionado,
 * permitiendo realizar peticiones autenticadas a la API de GitHub.
 *
 * @example
 * ```typescript
 * // Crear cliente con token de GitHub
 * const client = createGitHubClient('ghp_xxxxxxxxxxxx');
 *
 * // Usar el cliente para obtener repos
 * const repos = await client.rest.repos.listForAuthenticatedUser();
 * ```
 *
 * @param token - Token de autenticación de GitHub (Personal Access Token)
 * @returns Instancia configurada de Octokit para interactuar con GitHub API
 *
 * @throws Error si el token es nulo o undefined
 * @throws Error si el formato del token es inválido
 *
 * @see {@link https://docs.github.com/en/authentication|GitHub Authentication Documentation}
 * @see {@link https://octokit.github.io/rest.js/|Octokit Documentation}
 */
export function createGitHubClient(token: string): Octokit {
  if (!token) {
    throw new Error('GitHub token is required');
  }

  if (typeof token !== 'string' || token.trim().length === 0) {
    throw new Error('Invalid GitHub token format');
  }

  return new Octokit({
    auth: token.trim(),
  });
}

/**
 * @description Obtiene el cliente de GitHub desde variables de entorno.
 * Esta función lee el token de la variable de entorno GITHUB_TOKEN y
 * crea una instancia del cliente de GitHub API.
 *
 * @example
 * ```typescript
 * // Obtener cliente desde variables de entorno
 * const client = getGitHubClientFromEnv();
 *
 * // Usar el cliente
 * const repos = await client.rest.repos.listForAuthenticatedUser();
 * ```
 *
 * @returns Instancia configurada de Octokit
 *
 * @throws Error si la variable de entorno GITHUB_TOKEN no está definida
 * @throws Error si el token en la variable de entorno es inválido
 *
 * @see {@link createGitHubClient}
 */
export function getGitHubClientFromEnv(): Octokit {
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN || process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is not set');
  }

  return createGitHubClient(token);
}
