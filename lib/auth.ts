import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { db } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Find user in database
          const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [credentials.email])

          const users = rows as any[]
          const user = users[0]

          if (!user) {
            return null
          }

          // Simple password comparison without bcrypt
          const passwordMatch = credentials.password === user.password

          if (!passwordMatch) {
            return null
          }

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        // For OAuth providers
        if (account.provider === "google") {
          try {
            // Check if user exists in database
            const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [user.email])

            const users = rows as any[]
            let dbUser = users[0]

            // If user doesn't exist, create a new one
            if (!dbUser && user.email) {
              const [result] = await db.query(
                "INSERT INTO users (name, email, role, created_at) VALUES (?, ?, 'user', NOW())",
                [user.name, user.email],
              )

              const insertResult = result as any

              // Get the newly created user
              const [newUserRows] = await db.query("SELECT * FROM users WHERE id = ?", [insertResult.insertId])

              const newUsers = newUserRows as any[]
              dbUser = newUsers[0]
            }

            if (dbUser) {
              token.id = dbUser.id.toString()
              token.role = dbUser.role
            }
          } catch (error) {
            console.error("Error in JWT callback:", error)
          }
        } else {
          // For credentials provider
          token.id = user.id
          token.role = user.role
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

