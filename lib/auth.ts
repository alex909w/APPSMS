import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { executeQuery } from "@/lib/db"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const users = await executeQuery(
            "SELECT id, nombre_usuario, correo, contrasena, nombre, apellido, imagen FROM usuarios WHERE correo = $1 AND activo = true",
            [credentials.email]
          )

          if (!users || users.length === 0) {
            return null
          }

          const user = users[0]
          const isValid = await bcrypt.compare(credentials.password, user.contrasena)

          if (!isValid) {
            return null
          }

          return {
            id: user.id.toString(),
            name: user.nombre && user.apellido ? `${user.nombre} ${user.apellido}` : user.nombre_usuario,
            email: user.correo,
            image: user.imagen || null,
          }
        } catch (error) {
          console.error("Error en autenticación:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const existingUsers = await executeQuery("SELECT id FROM usuarios WHERE correo = $1", [user.email])

          if (!existingUsers || existingUsers.length === 0) {
            const nameParts = user.name?.split(" ") || ["Usuario", "Google"]
            const firstName = nameParts[0]
            const lastName = nameParts.slice(1).join(" ")

            await executeQuery(
              `INSERT INTO usuarios (nombre_usuario, correo, nombre, apellido, rol, activo, imagen) 
               VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [
                user.name?.replace(/\s+/g, "").toLowerCase() || `user_${Date.now()}`,
                user.email,
                firstName,
                lastName,
                "usuario",
                true,
                user.image,
              ]
            )
          }
        } catch (error) {
          console.error("Error al registrar usuario de Google:", error)
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
