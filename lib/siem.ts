import "server-only";

export type SecurityEvent =
  | { type: "login_success"; email: string; role: string }
  | { type: "login_failed"; email: string; reason: "unknown_user" | "bad_password" }
  | { type: "logout"; email: string }
  | { type: "access_granted"; email: string; role: string; path: string }
  | { type: "access_denied"; email: string | null; role: string | null; path: string; reason: "unauthenticated" | "insufficient_role" };

const ELASTIC_URL = process.env.ELASTIC_URL?.replace(/\/$/, "");
const ELASTIC_API_KEY = process.env.ELASTIC_API_KEY;

const ELASTIC_INDEX = process.env.ELASTIC_INDEX ?? "logs-secureapp.auth-default";

type EcsDoc = Record<string, unknown>;

function toEcs(event: SecurityEvent, ctx?: { ip?: string; userAgent?: string }): EcsDoc {
  const base: EcsDoc = {
    "@timestamp": new Date().toISOString(),
    "ecs.version": "8.11.0",
    service: { name: "secureapp" },
    labels: { env: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "dev" },
  };
  if (ctx?.ip) base.source = { ip: ctx.ip };
  if (ctx?.userAgent) base.user_agent = { original: ctx.userAgent };

  const eventBase = { dataset: "secureapp.auth", module: "secureapp", kind: "event" };

  switch (event.type) {
    case "login_success":
      return {
        ...base,
        message: `login_success ${event.email}`,
        event: { ...eventBase, action: "login", category: ["authentication"], type: ["start"], outcome: "success" },
        user: { email: event.email, roles: [event.role] },
      };
    case "login_failed":
      return {
        ...base,
        message: `login_failed ${event.email} (${event.reason})`,
        event: { ...eventBase, action: "login", category: ["authentication"], type: ["start"], outcome: "failure", reason: event.reason },
        user: { email: event.email },
      };
    case "logout":
      return {
        ...base,
        message: `logout ${event.email}`,
        event: { ...eventBase, action: "logout", category: ["authentication"], type: ["end"], outcome: "success" },
        user: { email: event.email },
      };
    case "access_granted":
      return {
        ...base,
        message: `access_granted ${event.email} ${event.path}`,
        event: { ...eventBase, action: "access", category: ["authentication", "iam"], type: ["access"], outcome: "success" },
        user: { email: event.email, roles: [event.role] },
        url: { path: event.path },
      };
    case "access_denied":
      return {
        ...base,
        message: `access_denied ${event.email ?? "anonymous"} ${event.path} (${event.reason})`,
        event: { ...eventBase, action: "access", category: ["authentication", "iam"], type: ["access", "denied"], outcome: "failure", reason: event.reason },
        user: event.email ? { email: event.email, roles: event.role ? [event.role] : undefined } : undefined,
        url: { path: event.path },
      };
  }
}

async function shipToElastic(doc: EcsDoc) {
  if (!ELASTIC_URL || !ELASTIC_API_KEY) return;

  const body = `${JSON.stringify({ create: {} })}\n${JSON.stringify(doc)}\n`;

  try {
    const res = await fetch(`${ELASTIC_URL}/${ELASTIC_INDEX}/_bulk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-ndjson",
        Authorization: `ApiKey ${ELASTIC_API_KEY}`,
      },
      body,
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) {
      console.error("[siem] elastic ingest failed", res.status, await res.text().catch(() => ""));
    }
  } catch (err) {
    console.error("[siem] elastic ingest error", err);
  }
}

export async function logSecurityEvent(event: SecurityEvent, ctx?: { ip?: string; userAgent?: string }) {
  const doc = toEcs(event, ctx);
  console.log("[siem]", JSON.stringify(doc));
  await shipToElastic(doc);
}
