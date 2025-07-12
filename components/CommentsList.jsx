// components/CommentsList.js
import React from "react";

export default function CommentsList({ comments }) {
  if (!comments || comments.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic mt-2">No comments yet.</p>
    );
  }

  return (
    <div className="mt-3 space-y-3">
      {comments.map((comment) => (
        <div
          key={comment._id}
          className="p-3 bg-gray-50 border rounded-xl shadow-sm"
        >
          <div className="flex items-center gap-2 mb-1">
            <img
              src={comment.user?.profilePic || "/default-avatar.png"}
              className="w-7 h-7 rounded-full object-cover"
              alt="Avatar"
            />
            <p className="text-sm font-medium text-gray-700">
              {comment.user?.name}
            </p>
          </div>
          <p className="text-sm text-gray-800">{comment.text}</p>
        </div>
      ))}
    </div>
  );
}
