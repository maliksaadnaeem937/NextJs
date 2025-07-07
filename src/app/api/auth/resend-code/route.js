import User from "@models/User";
import { NextResponse } from "next/server";
import { connectDB } from "@lib/mongodb";
export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
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
    if (
      user.lastVerificationCodeSentAt &&
      Date.now() - user.lastVerificationCodeSentAt.getTime() < 5 * 60 * 1000
    ) {
      const waitMs =
        5 * 60 * 1000 -
        (Date.now() - user.lastVerificationCodeSentAt.getTime());
      const waitSec = Math.ceil(waitMs / 1000);
      return NextResponse.json(
        {
          error: `Please wait ${waitSec} seconds before requesting a new code.`,
        },
        { status: 429 }
      );
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = newCode;
    user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.lastVerificationCodeSentAt = new Date();
    await user.save();
    await sendVerificationEmail(user.email, user.name, newCode);
    return NextResponse.json({ message: "Verification code resent" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
