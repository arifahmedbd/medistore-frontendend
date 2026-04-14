"use client";

export default function GlobalLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-500 border-gray-300"></div>
        <p className="text-gray-700 dark:text-gray-200 text-lg font-semibold">
          Please wait...
        </p>
      </div>
    </div>
  );
}