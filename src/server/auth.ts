import { isPasswordValid } from "$/lib/utils/password";
import Credentials from "next-auth/providers/credentials";
import { db } from "$/server/db";
import NextAuth, {
  DefaultSession,
  Session,
} from "next-auth";
import { getServerSession } from "next-auth/next";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { signInSchema } from "$/lib/utils/zod";
import { ZodError } from "zod";
import { GetServerSidePropsContext } from "next";
import { authConfig } from "auth.config";
import { JWT, getToken } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";
import { useSession } from "next-auth/react";
import { SessionStore } from "node_modules/next-auth/core/lib/cookie";
import { now } from "next-auth/client/_utils";
import { User } from "@prisma/client";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      name: string;
      email: string;
      token: string;
      //: ...other properties
    };
  }
}

// export type CustomSessionData = {
//   id: string;
//   name: string | null;
//   email: string;
// };

export const authOptions = {
  ...authConfig,
  adapter: PrismaAdapter(db),
  callbacks: {
    session: async ({ session, token }: { session: Session; token: JWT }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
        return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (
        credentials,
        request
      ): Promise<User | null> => {
        try {
          if (!request.body) {
            throw new Error("Request body is undefined");
          }
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
         
          // Retournez uniquement les informations nécessaires
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
};

export default NextAuth(authOptions);

export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return await getServerSession(ctx.req, ctx.res, authOptions);
};



// return SessionStore.call(
//           this,
//           {
//             name: "next-auth.session-token",
//             options: cook,
//           },
//           {
//             cookies: { "next-auth.session-token": token.accessToken as string },
//             headers: {
//               authorization: `Bearer ${token.accessToken as string}`,
//             },
//           },
//           console
//         );
