// components/LikeButton.js

"use client";
import { useState } from "react";
import { Heart } from "lucide-react";
import { handleLikePost } from "@lib/handlePostOperations";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
export default function LikeButton({ postId, initialLikes, isLikedByMe }) {
  const queryClient=useQueryClient();
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(isLikedByMe);

  const handleLike = async () => {
    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    const success = await handleLikePost(postId);
    if (success) {
      queryClient.invalidateQueries({ queryKey: ["get-my-posts"],})
      queryClient.invalidateQueries({ queryKey: ["get-all-posts"],})
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full transition ${
        liked ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
      } hover:bg-red-200`}
    >
      <Heart size={16} className={liked ? "fill-red-600" : ""} />
      {likes}
    </button>
  );
}
