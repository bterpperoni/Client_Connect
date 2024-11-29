
import { handlers } from "$/auth";
import { NextRequest } from "next/server";

// export { handlers as GET, handlers as POST };



export const GET = async (req: NextRequest) => {
  return handlers.GET(req);
};

export const POST = async (req: NextRequest) => {
  return handlers.POST(req);
};
