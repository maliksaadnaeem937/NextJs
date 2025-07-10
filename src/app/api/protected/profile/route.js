// /app/api/profile/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@models/User";
import { connectDB } from "@lib/mongodb";
import { JWT_ACCESS_SECRET } from "@lib/globalVariables";
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;


export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token" },
        { status: 401 }
      );
    }

    let user;
    try {
      user = jwt.verify(token, ACCESS_SECRET);
    } catch (err) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or expired token" },
        { status: 401 }
      );
    }
    await connectDB();
    const savedUser = await User.findById(user.id).select(
      "-email -password -createdAt -updatedAt -__v -isVerified"
    );
    console.log(savedUser);

    return NextResponse.json({ ...savedUser }, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token" },
        { status: 401 }
      );
    }

    let user;
    try {
      user = jwt.verify(token, ACCESS_SECRET); // { _id: "...", ... }
    } catch (err) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const keys = Object.keys(body);

    if (keys.length === 0) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    const field = keys[0];
    const value = body[field];

    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { [field]: value },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Updated successfully",
      data: { [field]: updatedUser[field] },
    });
  } catch (error) {
    console.error("Error in PATCH:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
