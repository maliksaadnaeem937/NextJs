// /app/api/profile/route.js

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "@lib/globalVariables";
import { connectDB } from "@lib/mongodb";
import User from "@models/User";
import cloudinary from "@lib/cloudinary";

export async function PATCH(req) {
  try {
    const cookieStore = await cookies(); // no await
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token" },
        { status: 401 }
      );
    }

    let user;
    try {
      user = jwt.verify(token, JWT_ACCESS_SECRET);
    } catch (err) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or expired token" },
        { status: 401 }
      );
    }

    await connectDB();

    const formData = await req.formData();
    const file = formData.get("profileImage");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "No valid file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "profile_pictures" }, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        })
        .end(buffer);
    });

    const imageUrl = uploadResult.secure_url;

    // Update DB
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { profilePic: imageUrl },
      { new: true }
    );

    return NextResponse.json({
      message: "Image uploaded successfully",
      profileImage: imageUrl,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
