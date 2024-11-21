// import NextAuth, { DefaultSession, getServerSession } from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import { db } from "./db";
// import type { GetServerSidePropsContext } from "next";
// import { isPasswordValid } from "$/lib/utils/password";
// import { Adapter } from "next-auth/adapters";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { hash } from "bcryptjs";

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

// import type { AuthOptions, SessionStrategy } from "next-auth";

// export const authOptions: AuthOptions = {
//   callbacks: {
//     session: ({
//       session,
//       user,
//     }: {
//       session: DefaultSession;
//       user: { id: string };
//     }) => ({
//       ...session,
//       user: {
//         ...session.user,
//         id: user.id,
//       },
//     }),
//   },
// Credentials({
//   id: "credentials",
//   name: "Credentials",
//   async authorize(credentials) {

//     await db.$connect();
//     const user = await getUserFromDb(
//       credentials?.email ?? "",
//       credentials?.password ?? ""
//     );

//     if (!user) {
//       return null;
//     }
//     const isPasswordMatch = isPasswordValid(
//       credentials.password ?? "",
//       user.password ?? ""
//     );
//     if (!isPasswordMatch) {
//       return null;
//     }

//     return {
//       id: user.id,
//       email: user.email,
//     };
//   },
//   //       credentials: {
//   // email: { label: "Email", type: "email" },
//   //     },
//   // })
//   providers: [
//     Credentials({
//       id: "credentials",
//       name: "Credentials",
//       //@ts-ignore
//       async authorize(credentials: { email: string; password: string }) {
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
//         email: { label: "Email", type: "email" },
//         hashPassword: { label: "Password", type: "password" },
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt" as SessionStrategy,
//     maxAge: 30 * 24 * 60 * 60, // 30 Days
//   },
// };

// export default NextAuth(authOptions);

// //?------------------------------- Function to get the server session.

// export const getServerAuthSession = async (
//   context: GetServerSidePropsContext
// ) => {
//   return await getServerSession(context.req, context.res, authOptions);
// };

// //?------------------------------- Function to get user from the database.
async function getUserFromDb(
    email: string,
    password: string
): Promise<User | undefined> {
    try {
        const user = await db.user.findUnique({
            where: { email }, // Recherche l'utilisateur par email.
        });
        console.log("user", user);
        console.log("password", password);
        if (user) {
            console.log(await bcrypt.compare(password, user.password));
        }

        if (!user) {
            return undefined; // L'utilisateur n'existe pas.
        } else if (!(await bcrypt.compare(password, user.password))) {
            return undefined; // Le mot de passe ne correspond pas.
        }
        return user;
    } catch (error) {
        console.error(
            "Erreur lors de la récupération de l'utilisateur :",
            error
        );
        throw new Error("Erreur lors de la vérification des identifiants.");
    }
}

import NextAuth from "next-auth";
import { authConfig } from "$/../auth.config";
import Credentials from "next-auth/providers/credentials";
import { string, z } from "zod";
import { db } from "./db";
import { Prisma, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { hashPassword } from "$/lib/utils/password";
import { signInSchema } from "./zod";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(db),
    providers: [
        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                let user = null;
                console.log("credentials", credentials);
                const { email, password } = await signInSchema.parseAsync(
                    credentials
                );

                // logic to salt and hash password
                const pwHash = await hashPassword(password);
                // logic to verify if the user exists
                user = await getUserFromDb(email, pwHash);

                if (!user) {
                    // No user found, so this is their first attempt to login
                    // Optionally, this is also the place you could do a user registration
                    throw new Error("Invalid credentials.");
                }

                // return user object with their profile data
                return user;
            },
        }),
    ],
});
