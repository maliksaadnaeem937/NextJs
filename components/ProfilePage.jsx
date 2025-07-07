"use client";

import React, { useEffect, useState } from "react";
import axios from "@lib/axios";
import LogoutButton from "@components/LogoutButton";
import Loading from "src/app/loading";
import { asyncHandler } from "@lib/asyncHandler";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      const [err, res] = await asyncHandler(axios.get("/protected/profile"));

      if (res) {
        setProfile(res.data?.user);
      }
      setLoading(false);
    }

    fetchProfile();
  }, []);

  if (loading) return <Loading />;

  if (!profile) {
    // No profile and not loading means request failed but interceptor redirected
    // So you can return null or a message if you want (won't show long)
    return null;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Profile Page</h2>
        <p className="text-gray-600 text-center">This is your profile page.</p>
        <div className="mt-6">
          <p className="text-gray-800 font-semibold">User Details:</p>
          <ul className="list-disc list-inside text-gray-700">
            <li>Name: {profile.name}</li>
            <li>Email: {profile.email}</li>
          </ul>
          <div className="text-center mt-4">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
