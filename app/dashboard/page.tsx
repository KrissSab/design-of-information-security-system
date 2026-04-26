import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { logSecurityEvent } from "@/lib/siem";
import { SignOutButton } from "@/app/components/signout-button";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    await logSecurityEvent({
      type: "access_denied",
      email: null,
      role: null,
      path: "/dashboard",
      reason: "unauthenticated",
    });
    redirect("/login?callbackUrl=/dashboard");
  }

  await logSecurityEvent({
    type: "access_granted",
    email: session.user.email!,
    role: session.user.role,
    path: "/dashboard",
  });

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 p-8 font-sans dark:bg-black">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              User dashboard
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Signed in as <strong>{session.user.email}</strong> ({session.user.role}).
            </p>
          </div>
          <SignOutButton />
        </div>

        <p className="mt-6 text-zinc-600 dark:text-zinc-400">
          Any authenticated user can view this page. Each visit is logged to the
          SIEM as an <code>access_granted</code> event.
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
