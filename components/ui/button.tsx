import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * @description Variantes de estilos para el componente Button.
 * Define las diferentes variaciones visuales del botón según su tipo y tamaño.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * @description Interfaz para las props del componente Button.
 * Extiende las props nativas de botón y añade variantes de estilo.
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

/**
 * @description Componente Button reutilizable con múltiples variantes.
 * Ofrece diferentes estilos y tamaños para adaptarse a diversos casos de uso.
 *
 * @example
 * ```typescript
 * // Botón primario por defecto
 * <Button>Click me</Button>
 *
 * // Botón destructivo
 * <Button variant="destructive">Delete</Button>
 *
 * // Botón outline pequeño
 * <Button variant="outline" size="sm">Cancel</Button>
 *
 * // Como un Link
 * <Button asChild variant="link">
 *   <a href="/docs">Documentation</a>
 * </Button>
 * ```
 *
 * @param className - Clases CSS adicionales
 * @param variant - Variante de estilo del botón
 * @param size - Tamaño del botón
 * @param asChild - Si es true, renderiza el elemento hijo
 * @returns Componente React que renderiza un botón estilizado
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
