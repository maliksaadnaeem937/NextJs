"use client";
import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { handleDeletePost } from "@lib/handlePostOperations";

export default function DeletePostButton({ postId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e) => {
    try {
      setLoading(true);
      const success = await handleDeletePost(postId);
      if (success) {
        router.refresh();
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-700 border border-red-500 rounded-full hover:bg-red-50 disabled:opacity-60 transition cursor-pointer"
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Trash2 size={16} />
      )}
    </button>
  );
}
