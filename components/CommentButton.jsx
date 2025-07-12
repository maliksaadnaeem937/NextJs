// components/CommentButton.js

import { MessageCircle } from "lucide-react";

export default function CommentButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
    >
      <MessageCircle size={16} />
      Comment
    </button>
  );
}
