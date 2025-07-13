import toast from "react-hot-toast";
import { makeAPICall } from "./makeAPICall";
export async function handleCommentSubmit(postId, text, parentComment = null) {
  if (!text.trim()) {
    toast.error("Comment cannot be empty.");
    return false;
  }

  try {
    const newComment = await toast.promise(
      makeAPICall({
        queryKey: [
          "add-comment",
          "post",
          `/protected/comments/${postId}`,
          { text },
        ],
      }),
      {
        loading: "Posting comment...",
        success: "Comment posted!",
        error: "Failed to post comment",
      }
    );
    return newComment;
  } catch (err) {
    return false;
  }
}

export async function handleCommentDelete(commentId) {
  try {
    await toast.promise(
      makeAPICall({
        queryKey: [
          "delete-comment",
          "delete",
          `/protected/comments/${commentId}`,
        ],
      }),
      {
        loading: "Deleting comment...",
        success: "Comment Deleted!",
        error: "Failed to delete comment",
      }
    );
    return true;
  } catch (err) {
    return false;
  }
}

export async function handleCommentEdit(commentId, text) {
  if (!text.trim()) {
    toast.error("Comment cannot be empty.");
    return false;
  }

  try {
    await toast.promise(
      makeAPICall({
        queryKey: [
          "edit-comment",
          "patch",
          `/protected/comments/${commentId}`,
          { text },
        ],
      }),
      {
        loading: "Editing comment...",
        success: "Comment Edited!",
        error: "Failed to edit comment",
      }
    );
    return true;
  } catch (err) {
    return false;
  }
}
