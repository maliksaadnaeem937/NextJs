// components/CommentBox.jsx
"use client";
import { useState } from "react";
import { SendHorizonal } from "lucide-react";
import { handleCommentSubmit } from "@lib/CommentOperations";
import { useQueryClient } from "@tanstack/react-query";

export default function CommentBox({ postId }) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const handleSubmit = async (e) => {
    console.log("submitting");
    setLoading(true);
    if (await handleCommentSubmit(postId, comment)) {
      setComment("");
      queryClient.invalidateQueries({
        queryKey: ["get-comments"],
      });
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center border rounded-full px-4 py-2 shadow-sm bg-white gap-2 mt-2">
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="flex-1 outline-none text-sm placeholder-gray-400"
        placeholder="Write a comment"
        disabled={loading}
        autoFocus={true}
      />
      <button
        onClick={handleSubmit}
        type="submit"
        disabled={loading || !comment.trim()}
        className="text-blue-600 hover:text-blue-800 transition disabled:opacity-50"
        title="Post comment"
      >
        <SendHorizonal size={18} />
      </button>
    </div>
  );
}
