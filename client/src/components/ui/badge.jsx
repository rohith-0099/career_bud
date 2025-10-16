import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-colors overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-indigo-600 text-white [a&]:hover:bg-indigo-500",
        secondary:
          "border-transparent bg-neutral-200 text-neutral-900 [a&]:hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:[a&]:hover:bg-neutral-700",
        destructive:
          "border-transparent bg-red-600 text-white [a&]:hover:bg-red-500",
        outline:
          "text-neutral-900 border-neutral-300 [a&]:hover:bg-neutral-100 dark:text-neutral-200 dark:border-neutral-700 dark:[a&]:hover:bg-neutral-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
