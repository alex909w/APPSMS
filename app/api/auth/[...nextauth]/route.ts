import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { executeQuery } from "@/lib/db"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    // Puedes agregar más proveedores aquí si necesitas
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const email = user.email
          const name = user.name || profile?.name || email?.split('@')[0]
          
          if (!email) return false

          // 1. Verificar si el usuario ya existe
          const existingUser = await executeQuery<any[]>(
            "SELECT * FROM users WHERE email = $1 LIMIT 1",
            [email]
          )

          // 2. Si no existe, crear nuevo usuario
          if (existingUser.length === 0) {
            await executeQuery(
              `INSERT INTO users (name, email, provider, provider_id, email_verified) 
               VALUES ($1, $2, $3, $4, $5)`,
              [name, email, 'google', user.id, true]
            )
          } else {
            // 3. Si existe, actualizar información
            await executeQuery(
              `UPDATE users SET 
                name = $1, 
                provider = $2, 
                provider_id = $3, 
                email_verified = $4 
               WHERE email = $5`,
              [name, 'google', user.id, true, email]
            )
          }
          
          return true
        } catch (error) {
          console.error("Error al guardar usuario de Google:", error)
          return false
        }
      }
      return true
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
      }
      return session
    }
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }