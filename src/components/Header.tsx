import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import EnhancedHulyNewsLogo from './EnhancedHulyNewsLogo';
import BrandAnalysisReport from './BrandAnalysisReport';

interface HeaderProps {
  onPageChange?: (page: 'news' | 'favorites') => void;
  currentPage?: 'news' | 'favorites';
  onOpenPreferences?: () => void;
}

export default function Header({ onPageChange, currentPage = 'news', onOpenPreferences }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();
  const [showBrandAnalysis, setShowBrandAnalysis] = useState(false);

  return (
    <>
      <header className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white shadow-2xl relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="container mx-auto px-4 py-6 relative z-10">
          <div className="flex items-center justify-between">
            {/* Enhanced Logo Section */}
            <div className="flex items-center gap-6">
              <div className="group cursor-pointer relative" onClick={() => setShowBrandAnalysis(true)}>
                {/* Logo with enhanced visibility */}
                <div className="relative">
                  <EnhancedHulyNewsLogo 
                    className="w-20 h-20 md:w-24 md:h-24" 
                    variant="animated" 
                    showTagline={false}
                    size="large"
                  />
                  
                  {/* Enhanced glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                  
                  {/* Pulsing ring effect */}
                  <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-full animate-ping opacity-0 group-hover:opacity-100"></div>
                </div>
                
                {/* Enhanced tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap border border-cyan-400/30 shadow-xl">
                  <div className="flex items-center gap-2">
                    <span>🎨</span>
                    <span>Marka analizini görüntüle</span>
                  </div>
                  {/* Tooltip arrow */}
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 border-l border-t border-cyan-400/30 rotate-45"></div>
                </div>
              </div>
              
              {/* Enhanced Brand Text */}
              <div className="hidden sm:block">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent drop-shadow-lg">
                  Huly News
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <p className="text-blue-200 dark:text-gray-300 text-sm flex items-center gap-2">
                    <span className="inline-flex items-center gap-1">
                      🤖 AI Destekli Finans Platformu
                    </span>
                    <span className="w-1 h-1 bg-blue-300 rounded-full"></span>
                    <span className="text-xs opacity-75 font-medium">Akıllı Finans • Güvenilir Analiz</span>
                  </p>
                  
                  {/* Live indicator */}
                  <div className="flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded-full border border-green-400/30">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-200 font-medium">CANLI</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            {onPageChange && (
              <nav className="flex items-center gap-4">
                <button
                  onClick={() => onPageChange('news')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    currentPage === 'news'
                      ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30'
                      : 'text-blue-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  Haberler
                </button>
                <button
                  onClick={() => onPageChange('favorites')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    currentPage === 'favorites'
                      ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30'
                      : 'text-blue-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Favoriler
                </button>
              </nav>
            )}
            
            <div className="flex items-center gap-4">
              {/* AI Status with enhanced visibility */}
              <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-green-400/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-200 font-medium">AI Aktif</span>
              </div>

              {/* Enhanced Brand Analysis Button */}
              <button
                onClick={() => setShowBrandAnalysis(true)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm group border border-white/20 hover:border-cyan-400/50"
                aria-label="Marka analizi"
                title="Marka Analizi"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </button>

              {/* Preferences Button */}
              {onOpenPreferences && (
                <button
                  onClick={onOpenPreferences}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/20"
                  aria-label="Kullanıcı tercihleri"
                  title="Tercihler (P)"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              )}
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/20"
                aria-label="Tema değiştir"
                title="Tema değiştir (T)"
              >
                {isDark ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              
              {/* Enhanced Date and Time */}
              <div className="text-right hidden lg:block">
                <div className="text-sm text-blue-200 dark:text-gray-300 font-medium">
                  {new Date().toLocaleDateString('tr-TR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="text-xs text-blue-300 dark:text-gray-400 mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 shadow-lg"></div>
      </header>

      {/* Brand Analysis Modal */}
      <BrandAnalysisReport 
        isOpen={showBrandAnalysis} 
        onClose={() => setShowBrandAnalysis(false)} 
      />
    </>
  );
}