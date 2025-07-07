"use client";

import React from "react";

export default function ErrorMessage({ message = "Something went wrong" }) {
  return (
    <div className="flex items-center justify-center h-screen px-4 text-center">
      <div className="bg-red-100 text-red-700 p-6 rounded-xl shadow-md max-w-md w-full">
        <h2 className="text-xl font-bold mb-2">⚠️ Error</h2>
        <p>{message}</p>
      </div>
    </div>
  );
}
