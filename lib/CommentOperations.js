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

