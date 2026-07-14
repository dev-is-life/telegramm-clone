import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md cursor-pointer font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#3390EC] text-white hover:bg-[#2b7fd3] dark:bg-[#2b7fd3] dark:hover:bg-[#3390EC] dark:text-white",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700",
        outline:
          "border border-input bg-white hover:bg-gray-300 hover:border-transparent text-gray-900 dark:bg-transparent dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:border-transparent",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
        ghost:
          "hover:bg-gray-100 text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800",
        link:
          "text-[#3390EC] underline-offset-4 hover:underline dark:text-[#60a5fa] dark:hover:text-[#93c5fd]",
      },
      size: {
        default:
          "h-10 px-4 text-sm md:h-11 md:px-6 md:text-base lg:h-12 lg:px-8 lg:text-sm",
        sm: "h-9 rounded-lg px-3 text-xs md:h-10 md:px-4 md:text-sm",
        lg: "h-11 rounded-xl px-6 text-base md:h-12 md:px-8 md:text-lg",
        icon: "h-9 w-9 md:h-11 md:w-11 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

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