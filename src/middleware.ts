import { authConfig } from 'auth.config';
import { withAuth } from "next-auth/middleware";


export default withAuth(authConfig);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)", "/dashboard/:path*"],
};



