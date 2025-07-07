import { NextResponse } from "next/server";
import { checkAuth } from "middlewares/auth";
export async function middleware(request) {
  // Clone the request header
  const requestHeaders = new Headers(request.headers);

  // Add a custom header to fix CORS
  requestHeaders.set("x-middleware-preflight", "1");

  // Return the response with the new headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
