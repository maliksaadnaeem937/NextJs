
import { serialize } from "cookie";
const ACCESS_MAX_AGE = Number(process.env.ACCESS_TOKEN_MAX_AGE) || 900;
const REFRESH_MAX_AGE = Number(process.env.REFRESH_TOKEN_MAX_AGE) || 604800;
export function getAccessCookie(accessToken) {
  const accessCookie = serialize("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "strict",
    maxAge: ACCESS_MAX_AGE,
  });
  return accessCookie;
}

export function getRefreshCookie(refreshToken) {
  const refreshCookie = serialize("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "strict",
    maxAge: REFRESH_MAX_AGE,
  });
  return refreshCookie;
}
