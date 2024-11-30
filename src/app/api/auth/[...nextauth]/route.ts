import NextAuth from "next-auth";
import { authOptions } from "$/server/auth";

// Middleware pour gérer GET et POST
const handler = NextAuth(authOptions);

// GET handler
export {handler as GET, handler as POST}; ;
