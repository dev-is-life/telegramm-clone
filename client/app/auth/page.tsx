import { FaTelegram } from "react-icons/fa"
import StateAuth from "./components/state"
import Social from "./components/social"
import { ModeToggle } from "@/components/shared/mode-toogle"
import { getServerSession } from "next-auth"
import { nextAuth } from "@/lib/auth.options"
import { redirect } from "next/navigation"

const Page = async () => {
  const session = await getServerSession(nextAuth)

  if(session){
    redirect("/")
  }

  return (
    <div className="container max-w-md mx-auto w-full h-screen flex justify-center items-center flex-col space-y-4">
        <FaTelegram className="text-blue-500" size={120} />

        <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold">Telegramm</h1>
            <ModeToggle />
        </div>
        <StateAuth />
        <Social />
    </div>
  )
}

export default Page