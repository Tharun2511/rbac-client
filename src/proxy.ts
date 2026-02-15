import { NextResponse, NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const url = req.nextUrl.clone();
  const path = url.pathname;

  // PUBLIC ROUTES — no auth required
  const PUBLIC_PATHS = ["/login"];

  // If visiting /login and user has a token → redirect to dashboard
  if (path === "/login" && token) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // If the path is public and user is NOT logged in → allow
  if (PUBLIC_PATHS.includes(path) && !token) {
    return NextResponse.next();
  }

  // If no token and accessing protected route → redirect to login
  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // User has a token → allow all routes.
  // Permission-based access control is handled client-side by RBACContext.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"],
};
