"use client";

import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

export default function EditPostButton({ postId, onEdit, loading }) {
  const router = useRouter();

  const handleEdit = () => {
    if (onEdit) {
      onEdit(postId);
    } else {
      router.push(`/edit-post/${postId}`);
    }
  };

  return (
    <button
      onClick={handleEdit}
      disabled={loading}
      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-500 rounded-full hover:bg-blue-50 transition"
    >
      <Pencil size={16} />
      Edit
    </button>
  );
}
