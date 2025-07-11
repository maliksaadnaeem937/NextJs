import { connectDB } from "@lib/mongodb";
import User from "@models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { JWT_ACCESS_SECRET } from "@lib/globalVariables";
import { NextResponse } from "next/server";
import mongoose from "mongoose"; 

export async function GET(req, context) {
  const { params } = context;
  const { id } = await params;
  console.log("on api function ", id);

  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    } catch (err) {
      return NextResponse.json(
        { error: "Token invalid or expired" },
        { status: 401 }
      );
    }


        if (!mongoose.Types.ObjectId.isValid(id)) {
  return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 });
        }

    const user = await User.findById(id)
      .select("name bio techStack profilePic isVerified _id")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log(user);
    return NextResponse.json({ ...user }, { status: 200 });
  } catch (err) {
    console.error("Error fetching user:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
