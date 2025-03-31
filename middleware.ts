import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")
  const isLoggedIn = !!session?.value

  // Public paths that don't require authentication
  const isPublicPath = request.nextUrl.pathname === "/" || request.nextUrl.pathname.startsWith("/api/auth/login")

  // If the user is not logged in and trying to access a protected route
  if (!isLoggedIn && !isPublicPath) {
    const url = new URL("/", request.url)
    return NextResponse.redirect(url)
  }

  // If the user is logged in and trying to access the login page
  if (isLoggedIn && isPublicPath && request.nextUrl.pathname === "/") {
    // Comentamos esta redirección para permitir ver la página de login
    // const url = new URL("/dashboard", request.url)
    // return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

