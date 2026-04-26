import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 p-8 font-sans dark:bg-black">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          SecureApp
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          A small Next.js app for the Information Security Systems coursework.
          Authentication, role-based access, and SIEM integration land in the
          next steps.
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
          Build status: scaffolded · auth: pending · SIEM: pending
        </p>
      </div>
    </main>
  );
}
