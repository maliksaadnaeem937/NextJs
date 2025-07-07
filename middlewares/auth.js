// middleware.js

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/addcourse") && !token) {
    return NextResponse.redirect(new URL("/signup", request.url));
  }

  return NextResponse.next();
}

// ✅ matcher — no calling, just export
export const config = {
  matcher: ["/addcourse/:path*"],
};
