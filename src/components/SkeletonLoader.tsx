import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  lines?: number;
}

export default function SkeletonLoader({ className = '', lines = 3 }: SkeletonLoaderProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="flex items-start gap-4">
        {/* Image skeleton */}
        <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-lg flex-shrink-0"></div>
        
        {/* Content skeleton */}
        <div className="flex-1 space-y-2">
          {/* Tags skeleton */}
          <div className="flex gap-2">
            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded-full w-16"></div>
            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded-full w-20"></div>
          </div>
          
          {/* Title skeleton */}
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
          
          {/* Description skeleton */}
          {Array.from({ length: lines }).map((_, i) => (
            <div 
              key={i} 
              className={`h-4 bg-gray-300 dark:bg-gray-600 rounded ${
                i === lines - 1 ? 'w-1/2' : 'w-full'
              }`}
            ></div>
          ))}
          
          {/* Actions skeleton */}
          <div className="flex justify-between items-center pt-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}