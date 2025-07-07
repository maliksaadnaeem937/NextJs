"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
const API_URL = process.env.NEXT_PUBLIC_API_URL||"https://next-js-one-ivory.vercel.app/api";
export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      toast.success("Logged out successfully");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full shadow-md transition duration-200 text-sm sm:text-base ${
        loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
