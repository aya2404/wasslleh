import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { useTranslation } from './services/TranslationService';

interface FloatingAIButtonProps {
  onClick: () => void;
  isActive?: boolean;
}

export function FloatingAIButton({ onClick, isActive = false }: FloatingAIButtonProps) {
  const { t, isRTL } = useTranslation();

  return (
    <Button
      onClick={onClick}
      className={`
        fixed ${isRTL ? 'left-4' : 'right-4'} bottom-20 z-40
        w-14 h-14 rounded-full shadow-2xl
        bg-gradient-to-br from-purple-600 via-orange-500 to-green-500
        hover:from-purple-700 hover:via-orange-600 hover:to-green-600
        border-0 p-0 group transition-all duration-300
        ${isActive ? 'scale-110 shadow-purple-500/50' : 'hover:scale-105'}
      `}
      aria-label="المساعد الذكي"
    >
      <div className="relative w-full h-full rounded-full flex items-center justify-center">
        {/* Animated glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 via-orange-400 to-green-400 opacity-20 group-hover:opacity-30 transition-opacity animate-pulse"></div>
        
        {/* Icon */}
        <div className="relative z-10 flex items-center justify-center">
          <Bot className="w-7 h-7 text-white transition-transform group-hover:scale-110" />
          
          {/* Sparkle effect */}
          <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse opacity-80" />
        </div>
        
        {/* Pulse animation when active */}
        {isActive && (
          <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping"></div>
        )}
      </div>
      
      {/* Tooltip */}
      <div className={`
        absolute ${isRTL ? 'right-16' : 'left-16'} top-1/2 transform -translate-y-1/2
        bg-gray-900 text-white text-xs px-3 py-2 rounded-lg
        opacity-0 group-hover:opacity-100 transition-opacity duration-300
        pointer-events-none whitespace-nowrap
        before:absolute before:top-1/2 before:transform before:-translate-y-1/2
        ${isRTL 
          ? 'before:left-0 before:border-t-4 before:border-b-4 before:border-r-4 before:border-t-transparent before:border-b-transparent before:border-r-gray-900 before:-translate-x-full'
          : 'before:right-0 before:border-t-4 before:border-b-4 before:border-l-4 before:border-t-transparent before:border-b-transparent before:border-l-gray-900 before:translate-x-full'
        }
      `}>
        المساعد الذكي
      </div>
    </Button>
  );
}