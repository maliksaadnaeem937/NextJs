import { NextResponse } from "next/server";
import { connectDB } from "@lib/mongodb";
import Comment from "@models/Comment";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { postId } = await params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 5;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({
      post: postId,
      parentComment: null,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name profilePic")
      .lean();

    return NextResponse.json(comments, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  console.log("req recieved on post comment", ACCESS_SECRET);
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      console.log("No token is present");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let payload;
    try {
      console.log("token present ", token);
      payload = jwt.verify(token, ACCESS_SECRET);
    } catch (err) {
      console.log("error occued in verification");
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { postId } = await params;
    const { text } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json(
        { error: "Comment text is required." },
        { status: 400 }
      );
    }

    const newComment = await Comment.create({
      post: postId,
      user: payload.id,
      text: text.trim(),
    });

    const populated = await newComment.populate("user", "name profilePic");
    console.log("populated comment", populated);

    return NextResponse.json(
      {
        _id: populated._id,
        text: populated.text,
        createdAt: populated.createdAt,
        user: populated.user,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating comment:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      console.log("No token is present");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let payload;
    try {
      console.log("token present ", token);
      payload = jwt.verify(token, ACCESS_SECRET);
    } catch (err) {
      console.log("error occued in verification");
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { postId: commentId } = await params;
    if (!commentId) {
      return NextResponse.json(
        { error: "Comment ID is required." },
        { status: 400 }
      );
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found." },
        { status: 404 }
      );
    }

    if (comment.user.toString() !== payload.id) {
      return NextResponse.json(
        { error: "Forbidden: You cannot delete this comment." },
        { status: 403 }
      );
    }

    await Comment.findByIdAndDelete(commentId);

    return NextResponse.json(
      { message: "Post deleted successfully." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting comment:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    console.log("req recived for editing comment");
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Text is required." }, { status: 400 });
    }
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      console.log("No token is present");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let payload;
    try {
      console.log("token present ", token);
      payload = jwt.verify(token, ACCESS_SECRET);
    } catch (err) {
      console.log("error occued in verification");
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
    const { postId: commentId } = await params;

    if (!commentId) {
      return NextResponse.json(
        { error: "Comment ID is required." },
        { status: 400 }
      );
    }
    await Comment.findByIdAndUpdate(commentId, { text });
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Post deleted successfully." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting comment:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
