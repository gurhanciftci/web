import React from 'react';

interface HulyNewsLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'text';
}

export default function HulyNewsLogo({ className = "w-12 h-12", variant = 'full' }: HulyNewsLogoProps) {
  if (variant === 'icon') {
    return (
      <div className={`${className} relative`}>
        <svg viewBox="0 0 64 64" className="w-full h-full">
          {/* Background Circle with Gradient */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Main Circle */}
          <circle cx="32" cy="32" r="30" fill="url(#logoGradient)" filter="url(#glow)" />
          
          {/* Globe/World Icon */}
          <circle cx="32" cy="32" r="18" fill="none" stroke="white" strokeWidth="2" opacity="0.8" />
          <path d="M14 32 Q32 20 50 32 Q32 44 14 32" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6" />
          <path d="M32 14 Q20 32 32 50 Q44 32 32 14" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6" />
          
          {/* Financial Chart Lines */}
          <g transform="translate(20, 38)">
            <path d="M0 8 L4 6 L8 4 L12 7 L16 3 L20 5 L24 2" 
                  fill="none" 
                  stroke="url(#chartGradient)" 
                  strokeWidth="2" 
                  strokeLinecap="round" />
            <circle cx="0" cy="8" r="1.5" fill="#10B981" />
            <circle cx="8" cy="4" r="1.5" fill="#10B981" />
            <circle cx="16" cy="3" r="1.5" fill="#10B981" />
            <circle cx="24" cy="2" r="1.5" fill="#10B981" />
          </g>
          
          {/* Currency Symbols */}
          <text x="22" y="20" fill="white" fontSize="8" fontWeight="bold" opacity="0.7">$</text>
          <text x="40" y="18" fill="white" fontSize="6" fontWeight="bold" opacity="0.7">€</text>
          <text x="44" y="28" fill="white" fontSize="6" fontWeight="bold" opacity="0.7">¥</text>
          
          {/* AI/Tech Elements */}
          <g transform="translate(45, 45)">
            <circle cx="0" cy="0" r="3" fill="white" opacity="0.9" />
            <circle cx="0" cy="0" r="1.5" fill="#3B82F6" />
            <circle cx="0" cy="0" r="0.5" fill="white" className="animate-pulse" />
          </g>
        </svg>
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`${className} flex items-center`}>
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Huly News
        </span>
      </div>
    );
  }

  // Full logo with icon and text
  return (
    <div className={`${className} flex items-center gap-3`}>
      <HulyNewsLogo variant="icon" className="w-10 h-10" />
      <div>
        <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Huly News
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">AI Finans</div>
      </div>
    </div>
  );
}