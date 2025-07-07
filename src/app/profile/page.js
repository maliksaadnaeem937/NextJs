import React from "react";
import { getAuthenticatedUser } from "@lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@components/LogoutButton";
export default async function page() {
  const user = await getAuthenticatedUser();
  console.log("Authenticated User:", user);
  if (!user) {
    redirect("/login");
  }
  // Render the profile page if the user is authenticated

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Profile Page</h2>
        <p className="text-gray-600 text-center">This is your profile page.</p>
        <div className="mt-6">
          <p className="text-gray-800 font-semibold">User Details:</p>
          <ul className="list-disc list-inside text-gray-700">
            <li>Name: {user.name}</li>
            <li>Email: {user.email}</li>
            {/* Add more user details as needed */}
          </ul>
          <div className="text-center mt-1">
            <LogoutButton></LogoutButton>
          </div>
        </div>
      </div>
    </div>
  );
}
