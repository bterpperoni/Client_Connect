import { isPasswordValid } from "$/lib/utils/password";
import Credentials from "next-auth/providers/credentials";
import { db } from "$/server/db";
import NextAuth, { DefaultSession, Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { signInSchema } from "$/lib/utils/zod";
import { ZodError } from "zod";
import { GetServerSidePropsContext } from "next";
import { authConfig } from "auth.config";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      name: string;
      email: string;
      //: ...other properties
    };
  }
}

export type CustomSessionData = {
  id: string;
  name: string | null;
  email: string;
};

export const authOptions = {
  ...authConfig,
  adapter: PrismaAdapter(db),
  callbacks: {
    session: async ({ session, token, user }: { session: Session; token: any; user: any }) => {
      if (session.user) {
        session.user.id = user.id;
        session.user.name = user.name || session.user.name;
        session.user.email = user.email || session.user.email;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials): Promise<CustomSessionData | null> => {
        try {
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          // Vérifiez si l'utilisateur existe
          const user = await db.user.findUnique({
            where: { email },
          });

          if (!user) throw new Error("No user found with this email");

          // Valider le mot de passe
          const valid = await isPasswordValid(password, user.password);
          if (!valid) throw new Error("Invalid credentials");

          // Retournez uniquement les informations nécessaires
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            // Ajoutez d'autres champs si nécessaire
          };
        } catch (error) {
          if (error instanceof ZodError) {
            throw new Error("Invalid input");
          }
          throw new Error("Authentication failed");
        }
      },
    }),
  ]
};

export default NextAuth(authOptions);



export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return await getServerSession(ctx.req, ctx.res, authOptions);
};
