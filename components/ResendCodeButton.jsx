"use client";
import { useState } from "react";
import axios from "@lib/axios";
import { asyncHandler } from "@lib/asyncHandler";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL||"https://next-js-one-ivory.vercel.app/api";
export default function ResendCodeButton({ email, loading: initialLoading }) {
  const [loading, setLoading] = useState(false);

const handleResend = async () => {
  if (!email) return toast.error("Email not found");

  setLoading(true);
  const toastId = toast.loading("Resending code...");

  const [error, res] = await asyncHandler(
    axios.post(`${API_URL}/auth/resend-code`, { email })
  );

  toast.dismiss(toastId);

  if (error) {
    if (error.response) {
      toast.error(error.response.data?.error || "Failed to resend code");
    } else if (error.request) {
      toast.error("No response from server. Please try again later.");
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  } else {
    toast.success("Verification code sent to your email ✅");
  }

  setLoading(false);
};


  return (
    <button
      onClick={handleResend}
      disabled={loading || initialLoading}
      className={`mt-4 text-blue-600 font-medium hover:underline disabled:opacity-50 ${
        !loading && !initialLoading ? "cursor-pointer" : "cursor-not-allowed"
      }`}
    >
      {loading ? "Sending..." : "Resend Verification Code"}
    </button>
  );
}
