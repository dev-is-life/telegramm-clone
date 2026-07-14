"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { FaGithub, FaGoogle } from "react-icons/fa"

const Social = () => {
  const [isLoading, setIsLoading] = useState(false)

  const onSignIn = async (provider: string) => {
    setIsLoading(false)
    await signIn(provider, { callbackUrl: "/" })
  }
  return (
    <div className="grid grid-cols-2 w-full gap-1 max-md:px-2">
      <Button variant={"outline"} className="max-md:text-xs" disabled={isLoading} onClick={() => onSignIn("google")}>
        <span>Sign up with google</span>
        <FaGoogle />
      </Button>

      <Button variant={"secondary"} className="max-md:text-xs" disabled={isLoading} onClick={() => onSignIn("github")}>
        <span>Sign up with github</span>
        <FaGithub />
      </Button>
    </div>
  )
}

export default Social