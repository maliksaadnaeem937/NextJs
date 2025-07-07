import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  try {
    console.log("logout route called");
    // Clear both access and refresh token cookies
    const clearAccessCookie = serialize("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 0,
    });

    const clearRefreshCookie = serialize("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 0,
    });

    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
    response.headers.append("Set-Cookie", clearAccessCookie);
    response.headers.append("Set-Cookie", clearRefreshCookie);

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
