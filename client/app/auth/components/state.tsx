"use client"

import { useAuth } from "@/hooks/use-auth"
import SignIn from "./sign-in"
import Verify from "./verify"

const StateAuth = () => {
  const { step } = useAuth()

  return (
    <div>
      {step === "login" && <SignIn />} 
      {step === "verify" && <Verify />} 
    </div>
  )
}

export default StateAuth