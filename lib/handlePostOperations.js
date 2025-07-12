import { makeAPICall } from "@lib/makeAPICall";
import toast from "react-hot-toast";

export async function handleEditTitle(postId, newTitle) {
  try {
    await toast.promise(
      makeAPICall({
        queryKey: [
          "edit-post-title",
          "patch",
          "/protected/posts",
          { postId, title: newTitle },
        ],
      }),
      {
        loading: "Updating title...",
        success: "Title updated successfully!",
        error: "Failed to update title",
      }
    );
    return true;
  } catch (err) {
    return false;
  }
}

export async function handleEditContent(postId, newContent) {
  try {
    await toast.promise(
      makeAPICall({
        queryKey: [
          "edit-post-content",
          "patch",
          "/protected/posts",
          { postId, content: newContent },
        ],
      }),
      {
        loading: "Updating content...",
        success: "Content updated successfully!",
        error: "Failed to update content",
      }
    );
    return true;
  } catch (err) {
    return false;
  }
}

export async function handleDeletePost(postId) {
  const confirmDelete = window.confirm("Are you sure you want to delete this post?");
  if (!confirmDelete) return false;

  try {
    await toast.promise(
      makeAPICall({
        queryKey: ["delete-post", "delete", "/protected/posts", { postId }],
      }),
      {
        loading: "Deleting Post...",
        success: "Post Deleted successfully!",
        error: "Failed to Delete Post",
      }
    );
    return true;
  } catch (err) {
    return false;
  }
}

export async function handleCreatePost(title, content) {
  if (!title.trim() || !content.trim()) {
    toast.error("Please fill in all fields.");
    return false;
  }
  if (title.trim().length > 120 || content.trim().length > 5000) {
    toast.error(
      "Title Length Should be less than 120 and Content should be less than 5000"
    );
    return false;
  }

  try {
    await toast.promise(
      makeAPICall({
        queryKey: ["create-post", "post", "/protected/posts", { title, content }],
      }),
      {
        loading: "Creating Post...",
        success: "Post Created successfully!",
        error: "Failed to Create Post",
      }
    );
    return true;
  } catch (err) {
    return false;
  }
}
