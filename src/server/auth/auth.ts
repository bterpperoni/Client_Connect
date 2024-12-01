import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "$/server/db";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "../../lib/utils/zod";
import { User } from "@prisma/client";
import { isPasswordValid, saltAndHashPassword } from "../../lib/utils/password";
import { ZodError } from "zod";
import NextAuth from "next-auth";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      id: "credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, _req): Promise<User | null> => {
        try {
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          // On vérifie si l'utilisateur existe, si pas on le crée.
          const user = await db.user.findUnique({
            where: { email },
          });

          if (!user) {
            console.log("Creating a user...");
            const hashedPasswordNewUser = await saltAndHashPassword(password, 10);
            const newUser = await db.user.create({
              data: {
                email: email,
                name: email.split("-")[0],
                password: hashedPasswordNewUser,
              },
            });
            console.log("User created: ", newUser);
            return newUser;
          }

          // On vérifie si le mot de passe est valide
          const valid = await isPasswordValid(password, user?.password ?? "");
          if (!valid) {
            throw new Error("Invalid password");
          }
          const x = await signIn("credentials", credentials);

          setTimeout(() => {
            console.log("User found: ", user, "\n");
            console.log("X: ", x);
          }, 5000);

          return user;
        } catch (error) {
          if (error instanceof ZodError) {
            throw new Error("Invalid input");
          }
          return null;
        }
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    session: async ({ session, token }) => {
      const user = token as {
        id: string;
        email: string;
        name: string;
        token: string;
      };
      session.user.id = user.id;
      session.user.email = user.email;
      session.user.name = user.name;
      session.user.token = user.token;
      return session;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    redirect: async ({ url, baseUrl }) => {
      if (url.startsWith(baseUrl)) return url;
      else if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60,
  },
});
