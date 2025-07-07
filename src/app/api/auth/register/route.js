import { sendVerificationEmail } from "@lib/mailer";
import { NextResponse } from "next/server";
import User from "@models/User";
import bcrypt from "bcryptjs";
import { connectDB } from "@lib/mongodb";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    console.log("Signup request data:", { name, email, password });
    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = await User.create({
      name,
      email,
      password: hashed,
      verificationCode: code,
      verificationCodeExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      lastVerificationCodeSentAt: new Date(), // Set current time
      isVerified: false,
    });

    await sendVerificationEmail(email, name, code);

    return NextResponse.json(
      { message: "Signup successful. Check your email for verification code." },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
