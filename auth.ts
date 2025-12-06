import NextAuth from "next-auth";
import PostgresAdapter from "@auth/pg-adapter";
import { UserRole } from "@/next-auth.d";
import authConfig from "@/auth.config";
import { client } from "@/lib/db";
import { getUserById } from "@/data/user";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await client.query(
        /* sql */ `
          UPDATE public.users
          set "emailVerified" = $1
          WHERE id = $2
        `,
        [new Date(), user.id]
      );
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      // @ts-expect-error <->
      const existingUser = await getUserById(user.id);
      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false;

      // TODO - Add 2FA check

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.role = existingUser.role;

      return token;
    },
  },
  adapter: PostgresAdapter(client),
  session: { strategy: "jwt" },
  ...authConfig,
});
