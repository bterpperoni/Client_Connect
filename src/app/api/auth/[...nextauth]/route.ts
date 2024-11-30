// @ts-nocheck
import NextAuth from "next-auth";
import { authOptions } from "$/server/auth";

// export const GET = async (req: NextRequest, res: NextResponse) => { return NextAuth(authOptions); }
 
// export const POST = async (req: NextRequest, res: NextResponse) => { return NextAuth(authOptions); }

export async function GET(req, res) {
  return NextAuth(req, res, authOptions);
}

export async function POST(req, res) {
  return NextAuth(req, res, authOptions);
}
