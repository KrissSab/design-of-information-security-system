import { auth, signOut } from "@/auth";
import { logSecurityEvent } from "@/lib/siem";

export async function SignOutButton() {
  const session = await auth();
  const email = session?.user?.email ?? "anonymous";

  async function action() {
    "use server";
    await logSecurityEvent({ type: "logout", email });
    await signOut({ redirectTo: "/" });
  }

  return (
    <form action={action}>
      <button
        type="submit"
        className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
      >
        Sign out
      </button>
    </form>
  );
}
