import { isPasswordValid } from "$/lib/utils/password";
import { db } from "$/server/db";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Exemple basique : valider utilisateur
        const { email, password } = credentials || {};

        const user = await db.user.findUnique({
          where: { email: email as string },
        });

        if (user) {
          const valid = await isPasswordValid(
            password as string,
            user.password
          );
          if (valid) console.log("User: ", user); return user;
        }
        // Retourne null si les credentials sont invalides
        console.log("Failed to login"); return null;
      },
    }),
  ],
  pages: {
    signIn: "/login", // Personnalisez si nécessaire
  },
};

const handler = NextAuth(authOptions);
export { handler};
