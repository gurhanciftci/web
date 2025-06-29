import React, { useState, useCallback } from 'react';

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function ImageWithFallback({ 
  src, 
  alt, 
  className = '', 
  fallbackClassName = '',
  onLoad,
  onError 
}: ImageWithFallbackProps) {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [imageSrc, setImageSrc] = useState(src);

  const handleLoad = useCallback(() => {
    setImageState('loaded');
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setImageState('error');
    onError?.();
    
    // Try fallback image sources
    if (imageSrc === src) {
      // Try a different image service or placeholder
      setImageSrc('https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=400');
    }
  }, [src, imageSrc, onError]);

  if (!src || imageState === 'error') {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${fallbackClassName || className}`}>
        <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <>
      {imageState === 'loading' && (
        <div className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}>
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} ${imageState === 'loaded' ? 'block' : 'hidden'}`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </>
  );
}