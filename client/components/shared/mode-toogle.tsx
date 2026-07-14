"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme()

  return resolvedTheme === "dark" ? 
    <Button variant={"ghost"} size={"icon"} onClick={() => setTheme("light")}>
        <Sun />
    </Button> :
    <Button variant={"ghost"} size={"icon"} onClick={() => setTheme("dark")}>
        <Moon />
    </Button>
}
