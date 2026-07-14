import { nextAuth } from "@/lib/auth.options"
import NextAuth from "next-auth"

const handler = NextAuth(nextAuth)
export { handler as GET, handler as POST }