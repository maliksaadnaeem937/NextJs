import React from "react";
import VerifyOtp from "@components/VerifyotpPage";
import { redirect } from "next/navigation";
import { anyValidToken } from "@lib/auth";
export const dynamic = "force-dynamic";
export default async function page() {
  if (await anyValidToken()) {
    return redirect("/profile");
  }
  return <VerifyOtp />;
}

export const metadata = {
  title: "Verify OTP",
  description: "Verify your OTP to access your account",
};