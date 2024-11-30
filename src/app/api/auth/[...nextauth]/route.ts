import NextAuth from "next-auth";
import { authOptions } from "$/auth";
import { NextApiRequest, NextApiResponse } from "next";

// export const GET = async (req: NextRequest, res: NextResponse) => { return NextAuth(authOptions); }
 
// export const POST = async (req: NextRequest, res: NextResponse) => { return NextAuth(authOptions); }

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, authOptions);
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, authOptions);
}
