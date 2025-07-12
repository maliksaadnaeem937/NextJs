// lib/auth.js
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";


const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

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

export async function anyValidToken(){
  const cookieStore=await cookies();
  const accessToken=cookieStore.get("accessToken")?.value||"";
  const refreshToken=cookieStore.get("refreshToken")?.value||"";
  if (!accessToken && !refreshToken) return false;
  try {
    let payload;
    if (accessToken) {
      payload=jwt.verify(accessToken, JWT_ACCESS_SECRET);
    }
    if (refreshToken) {
      payload=jwt.verify(refreshToken,JWT_REFRESH_SECRET);
    }
    return payload.id;
  } catch (err) {
    return false;
  } 

}



