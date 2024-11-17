import NextAuth from "next-auth";

import * as auth from "$/server/auth";

const handler = NextAuth(auth.authOptions);
export { handler as GET, handler as POST };
