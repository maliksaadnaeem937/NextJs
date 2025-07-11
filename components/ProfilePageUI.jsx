import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileImageUploader from "./ImageComponent";
import EditableField from "./EditableField";
import LogoutButton from "./LogoutButton";
import { updateProfile } from "@lib/handleProfileUpdate";
import { profileImageUrl } from "@lib/globalVariables";
import SearchUsers from "./SearchUsers";

export default function ProfilePageUI({ user, editable }) {
  const router = useRouter();
  const [bio, setBio] = useState(user?.bio || "No Bio Yet!");
  const [techStack, setTechStack] = useState(
    Array.isArray(user?.techStack) && user.techStack.length > 0
      ? user.techStack.join(", ")
      : "Nothing Added Yet!"
  );

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

  const handleTechStackUpdate = async (newTechStack) => {
    const techStackArray = newTechStack
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    const success = await updateProfile({ techStack: techStackArray });
    if (success) {
      setTechStack(newTechStack);
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
          editable={editable}
        />

        {/* Profile Info */}
        <div className="w-full">
          {/* Name */}
          <h2 className="text-3xl font-extrabold text-gray-800 mb-4 text-center sm:text-left">
            {user?.name || "Anonymous User"}
          </h2>

          <div className="mt-2 inline-flex items-center gap-2 text-sm">
            {user?.isVerified ? (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                ✅ Verified Account
              </span>
            ) : (
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
                ❌ Not Verified
              </span>
            )}
          </div>

          {/* Bio */}
          <div className="mb-6">
            <EditableField
              label="Bio"
              value={bio}
              onSave={handleBioUpdate}
              editable={editable}
            />
          </div>

          {/* Tech Stack */}
          <div className="mb-6">
            <EditableField
              label="Tech Stack"
              value={techStack}
              onSave={handleTechStackUpdate}
              editable={editable}
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-gray-200 border-2" />

      {/* Conditionally render SearchUsers & LogoutButton */}
      {editable && (
        <>
          <div className="flex justify-center sm:justify-end">
            <SearchUsers />
          </div>

          <div className="my-6 border-t border-gray-200" />

          <div className="flex justify-center sm:justify-end">
            <LogoutButton />
          </div>
        </>
      )}
    </div>
  );
}
