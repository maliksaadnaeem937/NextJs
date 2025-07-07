"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import Loading from "src/app/loading";
import LogoutButton from "@components/LogoutButton";
import { fetchData } from "@lib/fetchData";
import ErrorMessage from "./ErrorMessage";

export default function ProfilePage() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["profile", "get", "/protected/profile"],
    queryFn: fetchData,
    retry: false,
  });

  if (isLoading) return <Loading />;
  if (error) {
    return <ErrorMessage message={error?.response?.data?.error}></ErrorMessage>;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Profile Page</h2>
        <p className="text-gray-600 text-center">This is your profile page.</p>
        <div className="mt-6">
          <p className="text-gray-800 font-semibold">User Details:</p>
          <ul className="list-disc list-inside text-gray-700">
            <li>Name: {data.name}</li>
            <li>Email: {data.email}</li>
          </ul>
          <div className="text-center mt-4">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
