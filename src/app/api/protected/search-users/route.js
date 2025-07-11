import { connectDB } from "@lib/mongodb";
import User from "@models/User";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;

  await connectDB();

  const query = {
    isVerified: true,
    $or: [
      { name: new RegExp(q, "i") },
      { bio: new RegExp(q, "i") },
      { techStack: new RegExp(q, "i") },
    ],
  };

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(query)
      .skip(skip)
      .limit(limit)
      .select("name bio techStack profilePic"),
    User.countDocuments(query),
  ]);

  return Response.json({
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
