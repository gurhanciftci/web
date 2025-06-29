import React, { useState, useEffect } from 'react';

export default function FloatingClock() {
  const [time, setTime] = useState(new Date());

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
    <div className="fixed top-4 right-4 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 min-w-[140px]">
      <div className="text-center">
        <div className="text-lg font-bold text-gray-900 dark:text-white font-mono">
          {formatTime(time)}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {formatDate(time)}
        </div>
      </div>
    </div>
  );
}