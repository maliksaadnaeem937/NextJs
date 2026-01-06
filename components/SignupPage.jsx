"use client";
import { useState } from "react";
import Link from "next/link";
import axios from "@lib/axios";
import { asyncHandler } from "@lib/asyncHandler";
import toast from "react-hot-toast";
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://next-js-one-ivory.vercel.app/api";
export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, email, password } = formData;
  

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (name.trim().length < 3) {
      toast.error("Name must be at least 3 characters");
      return false;
    }
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!passRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters with 1 uppercase, 1 number, and 1 special character"
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const toastId = toast.loading("Signing up...");

    const [error, res] = await asyncHandler(
      axios.post(`${API_URL}/auth/register`, formData, {
        withCredentials: true,
      })
    );

    toast.dismiss(toastId);

    if (error) {
      if (error.response) {
        toast.error(error.response.data?.error || "Signup failed. Try again.");
      } else if (error.request) {
        toast.error("No response from server. Please try again later.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } else if (res?.status === 201) {
      toast.success(res.data?.message || "Signup successful! ✅");
      setTimeout(() => {
        window.location.href = "/verify-otp";
      }, 2000);
    } else {
      toast.error("Signup failed. Try again.");
    }

    setLoading(false);
    setFormData({ name: "", email: "", password: "" });
    e.target.reset();
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
          Create an Account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
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
            disabled={loading}
            type="submit"
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href={"/login"} className="text-blue-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
