import { NextResponse } from "next/server";
import { connectDB } from "@lib/mongodb";
import User from "@models/User";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { getAccessCookie, getRefreshCookie } from "@lib/getCookie";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
// These should be strings like "15m", "7d" for JWT sign expiry
const ACCESS_EXPIRE = process.env.ACCESS_TOKEN_EXPIRE || "15m";
const REFRESH_EXPIRE = process.env.REFRESH_TOKEN_EXPIRE || "7d";

// Read max-age for cookies (in seconds) from env, fallback to defaults
// These ages for cookies should be in seconds
const ACCESS_MAX_AGE = Number(process.env.ACCESS_TOKEN_MAX_AGE) || 900;
const REFRESH_MAX_AGE = Number(process.env.REFRESH_TOKEN_MAX_AGE) || 604800; // 7 days
export async function POST(req) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json(
        { error: "User already verified" },
        { status: 400 }
      );
    }
    const now = new Date();
    const expiresAt = user.verificationCodeExpires;
    if (!expiresAt || now > expiresAt) {
      return NextResponse.json(
        { error: "Verification code expired" },
        { status: 400 }
      );
    }
    if (user.verificationCode !== code || !user.verificationCodeExpires) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    user.lastVerificationCodeSentAt = undefined; // Reset last sent time
    await user.save();

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
      { message: "Email verified" },
      { status: 200 }
    );
    response.headers.append("Set-Cookie", accessCookie);
    response.headers.append("Set-Cookie", refreshCookie);

    return response;
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
