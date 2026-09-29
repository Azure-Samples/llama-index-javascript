import { NextResponse } from "next/server";

/**
 * Inbound authentication gate for every API route.
 *
 * AUTH_MODE controls how callers are authenticated:
 * - "easyauth": Azure Container Apps built-in authentication (EasyAuth) is
 *   enabled in front of the app. Requests must carry the
 *   X-MS-CLIENT-PRINCIPAL-ID header, which the platform sets for signed-in
 *   callers and strips from any client-supplied request.
 * - "anonymous": no authentication. Only use this for local development or
 *   when another trusted gateway authenticates every request.
 *
 * When AUTH_MODE is unset, a development build (`next dev`) allows anonymous
 * access for local development, while a production build (`next start`, the
 * container image) fails closed and rejects every API request. Unknown values
 * also fail closed.
 */
export type AuthMode = "easyauth" | "anonymous" | "unconfigured";

const PRINCIPAL_ID_HEADER = "x-ms-client-principal-id";

// `next build` inlines NODE_ENV, so a production build can't be switched back
// to the anonymous development fallback by setting NODE_ENV at runtime.
const IS_DEV_BUILD = process.env.NODE_ENV === "development";

let warned = false;

export function resolveAuthMode(
  env: Record<string, string | undefined> = process.env,
): AuthMode {
  const mode = env.AUTH_MODE?.trim().toLowerCase();
  if (mode === "easyauth") return "easyauth";
  if (mode === "anonymous") return "anonymous";
  if (!mode && IS_DEV_BUILD) return "anonymous";
  return "unconfigured";
}

function warnOnce(message: string) {
  if (!warned) {
    warned = true;
    console.warn(`[auth] ${message}`);
  }
}

/**
 * Returns a 401 response when the request is not authenticated, or null when
 * the request may proceed.
 */
export function checkAuth(headers: Headers): NextResponse | null {
  const mode = resolveAuthMode();

  if (mode === "anonymous") {
    if (!IS_DEV_BUILD) {
      warnOnce(
        "AUTH_MODE=anonymous: API routes are reachable without authentication.",
      );
    }
    return null;
  }

  if (mode === "easyauth" && headers.get(PRINCIPAL_ID_HEADER)) {
    return null;
  }

  if (mode === "unconfigured") {
    warnOnce(
      "Rejecting API requests because authentication is not configured. " +
        "Enable Azure Container Apps authentication and set AUTH_MODE=easyauth.",
    );
  }

  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401, headers: { "Cache-Control": "no-store" } },
  );
}
