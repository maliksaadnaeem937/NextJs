"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import EditPostButton from "./EditPostButton";
import { handleCreatePost } from "@lib/handlePostOperations";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function CreatePostForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const onCreatePost = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (await handleCreatePost(title, content)) {
      setContent("");
      setTitle("");
      queryClient.invalidateQueries({ queryKey: ["get-my-posts"] });
      queryClient.invalidateQueries({ queryKey: ["get-all-posts"] });
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={onCreatePost}
      className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-md border mt-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800">Create New Post</h2>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter post title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 text-sm h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write your post content here..."
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-medium transition disabled:opacity-50 flex items-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Saving...
          </>
        ) : (
          "Save"
        )}
      </button>
    </form>
  );
}
