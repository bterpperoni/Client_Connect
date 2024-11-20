// @ts-nocheck
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async authorize({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathName.startsWith(
        `/dashboard/${auth?.user?.id}`
      );
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL(`/dashboard/`, nextUrl));
      }
      return true;
    },
  },
  providers: ['Credentials'],
  session: {
    strategy: "jwt",
    jwt: {
      encryption: true,
    },
  },
} satisfies NextAuthConfig;
