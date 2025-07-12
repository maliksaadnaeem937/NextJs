"use client";
import { useState } from "react";
import { Pencil, X, Check } from "lucide-react";

export default function EditablePostField({
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

  const isContent = label?.toLowerCase() === "content";

  return (
    <div className="mb-3 group relative">
      {/* Edit Icon */}
      {!editing && editable && (
        <button
          onClick={() => setEditing(true)}
          className="absolute top-0 right-0 text-gray-900 opacity-100 hover:text-blue-600 transition"
          title={`Edit ${label}`}
        >
          <Pencil size={16} />
        </button>
      )}

      {/* Input/Editing Mode */}
      {editing ? (
        <div className="flex flex-col sm:flex-row sm:items-start sm:gap-2">
          {isContent ? (
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Edit ${label}`}
            />
          ) : (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Edit ${label}`}
            />
          )}

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
        <>
          {isContent ? (
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{value}</p>
          ) : (
            <h3 className="text-lg font-bold text-gray-900">{value}</h3>
          )}
        </>
      )}
    </div>
  );
}
