// app/loading.tsx
"use-client"

export default function Loading() {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-500 border-solid" />
        <p className="mt-4 text-blue-700">Loading...</p>
      </div>
    );
  }
  