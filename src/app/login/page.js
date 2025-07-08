import React from "react";
import LoginPage from "@components/LoginPage";
import { anyValidToken } from "@lib/auth";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function page() {
  if (await anyValidToken()) {
    return redirect("/profile");
  }
  return <LoginPage></LoginPage>;
}

export const metadata = {
  title: "Login",
  description: "Login to your account",
};