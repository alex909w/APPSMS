import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isLoggedIn = !!token;

  // 1. Definición de rutas públicas (accesibles sin login)
  const publicPaths = [
    "/",           // Ahora es el login
    "/login",      // Alternativa (redirige a "/")
    "/api/auth",   // Rutas de autenticación
    "/auth/error"  // Página de errores
  ];

  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname === path || 
    request.nextUrl.pathname.startsWith(path)
  );

  // 2. Redirigir /login a / (para tener una sola ruta de login)
  if (request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. Si el usuario ESTÁ logueado y trata de acceder al login (/)
  if (isLoggedIn && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 4. Si el usuario NO está logueado y trata de acceder a ruta privada
  if (!isLoggedIn && !isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};