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
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Find user in database
          const users = await executeQuery<any[]>("SELECT * FROM users WHERE email = $1", [credentials.email])

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
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const email = user.email
          const name = user.name || profile?.name || email?.split("@")[0]

          if (!email) {
            console.error("No se pudo obtener el email de Google")
            return false
          }

          // Verificar si la tabla users tiene las columnas necesarias
          try {
            // Intentar insertar o actualizar el usuario
            const result = await executeQuery<any[]>(
              `INSERT INTO users (name, email, provider, provider_id, email_verified) 
               VALUES ($1, $2, $3, $4, $5)
               ON CONFLICT (email) 
               DO UPDATE SET 
                 name = EXCLUDED.name,
                 provider = EXCLUDED.provider,
                 provider_id = EXCLUDED.provider_id,
                 email_verified = EXCLUDED.email_verified
               RETURNING *`,
              [name, email, "google", user.id, true],
            )

            if (!result || result.length === 0) {
              // Si falla, intentar con un esquema más simple
              const simpleResult = await executeQuery<any[]>(
                `INSERT INTO users (name, email) 
                 VALUES ($1, $2)
                 ON CONFLICT (email) 
                 DO UPDATE SET name = EXCLUDED.name
                 RETURNING *`,
                [name, email],
              )

              if (!simpleResult || simpleResult.length === 0) {
                throw new Error("Error al guardar usuario en la base de datos")
              }
            }
          } catch (error) {
            console.error("Error al guardar usuario:", error)

            // Verificar si el usuario ya existe (puede ser que falle el ON CONFLICT)
            const existingUser = await executeQuery<any[]>("SELECT * FROM users WHERE email = $1", [email])

            if (!existingUser || existingUser.length === 0) {
              // Si no existe, intentar crear con campos mínimos
              await executeQuery<any[]>("INSERT INTO users (name, email) VALUES ($1, $2)", [name, email])
            }
          }

          return true
        } catch (error) {
          console.error("Error en el proceso de autenticación:", error)
          // Permitir el inicio de sesión incluso si hay error al guardar en DB
          return true
        }
      }
      return true
    },

    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        token.id = user.id
        token.email = user.email

        if (user.role) {
          token.role = user.role
        }
      } else if (token.email) {
        // En sesiones posteriores, intentar obtener datos actualizados
        try {
          const users = await executeQuery<any[]>("SELECT * FROM users WHERE email = $1", [token.email])

          if (users && users.length > 0) {
            const dbUser = users[0]
            token.id = dbUser.id.toString()
            token.role = dbUser.role || "user"
          }
        } catch (error) {
          console.error("Error al obtener usuario para JWT:", error)
        }
      }

      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.role = (token.role as string) || "user"
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
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

