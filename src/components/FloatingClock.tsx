import React, { useState, useEffect } from 'react';
import WeatherWidget from './WeatherWidget';

export default function FloatingClock() {
  const [time, setTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed top-4 right-4 z-50 md:hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 shadow-lg border border-gray-200 dark:border-gray-700"
        aria-label="Toggle clock visibility"
      >
        <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Clock Widget */}
      <div className={`fixed top-4 right-4 z-40 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
      } ${
        // Responsive positioning
        'md:opacity-100 md:translate-y-0 md:pointer-events-auto'
      }`}>
        <div className="flex items-center gap-4">
          {/* Clock - Left side */}
          <div className="text-center border-r border-gray-300 dark:border-gray-600 pr-4">
            <div className="text-lg font-bold text-gray-900 dark:text-white font-mono">
              {formatTime(time)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {formatDate(time)}
            </div>
          </div>
          
          {/* Weather - Right side */}
          <div className="text-gray-900 dark:text-white">
            <WeatherWidget />
          </div>
        </div>
      </div>
    </>
  );
}