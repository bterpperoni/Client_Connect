import NextAuth, { DefaultSession, getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db";
import type { GetServerSidePropsContext } from "next";
import { isPasswordValid } from "$/lib/utils/password";
import { Adapter } from "next-auth/adapters";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

// declare module "next-auth" {
//   interface Session extends DefaultSession {
//     user: {
//       id: string;
//       // ...other properties
//     } & DefaultSession["user"];
//   }

//   // interface User {
//   //   // ...other properties
//   //   // role: UserRole;
//   // }
// }

export const authOptions = {
  db: db,
  secret: process.env.SECRET,
  signIn: true,
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
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }
        await db.$connect();
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (user) {
          const isPasswordMatch = isPasswordValid(
            credentials.password,
            user.password ?? ""
          );

          if (!isPasswordMatch) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
          };
        }
        return null;
      },
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
    }),
    /* ... additional providers ... /*/
  ],
  adapter: PrismaAdapter(db) as Adapter,
};

export const { handler, signIn, signOut, useSession, getSession } =
  NextAuth(authOptions);

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
      // Tout autre champ que vous voulez inclure dans l'objet utilisateur.
    };
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    throw new Error("Erreur lors de la vérification des identifiants.");
  }
}
