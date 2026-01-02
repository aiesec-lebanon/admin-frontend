import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const aiescToken = req.cookies.get("aiesec_token")?.value;

    const { pathname } = req.nextUrl;

    if (
        pathname.startsWith("/login") ||
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon.ico")
    ) {
        return NextResponse.next();
    }

    // Block if not authenticated
    if (!aiescToken) {
        const loginUrl = new URL("/login", req.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Apply to all routes except:
     * - /login
     * - /api/auth/*
     * - static files
     */
    "/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};