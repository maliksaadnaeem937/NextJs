// lib/auth.js
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function   getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return null;

  try {
    const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    return user; // contains id, email, name, etc.
  } catch (err) {
    console.error("Invalid token:", err.message);
    return null;
  }
}
