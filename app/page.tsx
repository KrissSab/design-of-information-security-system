import Link from "next/link";
import { auth } from "@/auth";
import { SignOutButton } from "@/app/components/signout-button";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 p-8 font-sans dark:bg-black">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              SecureApp
            </h1>
            {session?.user ? (
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Signed in as <strong>{session.user.email}</strong> (
                {session.user.role}).
              </p>
            ) : (
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Not signed in.
              </p>
            )}
          </div>
          {session?.user ? (
            <SignOutButton />
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-zinc-950 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Sign in
            </Link>
          )}
        </div>

        <p className="mt-6 text-zinc-600 dark:text-zinc-400">
          A small Next.js app for the Information Security Systems coursework.
          Auth.js v5 with credentials, role-based access on{" "}
          <code>/admin</code> and <code>/dashboard</code>, every auth and access
          event forwarded to the SIEM.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/admin"
            className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Admin area
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            User dashboard
          </Link>
        </div>

        <p className="mt-8 text-xs text-zinc-500">
          Build status: scaffolded · auth: done · SIEM: stubbed (Graylog next)
        </p>
      </div>
    </main>
  );
}
