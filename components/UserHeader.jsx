"use client";
import EditableField from "./EditableField";
import { useRouter } from "next/navigation";
import { updateProfile } from "@lib/handleProfileUpdate";
import { useState } from "react";
export default function UserHeader({ user }) {
  const router = useRouter();
  const [bio, setBio] = useState(user?.bio || "No Bio Yet!");
  const handleBioUpdate = async (newBio) => {
    const success = await updateProfile({ bio: newBio });
    if (success) {
      setBio(newBio);
      router.refresh();
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 w-full">
      {/* Name */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6">
        {user?.name || "Anonymous User"}
      </h2>
      {/* Bio Section */}
      <div className="mb-6">
        <EditableField label="Bio" value={bio} onSave={handleBioUpdate} />
      </div>
    </div>
  );
}
