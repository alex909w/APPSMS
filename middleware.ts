import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ["/login", "/register", "/auth", "/api/auth"]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Verificar si la ruta es pública
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Obtener el token de sesión
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Si no hay token y la ruta no es pública, redirigir al login
  if (!token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  // Si la ruta es una ruta protegida, verificar el rol del usuario
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/help") ||
    pathname.startsWith("/stats") ||
    pathname.startsWith("/logs") ||
    pathname.startsWith("/change-password")

  // Si es una ruta de administración y el usuario no tiene rol de admin, redirigir al dashboard
  if (pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Si es una ruta protegida y no hay token, redirigir al login
  if (isProtectedRoute && !token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(pathname))
    return NextResponse.redirect(url)
  }

  // Si es una ruta de autenticación y el usuario ya está autenticado, redirigir al dashboard
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register")
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Si la ruta es la raíz y el usuario ya está autenticado, redirigir al dashboard
  if (pathname === "/" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Configurar las rutas que deben ser procesadas por el middleware
export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas de solicitud excepto:
     * 1. Rutas de API (/api/*)
     * 2. Archivos estáticos (imágenes, fuentes, scripts, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|uploads).*)",
  ],
}
