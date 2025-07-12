// Inside your existing file (e.g., src/app/api/posts/route.js or a separate route)

import { NextResponse } from "next/server";
import { connectDB } from "@lib/mongodb";
import Post from "@models/Post";
import User from "@models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export async function PUT(req) {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let payload;
    try {
      payload = jwt.verify(token, ACCESS_SECRET);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { postId } = await req.json();

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required." },
        { status: 400 }
      );
    }

    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    const userId = payload.id;
    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save({ timestamps: false });

    return NextResponse.json(
      {
        message: hasLiked ? "Post unliked." : "Post liked.",
        totalLikes: post.likes.length,
        likedByUser: !hasLiked,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Like/Unlike post error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
