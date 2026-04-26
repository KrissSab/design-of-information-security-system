import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { logSecurityEvent } from "@/lib/siem";
import { SignOutButton } from "@/app/components/signout-button";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    await logSecurityEvent({
      type: "access_denied",
      email: null,
      role: null,
      path: "/admin",
      reason: "unauthenticated",
    });
    redirect("/login?callbackUrl=/admin");
  }

  if (session.user.role !== "admin") {
    await logSecurityEvent({
      type: "access_denied",
      email: session.user.email ?? null,
      role: session.user.role,
      path: "/admin",
      reason: "insufficient_role",
    });

    return (
      <main className="flex flex-1 items-center justify-center bg-zinc-50 p-8 font-sans dark:bg-black">
        <div className="w-full max-w-xl rounded-2xl border border-red-200 bg-white p-10 shadow-sm dark:border-red-900/50 dark:bg-zinc-950">
          <h1 className="text-2xl font-semibold tracking-tight text-red-700 dark:text-red-400">
            403 — Forbidden
          </h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            You are signed in as <strong>{session.user.email}</strong> ({session.user.role}),
            but this page requires the <code>admin</code> role. The denial has
            been forwarded to the SIEM.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block text-sm font-medium text-zinc-700 underline underline-offset-4 dark:text-zinc-300"
          >
            ← Back home
          </Link>
        </div>
      </main>
    );
  }

  await logSecurityEvent({
    type: "access_granted",
    email: session.user.email!,
    role: session.user.role,
    path: "/admin",
  });

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 p-8 font-sans dark:bg-black">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Admin area
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Signed in as <strong>{session.user.email}</strong> ({session.user.role}).
            </p>
          </div>
          <SignOutButton />
        </div>

        <p className="mt-6 text-zinc-600 dark:text-zinc-400">
          Restricted to the <code>admin</code> role. Granted and denied access
          attempts are forwarded to the SIEM.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block text-sm font-medium text-zinc-700 underline underline-offset-4 dark:text-zinc-300"
        >
          ← Back home
        </Link>
      </div>
    </main>
  );
}
