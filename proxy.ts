/* eslint-disable @typescript-eslint/no-explicit-any */
// proxy.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth as baseAuth } from "./auth";
import {
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  // LOGIN_REDIRECT,
} from "./routes";

// Wrap with NextAuth so req.auth is populated.
export default baseAuth(function proxy(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const isLoggedIn = !!(req as any).auth;

  // 1) Let NextAuth handle its own API routes (/api/auth/*)
  if (pathname.startsWith(apiAuthPrefix)) return NextResponse.next();

  // 2) Auth pages (/login, /register): if logged in, route by role
  const isAuthRoute = authRoutes.includes(pathname);
  if (isAuthRoute && isLoggedIn) {
    const role = (req as any).auth?.user?.role as "ADMIN" | "USER" | undefined;
    const isGroomer = (req as any).auth?.user?.isGroomer as boolean | undefined;

    const destination =
      role === "ADMIN" ? "/admin" : isGroomer ? "/groomer" : "/dashboard";

    return NextResponse.redirect(new URL(destination, nextUrl));
  }

  // 3) Protected pages: require login unless public or an auth page
  const isPublicRoute = publicRoutes.includes(pathname);
  if (!isLoggedIn && !isPublicRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // 4) Continue
  return NextResponse.next();
});

// Same matcher you already had
export const config = {
  matcher: [
    // Skip _next/* and common static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always execute on API routes
    "/(api|trpc)(.*)",
  ],
};
