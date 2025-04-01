import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { executeQuery } from "@/lib/db"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const email = user.email
          const name = user.name || profile?.name || email?.split('@')[0]
          
          if (!email) {
            throw new Error("No se pudo obtener el email de Google")
          }

          // Verificar y actualizar usuario
          const result = await executeQuery<any>(
            `INSERT INTO users (name, email, provider, provider_id, email_verified) 
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (email) 
             DO UPDATE SET 
               name = EXCLUDED.name,
               provider = EXCLUDED.provider,
               provider_id = EXCLUDED.provider_id,
               email_verified = EXCLUDED.email_verified
             RETURNING *`,
            [name, email, 'google', user.id, true]
          )

          if (!result || result.length === 0) {
            throw new Error("Error al guardar usuario en la base de datos")
          }

          return true
        } catch (error) {
          console.error("Error en el proceso de autenticación:", error)
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