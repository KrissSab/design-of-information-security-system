import "server-only";

export type SecurityEvent =
  | { type: "login_success"; email: string; role: string }
  | { type: "login_failed"; email: string; reason: "unknown_user" | "bad_password" }
  | { type: "logout"; email: string }
  | { type: "access_granted"; email: string; role: string; path: string }
  | { type: "access_denied"; email: string | null; role: string | null; path: string; reason: "unauthenticated" | "insufficient_role" };

export async function logSecurityEvent(event: SecurityEvent, ctx?: { ip?: string; userAgent?: string }) {
  const payload = {
    ts: new Date().toISOString(),
    app: "secureapp",
    env: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "dev",
    ip: ctx?.ip ?? null,
    userAgent: ctx?.userAgent ?? null,
    ...event,
  };

  // TODO(siem): replace with Graylog GELF HTTP fetch once the manager is up.
  console.log("[siem]", JSON.stringify(payload));
}
