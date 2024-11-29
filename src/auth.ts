import { isPasswordValid } from "$/lib/utils/password";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "$/server/db";
import { User } from "@prisma/client";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

interface Credentials {
  email: string;
  password: string;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Exemple basique : valider utilisateur
        const { email, password } = credentials || {};

        const user: User | null = await db.user.findUnique({
          where: { email: email as string },
        });

        if (user) {
          const valid = await isPasswordValid(
            password as string,
            user.password
          );
          if (valid) console.log("User: ", user);
          return user;
        }
        // Retourne null si les credentials sont invalides
        console.log("Failed to login");
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login", // Personnalisez si nécessaire
  },
} satisfies NextAuthConfig);
