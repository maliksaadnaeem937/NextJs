"use client";
import { useState } from "react";
import { SendHorizonal } from "lucide-react";

export default function CommentBox({ onSubmit, loading = false }) {
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    await onSubmit(comment.trim());
    setComment("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center border rounded-full px-4 py-2 shadow-sm bg-white gap-2"
    >
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="flex-1 outline-none text-sm placeholder-gray-400"
        placeholder="Write a comment..."
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !comment.trim()}
        className="text-blue-600 hover:text-blue-800 transition disabled:opacity-50"
        title="Post comment"
      >
        <SendHorizonal size={18} />
      </button>
    </form>
  );
}
