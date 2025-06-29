import React from 'react';

interface EnhancedHulyNewsLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'text' | 'animated' | 'minimal' | 'hero';
  showTagline?: boolean;
  theme?: 'light' | 'dark' | 'gradient';
  size?: 'small' | 'medium' | 'large' | 'xl' | 'hero';
}

export default function EnhancedHulyNewsLogo({ 
  className = "w-16 h-16", 
  variant = 'full',
  showTagline = false,
  theme = 'gradient',
  size = 'medium'
}: EnhancedHulyNewsLogoProps) {
  
  // Size configurations for responsive design
  const sizeConfigs = {
    small: {
      container: 'w-8 h-8',
      text: 'text-sm',
      tagline: 'text-xs',
      spacing: 'gap-2'
    },
    medium: {
      container: 'w-16 h-16',
      text: 'text-xl',
      tagline: 'text-xs',
      spacing: 'gap-3'
    },
    large: {
      container: 'w-20 h-20',
      text: 'text-2xl',
      tagline: 'text-sm',
      spacing: 'gap-4'
    },
    xl: {
      container: 'w-24 h-24',
      text: 'text-3xl',
      tagline: 'text-base',
      spacing: 'gap-4'
    },
    hero: {
      container: 'w-32 h-32',
      text: 'text-4xl',
      tagline: 'text-lg',
      spacing: 'gap-6'
    }
  };

  const config = sizeConfigs[size];
  
  if (variant === 'hero') {
    return (
      <div className={`${className} relative group`}>
        <div className="flex flex-col items-center text-center">
          {/* Hero Logo */}
          <div className={`${config.container} relative mb-4`}>
            <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-2xl">
              {/* Enhanced Gradient Definitions */}
              <defs>
                <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0891b2" />
                  <stop offset="30%" stopColor="#0e7490" />
                  <stop offset="70%" stopColor="#155e75" />
                  <stop offset="100%" stopColor="#164e63" />
                </linearGradient>
                
                <linearGradient id="heroChartGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#0891b2" />
                  <stop offset="100%" stopColor="#0e7490" />
                </linearGradient>
                
                {/* Enhanced Glow Effect */}
                <filter id="heroGlow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                
                {/* Pulsing Animation */}
                <filter id="heroPulse">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Background Circle with Enhanced Glow */}
              <circle cx="60" cy="60" r="55" fill="url(#heroGradient)" filter="url(#heroGlow)" 
                      className="animate-pulse" style={{ animationDuration: '3s' }} />
              
              {/* AI Brain - Enhanced */}
              <g transform="translate(25, 25)">
                <path d="M35 10 Q45 5 55 10 Q65 15 65 25 Q70 35 65 45 Q60 55 50 60 Q40 65 30 60 Q20 55 15 45 Q10 35 15 25 Q20 15 30 10 Q32 8 35 10 Z" 
                      fill="rgba(255,255,255,0.95)" 
                      filter="url(#heroPulse)"
                      className="group-hover:animate-pulse" />
                
                {/* Neural Network Nodes - Enhanced Animation */}
                <g className="animate-pulse">
                  <circle cx="25" cy="25" r="3" fill="#0891b2" opacity="0.9">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="35" cy="20" r="2.5" fill="#0891b2" opacity="0.8">
                    <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="r" values="2;3.5;2" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="45" cy="30" r="3" fill="#0891b2" opacity="0.9">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="r" values="2.5;4;2.5" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="55" cy="25" r="2.5" fill="#0891b2" opacity="0.7">
                    <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.2s" repeatCount="indefinite" />
                    <animate attributeName="r" values="2;3.5;2" dur="2.2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="40" cy="40" r="3" fill="#0891b2" opacity="0.8">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="1.9s" repeatCount="indefinite" />
                    <animate attributeName="r" values="2.5;4;2.5" dur="1.9s" repeatCount="indefinite" />
                  </circle>
                </g>
                
                {/* Neural Connections - Enhanced */}
                <g stroke="#0891b2" strokeWidth="1" opacity="0.7">
                  <line x1="25" y1="25" x2="35" y2="20">
                    <animate attributeName="opacity" values="0.2;0.9;0.2" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="stroke-width" values="0.5;2;0.5" dur="3s" repeatCount="indefinite" />
                  </line>
                  <line x1="35" y1="20" x2="45" y2="30">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="stroke-width" values="0.5;2;0.5" dur="2.5s" repeatCount="indefinite" />
                  </line>
                  <line x1="45" y1="30" x2="55" y2="25">
                    <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2.8s" repeatCount="indefinite" />
                    <animate attributeName="stroke-width" values="0.5;2;0.5" dur="2.8s" repeatCount="indefinite" />
                  </line>
                  <line x1="40" y1="40" x2="45" y2="30">
                    <animate attributeName="opacity" values="0.4;1;0.4" dur="2.2s" repeatCount="indefinite" />
                    <animate attributeName="stroke-width" values="0.5;2;0.5" dur="2.2s" repeatCount="indefinite" />
                  </line>
                </g>
              </g>
              
              {/* Financial Chart - Enhanced */}
              <g transform="translate(75, 45)">
                {/* Chart Bars with Enhanced Animation */}
                <rect x="0" y="20" width="5" height="15" fill="url(#heroChartGradient)" rx="2">
                  <animate attributeName="height" values="15;30;15" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="y" values="20;5;20" dur="3s" repeatCount="indefinite" />
                </rect>
                <rect x="7" y="15" width="5" height="20" fill="url(#heroChartGradient)" rx="2">
                  <animate attributeName="height" values="20;35;20" dur="3.5s" repeatCount="indefinite" />
                  <animate attributeName="y" values="15;0;15" dur="3.5s" repeatCount="indefinite" />
                </rect>
                <rect x="14" y="10" width="5" height="25" fill="url(#heroChartGradient)" rx="2">
                  <animate attributeName="height" values="25;40;25" dur="2.8s" repeatCount="indefinite" />
                  <animate attributeName="y" values="10;-5;10" dur="2.8s" repeatCount="indefinite" />
                </rect>
                <rect x="21" y="5" width="5" height="30" fill="url(#heroChartGradient)" rx="2">
                  <animate attributeName="height" values="30;45;30" dur="3.2s" repeatCount="indefinite" />
                  <animate attributeName="y" values="5;-10;5" dur="3.2s" repeatCount="indefinite" />
                </rect>
                
                {/* Enhanced Growth Arrow */}
                <g transform="translate(30, 10)" className="group-hover:scale-125 transition-transform duration-500">
                  <path d="M0 12 L10 2 L8 4 L15 4 L15 0 L18 0 L18 7 L10 7 L12 9 Z" 
                        fill="#10b981" 
                        opacity="0.9"
                        filter="url(#heroGlow)">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
                  </path>
                </g>
              </g>
            </svg>
          </div>
          
          {/* Hero Text */}
          <div className="text-center">
            <h1 className={`${config.text} font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 drop-shadow-lg`}>
              Huly News
            </h1>
            {showTagline && (
              <p className={`${config.tagline} text-gray-600 dark:text-gray-400 font-medium`}>
                AI Destekli Finans Platformu
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  if (variant === 'animated') {
    return (
      <div className={`${className} relative group cursor-pointer`}>
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg hover:drop-shadow-xl transition-all duration-300">
          {/* Enhanced Gradient Definitions */}
          <defs>
            <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0891b2" />
              <stop offset="30%" stopColor="#0e7490" />
              <stop offset="70%" stopColor="#155e75" />
              <stop offset="100%" stopColor="#164e63" />
            </linearGradient>
            
            <linearGradient id="chartGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#0891b2" />
              <stop offset="100%" stopColor="#0e7490" />
            </linearGradient>
            
            <linearGradient id="worldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            
            {/* Enhanced Glow Effect */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            {/* Pulse Animation */}
            <filter id="pulse">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* World Map Background - Subtle */}
          <g opacity="0.15" className="group-hover:opacity-25 transition-opacity duration-500">
            <path d="M20 40 Q30 35 40 40 Q50 45 60 40 Q70 35 80 40 Q90 45 100 40" 
                  fill="none" 
                  stroke="url(#worldGradient)" 
                  strokeWidth="1" />
            <path d="M15 60 Q25 55 35 60 Q45 65 55 60 Q65 55 75 60 Q85 65 95 60" 
                  fill="none" 
                  stroke="url(#worldGradient)" 
                  strokeWidth="1" />
          </g>
          
          {/* AI Brain - Enhanced */}
          <g transform="translate(25, 25)">
            <path d="M35 10 Q45 5 55 10 Q65 15 65 25 Q70 35 65 45 Q60 55 50 60 Q40 65 30 60 Q20 55 15 45 Q10 35 15 25 Q20 15 30 10 Q32 8 35 10 Z" 
                  fill="url(#brainGradient)" 
                  filter="url(#glow)"
                  className="group-hover:animate-pulse" />
            
            {/* Neural Network Nodes - Animated */}
            <g className="animate-pulse">
              <circle cx="25" cy="25" r="2" fill="white" opacity="0.9">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="35" cy="20" r="1.5" fill="white" opacity="0.8">
                <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="45" cy="30" r="2" fill="white" opacity="0.9">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <circle cx="55" cy="25" r="1.5" fill="white" opacity="0.7">
                <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.2s" repeatCount="indefinite" />
              </circle>
              <circle cx="40" cy="40" r="2" fill="white" opacity="0.8">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="1.9s" repeatCount="indefinite" />
              </circle>
            </g>
            
            {/* Neural Connections - Animated */}
            <g stroke="white" strokeWidth="0.5" opacity="0.6">
              <line x1="25" y1="25" x2="35" y2="20">
                <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" />
              </line>
              <line x1="35" y1="20" x2="45" y2="30">
                <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.5s" repeatCount="indefinite" />
              </line>
              <line x1="45" y1="30" x2="55" y2="25">
                <animate attributeName="opacity" values="0.2;0.7;0.2" dur="2.8s" repeatCount="indefinite" />
              </line>
              <line x1="40" y1="40" x2="45" y2="30">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="2.2s" repeatCount="indefinite" />
              </line>
            </g>
            
            {/* Gear/Processing Symbol */}
            <g transform="translate(40, 35)" className="group-hover:animate-spin" style={{ animationDuration: '8s' }}>
              <circle cx="0" cy="0" r="8" fill="none" stroke="white" strokeWidth="1" opacity="0.7" />
              <circle cx="0" cy="0" r="3" fill="white" opacity="0.8" />
              <rect x="-1" y="-6" width="2" height="3" fill="white" opacity="0.6" />
              <rect x="-1" y="3" width="2" height="3" fill="white" opacity="0.6" />
              <rect x="-6" y="-1" width="3" height="2" fill="white" opacity="0.6" />
              <rect x="3" y="-1" width="3" height="2" fill="white" opacity="0.6" />
            </g>
          </g>
          
          {/* Financial Chart - Enhanced Animation */}
          <g transform="translate(75, 45)">
            {/* Chart Bars with Growth Animation */}
            <rect x="0" y="20" width="4" height="15" fill="url(#chartGradient)" rx="1">
              <animate attributeName="height" values="15;25;15" dur="3s" repeatCount="indefinite" />
              <animate attributeName="y" values="20;10;20" dur="3s" repeatCount="indefinite" />
            </rect>
            <rect x="6" y="15" width="4" height="20" fill="url(#chartGradient)" rx="1">
              <animate attributeName="height" values="20;30;20" dur="3.5s" repeatCount="indefinite" />
              <animate attributeName="y" values="15;5;15" dur="3.5s" repeatCount="indefinite" />
            </rect>
            <rect x="12" y="10" width="4" height="25" fill="url(#chartGradient)" rx="1">
              <animate attributeName="height" values="25;35;25" dur="2.8s" repeatCount="indefinite" />
              <animate attributeName="y" values="10;0;10" dur="2.8s" repeatCount="indefinite" />
            </rect>
            <rect x="18" y="5" width="4" height="30" fill="url(#chartGradient)" rx="1">
              <animate attributeName="height" values="30;40;30" dur="3.2s" repeatCount="indefinite" />
              <animate attributeName="y" values="5;-5;5" dur="3.2s" repeatCount="indefinite" />
            </rect>
            <rect x="24" y="8" width="4" height="27" fill="url(#chartGradient)" rx="1">
              <animate attributeName="height" values="27;37;27" dur="2.9s" repeatCount="indefinite" />
              <animate attributeName="y" values="8;-2;8" dur="2.9s" repeatCount="indefinite" />
            </rect>
            
            {/* Trend Line */}
            <path d="M2 30 L8 25 L14 20 L20 15 L26 18" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                  opacity="0.8">
              <animate attributeName="stroke-dasharray" values="0,100;50,50;100,0" dur="4s" repeatCount="indefinite" />
            </path>
            
            {/* Growth Arrow */}
            <g transform="translate(30, 10)" className="group-hover:scale-110 transition-transform duration-300">
              <path d="M0 10 L8 2 L6 4 L12 4 L12 0 L14 0 L14 6 L8 6 L10 8 Z" 
                    fill="#10b981" 
                    opacity="0.9">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
              </path>
            </g>
          </g>
          
          {/* Currency Symbols - Floating Animation */}
          <g className="group-hover:animate-bounce">
            <text x="15" y="25" fill="#0891b2" fontSize="8" fontWeight="bold" opacity="0.8">$</text>
            <text x="95" y="20" fill="#0891b2" fontSize="6" fontWeight="bold" opacity="0.7">€</text>
            <text x="100" y="35" fill="#0891b2" fontSize="6" fontWeight="bold" opacity="0.7">¥</text>
            <text x="10" y="45" fill="#0891b2" fontSize="5" fontWeight="bold" opacity="0.6">₺</text>
          </g>
          
          {/* Data Flow Particles */}
          <g opacity="0.4">
            <circle cx="60" cy="20" r="1" fill="#06b6d4">
              <animateMotion dur="6s" repeatCount="indefinite">
                <path d="M0,0 Q20,10 40,0 Q60,-10 80,0" />
              </animateMotion>
            </circle>
            <circle cx="60" cy="80" r="1" fill="#0891b2">
              <animateMotion dur="7s" repeatCount="indefinite">
                <path d="M0,0 Q-20,-10 -40,0 Q-60,10 -80,0" />
              </animateMotion>
            </circle>
          </g>
        </svg>
        
        {showTagline && (
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <span className="text-xs font-medium text-cyan-600 dark:text-cyan-400">
              Akıllı Finans • Güvenilir Analiz
            </span>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`${className} flex items-center ${config.spacing}`}>
        <div className={`${config.container} relative`}>
          <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="minimalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0891b2" />
                <stop offset="100%" stopColor="#164e63" />
              </linearGradient>
            </defs>
            <path d="M16 4 Q20 2 24 4 Q28 6 28 10 Q30 14 28 18 Q26 22 22 24 Q18 26 14 24 Q10 22 8 18 Q6 14 8 10 Q10 6 14 4 Q15 3 16 4 Z" 
                  fill="url(#minimalGradient)" />
            <circle cx="12" cy="12" r="1" fill="white" opacity="0.9" />
            <circle cx="20" cy="10" r="1" fill="white" opacity="0.8" />
            <circle cx="18" cy="18" r="1" fill="white" opacity="0.9" />
            <rect x="22" y="20" width="2" height="8" fill="url(#minimalGradient)" />
            <rect x="25" y="18" width="2" height="10" fill="url(#minimalGradient)" />
            <rect x="28" y="16" width="2" height="12" fill="url(#minimalGradient)" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className={`${config.text} font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent`}>
            Huly
          </span>
          <span className={`${config.tagline} text-gray-500 dark:text-gray-400 -mt-1`}>News</span>
        </div>
      </div>
    );
  }

  // Default full variant with enhancements
  return (
    <div className={`${className} flex items-center ${config.spacing}`}>
      <div className={`${config.container} relative group`}>
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-lg hover:drop-shadow-xl transition-all duration-300">
          <defs>
            <linearGradient id="enhancedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0891b2" />
              <stop offset="50%" stopColor="#0e7490" />
              <stop offset="100%" stopColor="#164e63" />
            </linearGradient>
            <linearGradient id="enhancedChartGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
          </defs>
          
          {/* Enhanced Brain */}
          <path d="M32 8 Q40 6 48 8 Q56 12 56 20 Q58 28 56 36 Q54 44 46 48 Q38 52 30 48 Q22 44 20 36 Q18 28 20 20 Q22 12 30 8 Q31 7 32 8 Z" 
                fill="url(#enhancedGradient)" 
                className="group-hover:drop-shadow-lg transition-all duration-300" />
          
          {/* Neural nodes */}
          <circle cx="28" cy="24" r="2" fill="white" opacity="0.9" />
          <circle cx="36" cy="20" r="1.5" fill="white" opacity="0.8" />
          <circle cx="40" cy="28" r="2" fill="white" opacity="0.9" />
          <circle cx="32" cy="32" r="1.5" fill="white" opacity="0.7" />
          
          {/* Enhanced Chart */}
          <g transform="translate(45, 35)">
            <rect x="0" y="8" width="3" height="12" fill="url(#enhancedChartGradient)" rx="1" />
            <rect x="4" y="6" width="3" height="14" fill="url(#enhancedChartGradient)" rx="1" />
            <rect x="8" y="4" width="3" height="16" fill="url(#enhancedChartGradient)" rx="1" />
            <rect x="12" y="2" width="3" height="18" fill="url(#enhancedChartGradient)" rx="1" />
          </g>
          
          {/* Currency symbols */}
          <text x="18" y="18" fill="#0891b2" fontSize="6" fontWeight="bold" opacity="0.8">$</text>
          <text x="48" y="16" fill="#0891b2" fontSize="5" fontWeight="bold" opacity="0.7">€</text>
          <text x="52" y="24" fill="#0891b2" fontSize="5" fontWeight="bold" opacity="0.7">¥</text>
        </svg>
      </div>
      
      <div className="flex flex-col">
        <h1 className={`${config.text} font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
          Huly News
        </h1>
        {showTagline && (
          <p className={`${config.tagline} text-gray-500 dark:text-gray-400 mt-0.5`}>
            AI Destekli Finans Platformu
          </p>
        )}
      </div>
    </div>
  );
}