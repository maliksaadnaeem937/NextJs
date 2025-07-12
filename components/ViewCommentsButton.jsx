// components/ViewCommentsButton.js
"use client";
import React from "react";
import { MessageSquareText } from "lucide-react";

export default function ViewCommentsButton({ onClick, isOpen }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-sm text-blue-600 hover:underline transition"
    >
      <MessageSquareText size={16} />
      {isOpen ? "Hide Comments" : "View Comments"}
    </button>
  );
}
