import React from 'react';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Global News</h1>
            <p className="text-blue-200 text-sm mt-1">Küresel Haber Uygulaması</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-200">
              {new Date().toLocaleDateString('tr-TR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="text-xs text-blue-300 mt-1">
              Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}