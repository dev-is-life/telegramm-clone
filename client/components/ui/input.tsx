import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-gray-300 bg-white px-4 text-base text-gray-800 placeholder:text-gray-500",
          "focus:border-[#3390EC] focus:ring-1 focus:ring-[#3390EC] focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "dark:border-gray-700 dark:bg-transparent dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus:border-[#3390EC] dark:focus:ring-[#3390EC]/40",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
