// /app/api/posts/route.js

import { connectDB } from "@lib/mongodb";
import Post from "@models/Post";
import User from "@models/User";
import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "@lib/globalVariables"; // ✅ Make sure this is defined
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    await connectDB();

    // ✅ Get access token from cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token" },
        { status: 401 }
      );
    }

    // ✅ Verify token
    let user;
    try {
      user = jwt.verify(token, JWT_ACCESS_SECRET);
    } catch (err) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or expired token" },
        { status: 401 }
      );
    }

   
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");
    const skip = (page - 1) * limit;

    const posts = await Post.find({ user: user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "user",
        select: "name profilePic",
      })
      .select("title content createdAt user likes updatedAt");

    const totalPosts = await Post.countDocuments({ user: user.id }); // ✅ Filtered count

    return NextResponse.json({
      posts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
