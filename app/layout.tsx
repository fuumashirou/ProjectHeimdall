import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

/**
 * @description Configuración de fuentes y metadatos para la aplicación.
 * Utiliza la fuente Inter de Google Fonts para una tipografía limpia y moderna.
 *
 * @example
 * // El layout se aplica automáticamente a todas las páginas
 * ```
 */
const inter = Inter({ subsets: ["latin"] });

/**
 * @description Metadatos de la aplicación para SEO y visualización en navegador.
 */
export const metadata: Metadata = {
  title: "Heimdall - Team Productivity Dashboard",
  description: "Monitor your team's development activity and AI usage",
};

/**
 * @description Componente layout raíz de la aplicación.
 * Envuelve todas las páginas con la configuración de fuentes y estilos globales.
 *
 * @example
 * // Este layout se aplica a todas las rutas
 * ```
 *
 * @param children - Componentes hijos a renderizar
 * @returns Componente React con el layout de la aplicación
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
