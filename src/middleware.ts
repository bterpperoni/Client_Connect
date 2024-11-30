import { withAuth } from "next-auth/middleware";

import { authConfig } from "$/../auth.config";
import { NextRequest } from "next/server";

const updatedAuthConfig = {
  ...authConfig,
  callbacks: {
    authorized: ({ token, req }: { token: any; req: NextRequest }) => {
      // Adjust the logic as needed
      return !!token;
    },
  },
};

export default withAuth(updatedAuthConfig);


export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)", "/dashboard/:path*"],
};



