import { Session } from "next-auth";
import { signIn } from "next-auth/react";

export const authConfig = {
  callbacks: {
    authorized({ auth }: { auth: Session | null; token: string }) {
      const isLoggedIn = !!auth?.user;
      if (!isLoggedIn) {
        return signIn("credentials", { redirect: false });
      }
      // Si l'utilisateur est connecté et tente d'accéder à une route protégée, il est autorisé
      if (isLoggedIn) {
        return true;
      }
      // Si l'utilisateur n'est pas connecté, il est redirigé vers la page de connexion
      return false;
    },
  },
  pages: {
    signIn: "/login",
  },
};
