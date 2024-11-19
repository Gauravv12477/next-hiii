// app/loading.tsx
"use-client"

export default function Loading() {
    return (
        <div className="flex items-center justify-center w-full h-screen bg-gray-50">
        <div className="space-y-6 w-full max-w-md mx-auto">
          {/* Header Skeleton */}
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
  
          {/* Main Image Skeleton */}
          <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
  
          {/* Title Skeleton */}
          <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
  
          {/* Paragraph Skeleton */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
          </div>
  
          {/* Button Skeleton */}
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }
  