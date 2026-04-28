import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware de protection des routes authentifiées.
 * S'exécute côté serveur (Edge) avant le rendu de la page —
 * pas de flash de contenu non autorisé.
 */
export function middleware(req: NextRequest) {
  const token = req.cookies.get("medusa_token")?.value;

  if (!token) {
    const loginUrl = new URL("/auth", req.url);
    loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/compte/:path*"],
};
