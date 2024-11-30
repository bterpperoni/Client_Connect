import { JWT } from "next-auth/jwt";
import { NextAuthMiddlewareOptions } from "next-auth/middleware";
import { NextRequest } from "next/server";
import { Session } from 'next-auth';

export const authConfig = {
  callbacks: {
    authorized: ({ token, req }: { token: JWT | null; req: NextRequest }) => {
      const isAuthRoute = req.nextUrl.pathname.startsWith("/dashboard");
      const isLoggedIn = !!token; // Le token est présent si l'utilisateur est connecté

      if (isAuthRoute) {
        return isLoggedIn; // Bloque les non-connectés sur /dashboard
      }
      return true; // Autorise tout le monde pour les autres routes
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.SECRET,
} satisfies NextAuthMiddlewareOptions;
