import { supabase } from "./supabase"
import { db } from "./db"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // First check if user exists in Supabase auth
        const { data: authUser, error: authError } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        })

        if (authError || !authUser.user) {
          // Fall back to checking our users table for compatibility
          const user = await db.getUserByEmail(credentials.email)

          if (!user) {
            return null
          }

          const passwordMatch = await compare(credentials.password, user.password)

          if (!passwordMatch) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        }

        // Get user profile from our database
        const user = await db.getUserByEmail(credentials.email)

        if (!user) {
          // Create user in our database if they don't exist
          const newUser = await db.createUser({
            id: authUser.user.id,
            email: authUser.user.email,
            name: authUser.user.user_metadata.name || authUser.user.email?.split("@")[0],
            role: "user",
          })

          return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.role = token.role as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
  },
}

