"use client";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://next-js-one-ivory.vercel.app/api";
import { asyncHandler } from "@lib/asyncHandler";
import axios from "@lib/axios";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const { email, password } = formData;
    const passRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters with 1 uppercase, 1 number, and 1 special character"
      );
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    const toastId = toast.loading("Logging in...");
    const [error, res] = await asyncHandler(
      axios.post("/auth/login", formData)
    );

    if (error) {
      if (error.response) {
        toast.error(error.response.data?.error || "Login failed.", {
          id: toastId,
        });
      } else if (error.request) {
        toast.error("No response from server. Try again later.", {
          id: toastId,
        });
      } else {
        toast.error("Unexpected error occurred.", { id: toastId });
      }
    } else {
      if (res.status === 200) {
        toast.success(res.data?.message || "Login successful! ✅", {
          id: toastId,
        });
        setTimeout(() => {
          window.location.href = "/profile";
        }, 2000);
      } else {
        toast.error(res.data?.error || "Login failed. Try again.", {
          id: toastId,
        });
      }
    }
    setLoading(false);
    setFormData({ email: "", password: "" });
    e.target.reset();
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
          Welcome Back
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              required
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200 ${
              !loading ? "cursor-pointer" : "cursor-not-allowed"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link href={"/"} className="text-blue-600 font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </section>
  );
}
