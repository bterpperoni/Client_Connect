import NextAuth, { DefaultSession, getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db";
import type { GetServerSidePropsContext } from "next";
import { isPasswordValid } from "$/lib/utils/password";
import { Adapter } from "next-auth/adapters";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { hash } from "bcryptjs";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

import type { AuthOptions, SessionStrategy } from "next-auth";

export const authOptions: AuthOptions = {
  callbacks: {
    session: ({
      session,
      user,
    }: {
      session: DefaultSession;
      user: { id: string };
    }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  //     Credentials({
  //       id: "credentials",
  //       name: "Credentials",
  //       async authorize(credentials) {

  //         await db.$connect();
  //         const user = await getUserFromDb(
  //           credentials?.email ?? "",
  //           credentials?.password ?? ""
  //         );

  //         if (!user) {
  //           return null;
  //         }
  //         const isPasswordMatch = isPasswordValid(
  //           credentials.password ?? "",
  //           user.password ?? ""
  //         );
  //         if (!isPasswordMatch) {
  //           return null;
  //         }

  //         return {
  //           id: user.id,
  //           email: user.email,
  //         };
  //       },
  //       credentials: {
  // email: { label: "Email", type: "email" },
  //     },
  // })
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      //@ts-ignore
      async authorize(credentials: { email: string; password: string }) {
        await db.$connect();

        const psswd = await hash(credentials.password, 12);

        const user = await getUserFromDb(credentials.email, psswd);

        // Check if user exists
        if (!user) {
          return null;
        }

        // Validate password
        const isPasswordMatch = await isPasswordValid(
          credentials.password,
          user.password
        );

        if (!isPasswordMatch) {
          return null;
        }

        return {
          name: user.id,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
};

export default NextAuth(authOptions);

//?------------------------------- Function to get the server session.

export const getServerAuthSession = async (
  context: GetServerSidePropsContext
) => {
  return await getServerSession(context.req, context.res, authOptions);
};

//?------------------------------- Function to get user from the database.
async function getUserFromDb(email: string, hashedPassword: string) {
  try {
    const user = await db.user.findUnique({
      where: { email }, // Recherche l'utilisateur par email.
    });

    if (!user) {
      return null; // L'utilisateur n'existe pas.
    }

    // Vérifie si le mot de passe correspond.
    if (user.password !== hashedPassword) {
      return null; // Mot de passe incorrect.
    }

    return {
      id: user.id,
      email: user.email,
      password: user.password,
      // Tout autre champ que vous voulez inclure dans l'objet utilisateur.
    };
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    throw new Error("Erreur lors de la vérification des identifiants.");
  }
}
