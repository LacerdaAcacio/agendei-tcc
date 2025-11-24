import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "text-3xl font-bold text-gray-900 dark:text-white",
      h2: "text-2xl font-bold text-gray-900 dark:text-white",
      h3: "text-xl font-semibold text-gray-900 dark:text-white",
      h4: "text-lg font-semibold text-gray-900 dark:text-white",
      body: "text-base text-gray-700 dark:text-slate-300",
      small: "text-sm text-gray-600 dark:text-slate-400",
      muted: "text-sm text-gray-500 dark:text-slate-400",
      lead: "text-lg text-gray-700 dark:text-slate-300",
    },
  },
  defaultVariants: {
    variant: "body",
  },
})

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div"
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, as, ...props }, ref) => {
    const Comp = as || getDefaultElement(variant)
    return (
      <Comp
        className={cn(typographyVariants({ variant, className }))}
        ref={ref as any}
        {...props}
      />
    )
  }
)
Typography.displayName = "Typography"

function getDefaultElement(variant: TypographyProps["variant"]): string {
  switch (variant) {
    case "h1":
      return "h1"
    case "h2":
      return "h2"
    case "h3":
      return "h3"
    case "h4":
      return "h4"
    case "small":
    case "muted":
      return "span"
    default:
      return "p"
  }
}

export { Typography, typographyVariants }
