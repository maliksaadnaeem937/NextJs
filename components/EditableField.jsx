"use client";
import { useState } from "react";
import { Pencil, X, Check } from "lucide-react";

export default function EditableField({
  label,
  value,
  onSave,
  editable = true,
}) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");

  const handleCancel = () => {
    setEditing(false);
    setInputValue(value);
  };

  const handleSave = () => {
    onSave(inputValue);
    setEditing(false);
  };

  return (
    <div className="mt-6 p-4 border rounded-2xl shadow-sm bg-white transition-all duration-300">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-medium text-gray-500 tracking-wide uppercase">
          {label}
        </p>

        {/* ✏️ Only show edit button if editable */}
        {!editing && editable && (
          <button
            onClick={() => setEditing(true)}
            className="text-gray-400 hover:text-blue-600 transition"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
        )}
      </div>

      {/* 🧾 Show input when editing */}
      {editing ? (
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mt-2 w-full">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full sm:flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <div className="flex gap-2 mt-2 sm:mt-0">
            <button
              onClick={handleSave}
              className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
              title="Save"
            >
              <Check size={16} />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 rounded-full bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
              title="Cancel"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-700 mt-1">
          {value || (
            <span className="text-gray-400 italic">
              No {label.toLowerCase()} yet
            </span>
          )}
        </p>
      )}
    </div>
  );
}
