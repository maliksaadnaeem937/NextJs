"use client";
import { useState, useRef } from "react";
import { Pencil, UploadCloud, X } from "lucide-react";
import { profileImageUrl } from "@lib/globalVariables";

export default function ProfileImageUploader({ currentImage, onUpload }) {
  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setPreview(URL.createObjectURL(selected));
      setFile(selected);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setPreview(null);
    setFile(null);
  };

  const handleSave = () => {
    if (file) {
      onUpload(file);
    }
    setEditing(false);
  };

  return (
    <div className="relative w-full max-w-[180px] mx-auto text-center pt-2">
      {/* Profile Image */}
      <div className="relative">
        <img
          src={
            preview || currentImage || profileImageUrl || "/default-avatar.png"
          }
          alt="Profile"
          className="w-36 h-36 sm:w-40 sm:h-40 rounded-full object-cover border-[4px] border-blue-500 shadow-lg mx-auto"
        />

        {/* Edit Button */}
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="absolute bottom-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition"
            title="Edit"
          >
            <Pencil size={16} className="text-blue-600" />
          </button>
        )}
      </div>

      {/* Upload Controls */}
      {editing && (
        <div className="mt-4 flex flex-col items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />

          <button
            onClick={() => fileInputRef.current.click()}
            className="text-sm text-blue-600 underline hover:text-blue-800 transition"
          >
            Choose new image
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full text-sm transition"
            >
              <UploadCloud size={16} /> Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-1.5 rounded-full text-sm transition"
            >
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
