import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { executeQuery } from "@/lib/db"
import bcrypt from "bcryptjs"

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
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Credenciales incompletas")
          return null
        }

        try {
          // Buscar usuario en la base de datos
          const users = await executeQuery<any[]>("SELECT * FROM users WHERE email = $1", [credentials.email])
          console.log("Usuario encontrado:", users.length > 0)

          if (!users || users.length === 0) {
            console.log("Usuario no encontrado:", credentials.email)
            return null
          }

          const user = users[0]
          console.log("Datos de usuario:", {
            id: user.id,
            email: user.email,
            hasPasswordHash: !!user.password_hash,
            hasPassword: !!user.password,
          })

          // Verificar contraseña
          let passwordMatch = false

          // Primero intentar con password_hash (bcrypt)
          if (user.password_hash) {
            try {
              passwordMatch = await bcrypt.compare(credentials.password, user.password_hash)
              console.log("Verificación bcrypt:", passwordMatch)
            } catch (bcryptError) {
              console.error("Error en bcrypt:", bcryptError)
              // Si falla bcrypt, intentar con comparación directa
              passwordMatch = credentials.password === user.password
              console.log("Verificación directa (fallback):", passwordMatch)
            }
          } else if (user.password) {
            // Comparación directa si no hay hash
            passwordMatch = credentials.password === user.password
            console.log("Verificación directa:", passwordMatch)
          }

          if (!passwordMatch) {
            console.log("Contraseña incorrecta para:", credentials.email)
            return null
          }

          console.log("Autenticación exitosa para:", credentials.email)
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role || "user",
          }
        } catch (error) {
          console.error("Error de autenticación:", error)
          return null
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("SignIn callback:", { provider: account?.provider, userId: user?.id })

      if (account?.provider === "google") {
        try {
          const email = user.email
          const name = user.name || profile?.name || email?.split("@")[0]

          if (!email) {
            console.error("No se pudo obtener el email de Google")
            return false
          }

          // Verificar si el usuario ya existe
          const existingUsers = await executeQuery<any[]>("SELECT * FROM users WHERE email = $1", [email])

          if (existingUsers && existingUsers.length > 0) {
            // Usuario existe, actualizar información
            await executeQuery(
              `UPDATE users SET 
                name = $1, 
                provider = $2, 
                provider_id = $3, 
                email_verified = $4,
                updated_at = CURRENT_TIMESTAMP
               WHERE email = $5`,
              [name, "google", user.id, true, email],
            )
          } else {
            // Crear nuevo usuario
            try {
              await executeQuery(
                `INSERT INTO users 
                 (name, email, provider, provider_id, email_verified, role, created_at, updated_at) 
                 VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
                [name, email, "google", user.id, true, "user"],
              )
            } catch (insertError) {
              console.error("Error al crear usuario:", insertError)

              // Intento simplificado si fallan algunas columnas
              await executeQuery(`INSERT INTO users (name, email, created_at) VALUES ($1, $2, CURRENT_TIMESTAMP)`, [
                name,
                email,
              ])
            }
          }

          return true
        } catch (error) {
          console.error("Error en el proceso de autenticación con Google:", error)
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
        token.name = user.name

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
    signUp: "/register",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  debug: true, // Habilitar modo debug para ver más información
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

