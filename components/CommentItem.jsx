"use client";

import { profileImageUrl } from "@lib/globalVariables";

export default function CommentItem({ comment }) {
  return (
    <div
      className="p-1 border rounded-xl mb-2 bg-gray-50"
  
    >
      <div className="flex items-center gap-2">
        <img
          src={comment.user.profilePic || profileImageUrl}
          alt="User"
          className="w-8 h-8 rounded-full object-cover border"
        />
        <div>
          <p className="text-xs font-medium">{comment.user.name}</p>
          <p className="text-xs text-gray-700">{comment.text}</p>
        </div>
      </div>
    </div>
  );
}
