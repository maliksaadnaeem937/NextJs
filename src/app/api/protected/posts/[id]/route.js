import { connectDB } from "@lib/mongodb";
import Post from "@models/Post";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export async function GET(req, { params }) {
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

    const currentUserId = payload.id;
    const { id } = await params;
    const targetUserId = id;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");
    const skip = (page - 1) * limit;

    const posts = await Post.find({ user: targetUserId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name profilePic")
      .select("title content user likes createdAt updatedAt");

    const postsWithLikeStatus = posts.map((post) => {
      const isLikedByMe = post.likes.some(
        (id) => id.toString() === currentUserId
      );

      const postObj = post.toObject();
      delete postObj.likes;

      return {
        ...postObj,
        isLikedByMe,
        likeCount: post.likes.length,
      };
    });

    const totalPosts = await Post.countDocuments({ user: targetUserId });

    return NextResponse.json({
      posts: postsWithLikeStatus,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error("Fetch user posts error:", err);
    return NextResponse.json(
      { error: "Failed to fetch user posts" },
      { status: 500 }
    );
  }
}
