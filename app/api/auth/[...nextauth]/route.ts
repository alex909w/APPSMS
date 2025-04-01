import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { executeQuery } from "@/lib/db"

interface ExtendedUser {
  id: string | number
  name?: string | null
  email?: string | null
  role?: string
  [key: string]: any
}

export const authOptions = {
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    // GitHub OAuth
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
    }),

    // Credentials (Login tradicional)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        try {
          // Primero intentamos buscar en la tabla usuarios (esquema original)
          let users = await executeQuery<any[]>("SELECT * FROM usuarios WHERE nombre_usuario = $1 LIMIT 1", [
            credentials.username,
          ]).catch(() => [])

          // Si no encontramos en usuarios, intentamos en la tabla users (nuevo esquema)
          if (users.length === 0) {
            users = await executeQuery<any[]>("SELECT * FROM users WHERE email = $1 OR name = $1 LIMIT 1", [
              credentials.username,
            ]).catch(() => [])
          }

          if (users.length === 0) return null

          const user = users[0]

          // Verificar contraseña según la tabla
          let passwordValid = false

          if ("contrasena" in user) {
            // Tabla usuarios (esquema original)
            passwordValid = user.contrasena === credentials.password

            if (passwordValid) {
              const { contrasena, ...userWithoutPassword } = user
              return {
                id: user.id.toString(),
                name: user.nombre_usuario,
                email: user.correo_electronico || "",
                role: user.rol || "usuario",
                ...userWithoutPassword,
              }
            }
          } else if ("password" in user) {
            // Tabla users (nuevo esquema)
            // Nota: Idealmente deberías usar bcrypt.compare aquí
            passwordValid = user.password === credentials.password

            if (passwordValid) {
              const { password, ...userWithoutPassword } = user
              return {
                id: user.id.toString(),
                name: user.name,
                email: user.email || "",
                role: user.role || "user",
                ...userWithoutPassword,
              }
            }
          }

          return null
        } catch (error) {
          console.error("Login error:", error)
          return null
        }
      },
    }),
  ],

  // Callbacks (compartidos para todos los proveedores)
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as ExtendedUser).role || "usuario"
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Lógica para Google/GitHub (guardar en DB)
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          const email = user.email
          if (!email) return false

          // Intentar primero en la tabla usuarios
          let existingUsers = await executeQuery<any[]>(
            "SELECT * FROM usuarios WHERE correo_electronico = $1 LIMIT 1",
            [email],
          ).catch(() => [])

          if (existingUsers.length === 0) {
            // Intentar en la tabla users
            existingUsers = await executeQuery<any[]>("SELECT * FROM users WHERE email = $1 LIMIT 1", [email]).catch(
              () => [],
            )
          }

          if (existingUsers.length === 0) {
            // Intentar insertar en usuarios primero
            try {
              await executeQuery(
                "INSERT INTO usuarios (nombre_usuario, correo_electronico, proveedor_auth, id_proveedor, rol) VALUES ($1, $2, $3, $4, $5)",
                [user.name || email.split("@")[0], email, account.provider, user.id, "usuario"],
              )
            } catch (error) {
              // Si falla, intentar insertar en users
              await executeQuery("INSERT INTO users (name, email, role) VALUES ($1, $2, $3)", [
                user.name || email.split("@")[0],
                email,
                "user",
              ])
            }
          } else {
            // Actualizar el usuario existente
            if ("correo_electronico" in existingUsers[0]) {
              await executeQuery(
                "UPDATE usuarios SET nombre_usuario = $1, proveedor_auth = $2, id_proveedor = $3 WHERE correo_electronico = $4",
                [user.name || existingUsers[0].nombre_usuario, account.provider, user.id, email],
              )
            } else {
              await executeQuery("UPDATE users SET name = $1 WHERE email = $2", [
                user.name || existingUsers[0].name,
                email,
              ])
            }
          }
          return true
        } catch (error) {
          console.error("Error saving OAuth user:", error)
          return false
        }
      }
      // Credentials: No requiere lógica adicional
      return true
    },
    async redirect({ url, baseUrl }) {
      // Redireccionar al dashboard después de iniciar sesión
      if (url.startsWith(baseUrl)) {
        // Si la URL es relativa al dominio base
        if (url.includes("?callbackUrl=")) {
          // Si hay un callbackUrl en la URL
          const callbackUrl = new URL(url).searchParams.get("callbackUrl")
          if (callbackUrl) return callbackUrl
        }
        // Si no hay callbackUrl, redirigir al dashboard
        return `${baseUrl}/dashboard`
      } else if (url.startsWith("/")) {
        // Si es una ruta relativa
        return `${baseUrl}${url}`
      }
      return url
    },
  },

  // Configuración general
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }