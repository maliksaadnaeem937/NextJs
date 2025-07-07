"use client";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import ResendCodeButton from "./ResendCodeButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
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

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/auth/verify`,
        { email, code },
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success(
          res.data?.message || "Signup successful! Login to Continue ✅"
        );
        setTimeout(() => {
          window.location.href = "/profile";
        }, 2000);
      } else {
        toast.error(res.data?.error || "Verification failed. Try again.");
      }

      // Optionally redirect user here
    } catch (error) {
      console.log("Verification error:", error);
      if (error.response) {
        // Server responded with a status other than 2xx
        toast.error(
          error?.response?.data?.error || "Verification failed. Try again."
        );
      } else if (error.request) {
        // Request was made but no response received
        toast.error("No response from server. Please try again later.");
      } else {
        // Something else happened while setting up the request
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
      setEmail("");
      setCode("");
      e.target.reset();
    }
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
