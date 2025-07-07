import { NextResponse } from "next/server";
import { connectDB } from "@lib/mongodb";
import User from "@models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getAccessCookie, getRefreshCookie } from "@lib/getCookie";

// JWT secrets and durations
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRE = process.env.ACCESS_TOKEN_EXPIRE || "15m";
const REFRESH_EXPIRE = process.env.REFRESH_TOKEN_EXPIRE || "7d";
const ACCESS_MAX_AGE = Number(process.env.ACCESS_TOKEN_MAX_AGE) || 900;
const REFRESH_MAX_AGE = Number(process.env.REFRESH_TOKEN_MAX_AGE) || 604800; // 7 days

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    console.log("login route data received:", { email, password });

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { error: "Please verify your email first" },
        { status: 403 }
      );
    }

    const payload = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };

    const accessToken = jwt.sign(payload, ACCESS_SECRET, {
      expiresIn: ACCESS_EXPIRE,
    });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
      expiresIn: REFRESH_EXPIRE,
    });

    const accessCookie = getAccessCookie(accessToken);
    const refreshCookie = getRefreshCookie(refreshToken);

    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );
    response.headers.append("Set-Cookie", accessCookie);
    response.headers.append("Set-Cookie", refreshCookie);

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic"; // Ensure this route is always fresh
export const revalidate = 0; // Disable revalidation for this route
