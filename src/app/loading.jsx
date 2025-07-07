"use client";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-white via-blue-100 to-blue-200 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4 animate-fadeIn">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-extrabold text-blue-700">Dev</span>
          <span className="text-2xl font-extrabold text-gray-800 animate-pulse">
            Connect
          </span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-loader-circle h-12 w-12 animate-spin text-blue-600"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        <p className="text-md sm:text-lg font-medium text-gray-700">
          Preparing your DevConnect experience...
        </p>
      </div>
    </div>
  );
}
