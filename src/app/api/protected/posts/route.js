import { NextResponse } from "next/server";
import { connectDB } from "@lib/mongodb";
import Post from "@models/Post";
import User from "@models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export async function POST(req) {
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

    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required." },
        { status: 400 }
      );
    }

    const user = await User.findById(payload.id).select("_id name email");

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const post = new Post({
      user: user._id,
      title,
      content,
    });

    await post.save();

    return NextResponse.json(
      { message: "Post created successfully", postId: post._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Post creation error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
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

    const { postId, title, content } = await req.json();

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

    if (post.user.toString() !== payload.id) {
      return NextResponse.json(
        { error: "Forbidden: You cannot edit this post." },
        { status: 403 }
      );
    }

    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;

    await post.save();

    return NextResponse.json(
      { message: "Post updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Post update error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(limit)
      .populate("user", "name profilePic") // just show name and avatar
      .select("title content user likes createdAt updatedAt"); // send required fields

    const totalPosts = await Post.countDocuments();

    return Response.json({
      posts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    });
  } catch (err) {
    return Response.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function DELETE(req) {
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

    if (post.user.toString() !== payload.id) {
      return NextResponse.json(
        { error: "Forbidden: You cannot delete this post." },
        { status: 403 }
      );
    }

    await Post.findByIdAndDelete(postId);

    return NextResponse.json(
      { message: "Post deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Post deletion error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
