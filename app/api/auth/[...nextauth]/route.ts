import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { executeQuery } from "@/lib/db";

interface ExtendedUser {
  id: string | number;
  name?: string | null;
  email?: string | null;
  role?: string;
  [key: string]: any;
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const users = await executeQuery<any[]>("SELECT * FROM usuarios WHERE nombre_usuario = ? LIMIT 1", [
            credentials.username,
          ]);

          if (users.length === 0) {
            return null;
          }

          const user = users[0];

          if (user.contrasena !== credentials.password) {
            return null;
          }

          const { contrasena, ...userWithoutPassword } = user;
          return {
            id: user.id.toString(),
            name: user.nombre_usuario,
            email: user.correo_electronico || "",
            role: user.rol || "usuario",
            ...userWithoutPassword,
          };
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as ExtendedUser).role || "usuario";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          const email = user.email;
          if (!email) return true;

          const existingUsers = await executeQuery<any[]>(
            "SELECT * FROM usuarios WHERE correo_electronico = ? LIMIT 1",
            [email]
          );

          if (existingUsers.length === 0) {
            await executeQuery(
              "INSERT INTO usuarios (nombre_usuario, correo_electronico, proveedor_auth, id_proveedor, rol) VALUES (?, ?, ?, ?, ?)",
              [
                user.name || email.split("@")[0],
                email,
                account.provider,
                user.id,
                "usuario",
              ]
            );
          } else {
            await executeQuery(
              "UPDATE usuarios SET nombre_usuario = ?, proveedor_auth = ?, id_proveedor = ? WHERE correo_electronico = ?",
              [user.name || existingUsers[0].nombre_usuario, account.provider, user.id, email]
            );
          }
        } catch (error) {
          console.error("Error saving OAuth user:", error);
        }
      }
      return true;
    },
  },
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
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
