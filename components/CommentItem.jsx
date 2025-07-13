"use client";

import { profileImageUrl } from "@lib/globalVariables";
import { Pencil, Trash2, Save, X } from "lucide-react";
import { handleCommentDelete } from "@lib/CommentOperations";
import { useState } from "react";
import { handleCommentEdit } from "@lib/CommentOperations";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
export default function CommentItem({ comment, currentUserId }) {
  const editable = currentUserId === comment.user._id.toString();
  console.log("Comment is editable", editable);
  const [commentText, setCommentText] = useState(comment.text || "");
  const [openEditBox, setOpenEditBoxt] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const onCommentDelete = async () => {
    if (await handleCommentDelete(comment._id)) {
      queryClient.invalidateQueries({
        queryKey: ["get-comments"],
      });
    }
  };
  const onSaveComment = async () => {
    setLoading(true);
    if (await handleCommentEdit(comment._id, commentText)) {
      queryClient.invalidateQueries({
        queryKey: ["get-comments"],
      });
    }
    setLoading(false);
  };

  return (
    <div className="relative p-4 border rounded-lg bg-white shadow-sm mb-3 group hover:shadow-md transition-all">
      {/* Delete Button */}
      {editable && (
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
          onClick={onCommentDelete}
        >
          <Trash2 size={14} />
        </button>
      )}
      {/* Edit Toggle Button */}
      {editable && (
        <button
          className="absolute bottom-2 right-2 text-gray-400 hover:text-blue-500 transition"
          onClick={() => setOpenEditBoxt(!openEditBox)}
        >
          {openEditBox ? <X size={14} /> : <Pencil size={14} />}
        </button>
      )}

      {/* User Info & Comment Content */}
      <div className="flex items-start gap-3">
        <img
          src={comment.user.profilePic || profileImageUrl}
          alt="User"
          className="w-9 h-9 rounded-full object-cover border border-gray-200"
        />
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800 mb-1">
            {comment.user.name}
          </p>

          {openEditBox ? (
            <>
              <textarea
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-500 resize-none"
                rows={3}
                autoFocus
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button
                className="mt-2 flex items-center gap-1 text-sm text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-md transition"
                disabled={loading}
                onClick={onSaveComment}
              >
                <Save size={14} />

                {loading ? <span>Saving</span> : <span>Save</span>}
              </button>
            </>
          ) : (
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {commentText}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
