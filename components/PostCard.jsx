"use client";
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import CommentBox from "./CommentBox";
import ViewCommentsButton from "./ViewCommentsButton";
import EditablePostField from "./EditablePostField";
import { handleEditTitle, handleEditContent } from "@lib/handlePostOperations";
import DeletePostButton from "./DeletePostButton";
import { profileImageUrl } from "@lib/globalVariables";
import Link from "next/link";
import CommentList from "./CommentList";
import { handleCommentSubmit } from "@lib/CommentOperations";
export default function PostCard({ post, editable = true, currentUserId }) {
  console.log(post);
  const [postData, setPostData] = useState(post || {});
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);

  const toggleComments = () => setShowComments((prev) => !prev);

  const profileLink =
    currentUserId === post.user?._id ? "/profile" : `/users/${post.user?._id}`;

  const edited =
    post.createdAt &&
    post.updatedAt &&
    new Date(post.createdAt).getTime() !== new Date(post.updatedAt).getTime();

  const onSubmitComment = async (text) => {
    const newComment = await handleCommentSubmit(post._id, text);
    if (newComment) {
      setComments((prev) => [newComment, ...prev]);
      setShowComments(true);
    }
  };
  const onSubmitReply = async (parentId, text) => {
    const newReply = await handleCommentSubmit(post._id, text, parentId);
    if (newReply) {
      // Optional: update UI, reply count, etc.
    }
  };

  const handleTitleUpdate = async (updatedTitle) => {
    const success = await handleEditTitle(post._id, updatedTitle);
    if (success) {
      setPostData((prev) => {
        return { ...prev, title: updatedTitle };
      });
    }
  };
  const handleContentUpdate = async (updatedTitle) => {
    const success = await handleEditContent(post._id, updatedTitle);
    if (success) {
      setPostData((prev) => {
        return { ...prev, content: updatedTitle };
      });
    }
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 sm:p-6 mb-6 relative border border-gray-200 transition hover:shadow-lg">
      {/* Header */}
       {editable && <DeletePostButton postId={post._id} />}
      <div className="flex items-center gap-4 mb-4">
        <Link href={profileLink}>
          <img
            src={post.user?.profilePic || profileImageUrl}
            alt="Avatar"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-blue-500"
          />
        </Link>
        <div className="flex-1">
          <h4 className="text-sm sm:text-base font-semibold text-gray-800">
            {post.user?.name}
          </h4>
          <p className="text-xs text-gray-500">
            {edited ? <span>Edited </span> : <span>Created </span>}
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
          value={postData.title}
          onSave={handleTitleUpdate}
          editable={editable}
        />
        <EditablePostField
          label="Content"
          value={postData.content}
          onSave={handleContentUpdate}
          editable={editable}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row  sm:items-center sm:justify-between gap-3 mt-4">
        <div className="flex gap-3 flex-wrap">
          <LikeButton
            postId={post._id}
            initialLikes={post.likeCount}
            isLikedByMe={post.isLikedByMe}
          />
          <CommentButton onClick={() => setShowCommentInput((prev) => !prev)} />
          <ViewCommentsButton onClick={toggleComments} isOpen={showComments} />
         
        </div>
      </div>
      {/* Comment Input */}
      {showCommentInput && (
        <div className="mt-4 bg-gray-50 p-4 rounded-xl border">
          <CommentBox postId={post._id} />
        </div>
      )}

      {showComments && (
        <div className="mt-4">
          <CommentList
            postId={post._id}
            path="/protected/comments"
            queryKey="get-comments"
            method="get"
          />
        </div>
      )}
    </div>
  );
}
