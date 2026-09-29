import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "./app/api/auth";

export function middleware(request: NextRequest) {
  return checkAuth(request.headers) ?? NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
  // Node.js runtime so AUTH_MODE is read at runtime, not inlined at build time.
  runtime: "nodejs",
};
