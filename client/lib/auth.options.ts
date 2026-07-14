import { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { connectToDatabase } from "./mongoose"
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import User from "@/models/user.model"

export const nextAuth: NextAuthOptions = {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {email: { label: "Email", type: "email" }},
            async authorize(credentials) {
                await connectToDatabase()
                const user = await User.findOne({ email: credentials?.email })
                return user
            }
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_SECRET!
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!
        })
    ],
    callbacks: {
        async session({ session }){
            await connectToDatabase()
            const isExistUser = await User.findOne({ email: session.user?.email })
            if(!isExistUser){
                const user = await User.create({ 
                    email: session.user?.email,
                    isVerified: true,
                    avatar: session.user?.image
                })
                session.currentUser = user
                return session
            }
            session.currentUser = isExistUser
            return session
        }
    },
    session: { strategy: "jwt" },
    jwt: { secret: process.env.NEXT_PUBLIC_AUTH_SECRET },
    secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
    pages: { signIn: "/auth", signOut: "/auth" }
} 