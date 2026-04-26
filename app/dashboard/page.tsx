import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 p-8 font-sans dark:bg-black">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          User dashboard
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Placeholder page for any signed-in user. Will be gated by Auth.js in
          the next step.
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
