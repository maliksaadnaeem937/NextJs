"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import ResendCodeButton from "./ResendCodeButton";
import axios from  "@lib/axios";
import { asyncHandler } from "@lib/asyncHandler";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://next-js-one-ivory.vercel.app/api";
export default function VerifyOtp() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!email || !code) {
      toast.error("Email and code are required");
      return false;
    }
    if (code.length !== 6) {
      toast.error("Code must be 6 digits");
      return false;
    }
    return true;
  };

const handleVerify = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setLoading(true);
  const toastId = toast.loading("Verifying...");

  const [error, res] = await asyncHandler(
    axios.post("/auth/verify", { email, code })
  );

  if (error) {
    if (error.response) {
      toast.error(error.response.data?.error || "Verification failed.", { id: toastId });
    } else if (error.request) {
      toast.error("No response from server. Try again later.", { id: toastId });
    } else {
      toast.error("Unexpected error occurred. Try again.", { id: toastId });
    }
  } else {
    toast.success(res.data?.message || "Signup successful! ✅", { id: toastId });
    setTimeout(() => {
      window.location.href = "/profile";
    }, 2000);
  }

  setLoading(false);
  setEmail("");
  setCode("");
  e.target.reset();
};

  return (
    <div className="max-w-md mx-auto mt-12 bg-white rounded-2xl shadow-md p-8">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Verify Your Email
      </h2>
      <form onSubmit={handleVerify} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            required={true}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring focus:ring-blue-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Verification Code
          </label>
          <input
            type="text"
            required={true}
            maxLength="6"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring focus:ring-blue-200"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 6-digit code"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-200 ${
            !loading ? "cursor-pointer" : "cursor-not-allowed"
          }`}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
      <div className="mt-4 text-center">
        <ResendCodeButton email={email} loading={loading} />
      </div>
    </div>
  );
}
