import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { logSecurityEvent } from "@/lib/siem";

export type Role = "admin" | "user";

type AppUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  passwordHash: string;
};

const USERS: AppUser[] = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Admin",
    role: "admin",
    passwordHash: "$2b$10$e6hJlw82OMF3pFXcniKqBO8LvcWNtwWIoQ3o.d3mjDcPV/N6xgnZe",
  },
  {
    id: "2",
    email: "user@example.com",
    name: "User",
    role: "user",
    passwordHash: "$2b$10$/zAACbAihmOGDL2XdxABZ.9MGggOFkPEnLxq.lkH6FiqSdfU5ZZOq",
  },
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").toLowerCase().trim();
        const password = String(credentials?.password ?? "");

        const user = USERS.find((u) => u.email === email);
        if (!user) {
          await logSecurityEvent({ type: "login_failed", email, reason: "unknown_user" });
          return null;
        }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
          await logSecurityEvent({ type: "login_failed", email, reason: "bad_password" });
          return null;
        }

        await logSecurityEvent({ type: "login_success", email: user.email, role: user.role });
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as { role: Role }).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.role) {
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
});

declare module "next-auth" {
  interface Session {
    user: { role: Role } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: Role;
  }
}
