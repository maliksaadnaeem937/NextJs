// components/LikeButton.js

"use client";
import { useState } from "react";
import { Heart } from "lucide-react";

export default function LikeButton({ postId, initialLikes = [] }) {
  const [likes, setLikes] = useState(initialLikes.length);
  const [liked, setLiked] = useState(false); 

  const handleLike = () => {
    // 👇 Add actual API request logic here
    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
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
