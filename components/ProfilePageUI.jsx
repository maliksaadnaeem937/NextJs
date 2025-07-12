import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileImageUploader from "./ImageComponent";
import EditableField from "./EditableField";
import LogoutButton from "./LogoutButton";
import { updateProfile } from "@lib/handleProfileUpdate";
import { profileImageUrl } from "@lib/globalVariables";
import SearchUsers from "./SearchUsers";
import CreatePostForm from "./CreatePost";
import NavigationLink from "./NavigationLink.jsx";
import PostList from "./PostList";

export default function ProfilePageUI({ user, editable }) {
  const router = useRouter();
  const [bio, setBio] = useState(user?.bio || "No Bio Yet!");
  const [techStack, setTechStack] = useState(
    Array.isArray(user?.techStack) && user.techStack.length > 0
      ? user.techStack.join(", ")
      : "Nothing Added Yet!"
  );
  const [showPostModal, setShowPostModal] = useState(false);

  const toggleModal = () => setShowPostModal((prev) => !prev);
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
    <div className="max-w-4xl  mx-auto mt-10 md:p-6 p-1 bg-white rounded-2xl shadow-xl border border-gray-200">
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
      <NavigationLink text={"View All Posts"} path={"/home"}></NavigationLink>

      {/* Conditionally render SearchUsers & LogoutButton */}
      {editable && (
        <>
          {/* Create Post Button */}
          <div className="mt-6 flex justify-center mb-2">
            <button
              onClick={toggleModal}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2 rounded-full font-semibold shadow-lg transition-all"
            >
              ✍️ Create Post
            </button>
          </div>
          {/* Modal for CreatePostForm */}
          {showPostModal && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full relative p-6">
                {/* Close button */}
                <button
                  onClick={toggleModal}
                  className="absolute top-3 right-4 text-gray-600 hover:text-red-500 text-xl font-bold"
                >
                  &times;
                </button>

                {/* Render the Form Component */}
                <CreatePostForm onSuccess={toggleModal} />
              </div>
            </div>
          )}
        </>
      )}
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
      {editable && user?._id && (
        <PostList
          queryKey="get-my-posts"
          method="get"
          path="/protected/get-my-posts"
        />
      )}
    </div>
  );
}
