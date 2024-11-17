import { saltAndHashPassword } from "$/lib/utils/password";
import NextAuth, { DefaultSession, getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import type { GetServerSidePropsContext } from "next";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

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

export const authOptions = {
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
      // You can specify which fields should be submitted, by adding keys to the credentials object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // The authorize function is called when a user submits their sign in credentials.
      authorize: async (credentials) => {
        let user = null;

        // logic to salt and hash password
        if (!credentials) {
          throw new Error("Credentials are required.");
        }
        const pwHash = await saltAndHashPassword(credentials.password);

        // logic to verify if the user exists
        user = await getUserFromDb(credentials.email, pwHash);

        if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          throw new Error("No user found.");
        }

        // return user object with their profile data
        return user;
      },
    }),
  ],
  adapter: PrismaAdapter({ prisma: db }) as Adapter,
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
      name: user.name,
      // Tout autre champ que vous voulez inclure dans l'objet utilisateur.
    };
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    throw new Error("Erreur lors de la vérification des identifiants.");
  }
}
