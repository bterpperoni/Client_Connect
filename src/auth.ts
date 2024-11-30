import { isPasswordValid, saltAndHashPassword } from "$/lib/utils/password";
import Credentials from "next-auth/providers/credentials";
import { db } from "$/server/db";
import { User } from "@prisma/client";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { signInSchema } from "$/lib/utils/zod";
import { ZodError } from "zod";


export const { handlers, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthorized = nextUrl.pathname.startsWith(`/dashboard/${auth?.user?.id}`);
      if (isAuthorized) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials): Promise<User | null> => {
        try {
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          const user: User | null = await db.user.findUnique({
            where: { email: email as string },
          });

          if (user) {
            const hashedPassword = await saltAndHashPassword(password, 10);
            const valid = await isPasswordValid(hashedPassword, user.password);
            console.log(
              "User psswd from db: ",
              user.password,
              "\nCompared to: ",
              password
            );
            if (valid) {
              return user;
              // return new Promise((resolve) => resolve(user));
            } else {
              throw new Error("Password does not match");
            }
          }
          throw new Error("No user found with this email");
        } catch (error) {
          if (error instanceof ZodError) {
            throw new Error("Invalid credentials");
          } else {
            throw error;
          }
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
})
