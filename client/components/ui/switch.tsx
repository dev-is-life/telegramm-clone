"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-6 w-12 shrink-0 items-center rounded-full border transition-colors outline-none cursor-pointer",
        "bg-gray-200 border-gray-300 dark:bg-gray-700 dark:border-gray-600",
        "data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 dark:data-[state=checked]:bg-blue-400 dark:data-[state=checked]:border-blue-400",
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "block h-5 w-5 rounded-full bg-white shadow-md transform ring-0 transition-all duration-200 ease-in-out",
          "data-[state=unchecked]:translate-x-0 data-[state=unchecked]:bg-white data-[state=unchecked]:shadow-md",
          "data-[state=checked]:translate-x-6 data-[state=checked]:bg-white data-[state=checked]:shadow-lg"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }