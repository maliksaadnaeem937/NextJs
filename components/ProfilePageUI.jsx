import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileImageUploader from "./ImageComponent";
import EditableField from "./EditableField";
import LogoutButton from "./LogoutButton";
import { updateProfile } from "@lib/handleProfileUpdate";
import { profileImageUrl } from "@lib/globalVariables";

export default function ProfilePageUI({ user }) {
  const router = useRouter();
  const [bio, setBio] = useState(user?.bio || "No Bio Yet!");
  const [profileImage, setProfileImage] = useState(
    user?.profilePic || profileImageUrl
  );

  const handleBioUpdate = async (newBio) => {
    const success = await updateProfile({ bio: newBio });
    if (success) {
      setBio(newBio);
      router.refresh();
    }
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("profileImage", file);
    const success = await updateProfile(
      formData,
      true,
      "/protected/profileImage"
    );
    if (success) {
      const newImageUrl = URL.createObjectURL(file);
      setProfileImage(newImageUrl);
      router.refresh();
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl border border-gray-200">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start items-center gap-6">
        {/* Profile Image */}
        <ProfileImageUploader
          currentImage={profileImage || profileImageUrl}
          onUpload={handleImageUpload}
        />

        {/* Profile Info */}
        <div className="w-full">
          {/* Name */}
          <h2 className="text-3xl font-extrabold text-gray-800 mb-4 text-center sm:text-left">
            {user?.name || "Anonymous User"}
          </h2>

          {/* Bio Section */}
          <div className="mb-6">
            <EditableField label="Bio" value={bio} onSave={handleBioUpdate} />
          </div>

          {/* Additional Info (Optional Add-ons) */}
          {/* <div className="mb-4">
            <EditableField label="Role" value={user?.role || ""} onSave={handleRoleUpdate} />
          </div> */}
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-gray-200" />

      {/* Footer Actions */}
      <div className="flex justify-center sm:justify-end">
        <LogoutButton />
      </div>
    </div>
  );
}

