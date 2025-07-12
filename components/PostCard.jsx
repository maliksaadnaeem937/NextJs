"use client";
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import CommentBox from "./CommentBox";
import ViewCommentsButton from "./ViewCommentsButton";
import CommentsList from "./CommentsList";
import EditablePostField from "./EditablePostField";
import { handleEditTitle, handleEditContent } from "@lib/handlePostOperations";
import DeletePostButton from "./DeletePostButton";

export default function PostCard({ post, editable=true }) {
  console.log(post);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);

  const toggleComments = () => setShowComments((prev) => !prev);

  const edited = post.createdAt === post.updatedAt;
  const handleCommentSubmit = async (text) => {
    const newComment = {
      _id: Date.now(),
      text,
      user: {
        name: "You",
        profilePic: "/default-avatar.png",
      },
    };
    setComments((prev) => [...prev, newComment]);
    setShowComments(true);
  };

  const handleTitleUpdate = async (updatedTitle) => {
    await handleEditTitle(post._id, updatedTitle);
  };
  const handleContentUpdate = async (updatedTitle) => {
    await handleEditContent(post._id, updatedTitle);
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 sm:p-6 mb-6 border border-gray-200 transition hover:shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={post.user?.profilePic || "/default-avatar.png"}
          alt="Avatar"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-blue-500"
        />
        <div className="flex-1">
          <h4 className="text-sm sm:text-base font-semibold text-gray-800">
            {post.user?.name}
          </h4>
          <p className="text-xs text-gray-500">
            {edited && <span>Edited </span>}
            {!edited
              ? formatDistanceToNow(new Date(post.createdAt))
              : formatDistanceToNow(new Date(post.updatedAt))}{" "}
            ago
          </p>
        </div>
      </div>

      {/* Title & Content */}
      <div className="mb-3">
        <EditablePostField
          label="Title"
          value={post.title}
          onSave={handleTitleUpdate}
          editable={editable}
        />
        <EditablePostField
          label="Content"
          value={post.content}
          onSave={handleContentUpdate}
          editable={editable}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row  sm:items-center sm:justify-between gap-3 mt-4">
        <div className="flex gap-3 flex-wrap">
          <LikeButton postId={post._id} initialLikes={post.likes} />
          <CommentButton onClick={() => setShowCommentInput((prev) => !prev)} />
          <ViewCommentsButton onClick={toggleComments} isOpen={showComments} />
          {editable && <DeletePostButton postId={post._id} />}
        </div>
      </div>
      {/* Comment Input */}
      {showCommentInput && (
        <div className="mt-4 bg-gray-50 p-4 rounded-xl border">
          <CommentBox onSubmit={handleCommentSubmit} />
        </div>
      )}

      {/* Comments List */}
      {showComments && (
        <div className="mt-4">
          <CommentsList comments={comments} />
        </div>
      )}
    </div>
  );
}
