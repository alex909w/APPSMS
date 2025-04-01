import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { executeQuery } from "@/lib/db"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "tu@email.com" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("Credenciales incompletas")
          throw new Error("Por favor ingrese email y contraseña")
        }

        try {
          // Buscar usuario en la base de datos
          const users = await executeQuery<any[]>(
            "SELECT id, name, email, password, role FROM users WHERE email = $1", 
            [credentials.email]
          )

          if (!users || users.length === 0) {
            console.error("Usuario no encontrado:", credentials.email)
            throw new Error("Credenciales inválidas")
          }

          const user = users[0]
          
          // Comparación directa de contraseñas (SOLO PARA DESARROLLO)
          if (credentials.password !== user.password) {
            console.error("Contraseña incorrecta para:", credentials.email)
            throw new Error("Credenciales inválidas")
          }

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role || "user"
          }
        } catch (error) {
          console.error("Error en autenticación:", error)
          throw new Error("Error al iniciar sesión. Por favor intente nuevamente.")
        }
      }
    })
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const email = user.email
          const name = user.name || profile?.name || email?.split("@")[0]

          if (!email) {
            console.error("Email no disponible en cuenta Google")
            throw new Error("No se pudo obtener el email de Google")
          }

          // Verificar/crear usuario en la base de datos
          const result = await executeQuery<any[]>(`
            INSERT INTO users (name, email, provider, provider_id, email_verified, role)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (email) DO UPDATE SET
              name = EXCLUDED.name,
              provider = EXCLUDED.provider,
              provider_id = EXCLUDED.provider_id,
              email_verified = EXCLUDED.email_verified,
              updated_at = CURRENT_TIMESTAMP
            RETURNING *
          `, [
            name, 
            email,
            "google",
            user.id,
            true,
            "user"
          ])

          if (!result || result.length === 0) {
            console.error("Error al guardar usuario de Google")
            throw new Error("Error al registrar usuario")
          }
        } catch (error) {
          console.error("Error en signIn callback (Google):", error)
          return false
        }
      }
      return true
    },

    async jwt({ token, user, account }) {
      if (account && user) {
        token.id = user.id
        token.email = user.email
        token.role = user.role || "user"
      }

      if (token.email) {
        try {
          const users = await executeQuery<any[]>(
            "SELECT id, name, email, role FROM users WHERE email = $1", 
            [token.email]
          )
          
          if (users && users.length > 0) {
            const dbUser = users[0]
            token.id = dbUser.id.toString()
            token.name = dbUser.name
            token.role = dbUser.role || "user"
          }
        } catch (error) {
          console.error("Error al actualizar JWT desde BD:", error)
        }
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.role = token.role as string
      }
      return session
    }
  },

  pages: {
    signIn: "/login",
    error: "/auth/error"
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60 // 1 día (reducido por seguridad)
  },

  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }