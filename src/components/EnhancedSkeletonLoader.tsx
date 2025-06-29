import React from 'react';

interface EnhancedSkeletonLoaderProps {
  variant?: 'news-card' | 'news-list' | 'weather' | 'ticker' | 'custom';
  count?: number;
  className?: string;
  animate?: boolean;
}

export default function EnhancedSkeletonLoader({ 
  variant = 'news-card', 
  count = 1, 
  className = '',
  animate = true 
}: EnhancedSkeletonLoaderProps) {
  const baseClasses = `bg-gray-300 dark:bg-gray-600 rounded ${animate ? 'animate-pulse' : ''}`;

  const renderNewsCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-4">
        {/* Image skeleton */}
        <div className={`${baseClasses} w-16 h-16 flex-shrink-0`}></div>
        
        {/* Content skeleton */}
        <div className="flex-1 space-y-2">
          {/* Tags skeleton */}
          <div className="flex gap-2">
            <div className={`${baseClasses} h-5 w-16`}></div>
            <div className={`${baseClasses} h-5 w-20`}></div>
            <div className={`${baseClasses} h-5 w-12`}></div>
          </div>
          
          {/* Title skeleton */}
          <div className={`${baseClasses} h-6 w-3/4`}></div>
          <div className={`${baseClasses} h-6 w-1/2`}></div>
          
          {/* Description skeleton */}
          <div className={`${baseClasses} h-4 w-full`}></div>
          <div className={`${baseClasses} h-4 w-4/5`}></div>
          <div className={`${baseClasses} h-4 w-2/3`}></div>
          
          {/* Actions skeleton */}
          <div className="flex justify-between items-center pt-2">
            <div className={`${baseClasses} h-4 w-24`}></div>
            <div className="flex gap-2">
              <div className={`${baseClasses} w-8 h-8 rounded-full`}></div>
              <div className={`${baseClasses} w-8 h-8 rounded-full`}></div>
              <div className={`${baseClasses} w-8 h-8 rounded-full`}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNewsList = () => (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
          <div className={`${baseClasses} w-12 h-12 rounded-lg flex-shrink-0`}></div>
          <div className="flex-1 space-y-2">
            <div className={`${baseClasses} h-4 w-3/4`}></div>
            <div className={`${baseClasses} h-3 w-1/2`}></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderWeather = () => (
    <div className="flex items-center gap-2">
      <div className={`${baseClasses} w-8 h-8 rounded-full`}></div>
      <div className="space-y-1">
        <div className={`${baseClasses} h-4 w-12`}></div>
        <div className={`${baseClasses} h-3 w-16`}></div>
      </div>
    </div>
  );

  const renderTicker = () => (
    <div className="flex items-center gap-4 py-2">
      <div className={`${baseClasses} h-4 w-32`}></div>
      <div className={`${baseClasses} h-4 w-24`}></div>
      <div className={`${baseClasses} h-4 w-28`}></div>
      <div className={`${baseClasses} h-4 w-20`}></div>
    </div>
  );

  const renderVariant = () => {
    switch (variant) {
      case 'news-card':
        return renderNewsCard();
      case 'news-list':
        return renderNewsList();
      case 'weather':
        return renderWeather();
      case 'ticker':
        return renderTicker();
      default:
        return renderNewsCard();
    }
  };

  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={count > 1 ? 'mb-4' : ''}>
          {renderVariant()}
        </div>
      ))}
    </div>
  );
}