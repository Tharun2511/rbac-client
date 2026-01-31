import { NextResponse, NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const url = req.nextUrl.clone();
  const path = url.pathname;

  // PUBLIC ROUTES
  const PUBLIC_PATHS = ["/login"];

  // If visiting /login and user is already logged in → redirect to dashboard
  if (path === "/login" && token) {
    console.log("token", token);
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString(),
    );
    const role = payload.role;

    if (role === "ADMIN") url.pathname = "/admin";
    if (role === "MANAGER") url.pathname = "/manager";
    if (role === "RESOLVER") url.pathname = "/resolver";
    if (role === "USER") url.pathname = "/user";

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

  // Decode JWT
  let role = null;
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString(),
    );
    role = payload.role;
  } catch {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // RBAC allowed routes
  const ROLE_ALLOWED_ROUTES: Record<string, string[]> = {
    ADMIN: ["/admin"],
    MANAGER: ["/manager", "/tickets"],
    RESOLVER: ["/resolver", "/tickets"],
    USER: ["/user", "/tickets"],
  };

  const basePath = "/" + path.split("/")[1];
  const allowed = ROLE_ALLOWED_ROUTES[role] ?? [];

  // If role not allowed for this route
  if (!allowed.includes(basePath)) {
    if (role === "ADMIN") url.pathname = "/admin";
    if (role === "MANAGER") url.pathname = "/manager";
    if (role === "RESOLVER") url.pathname = "/resolver";
    if (role === "USER") url.pathname = "/user";

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"],
};
