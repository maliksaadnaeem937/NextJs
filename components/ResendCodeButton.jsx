"use client";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
export default function ResendCodeButton({ email, loading: initialLoading }) {
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (!email) return toast.error("Email not found");
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/resend-code`, { email });
      toast.success("Verification code sent to your email");
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        toast.error(error?.response?.data?.error || "Failed to resend code");
      } else if (err.request) {
        // Request was made but no response received
        toast.error("No response from server. Please try again later.");
      } else {
        // Something else happened while setting up the request
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
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
