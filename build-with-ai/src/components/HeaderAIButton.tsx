import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { useTranslation } from './services/TranslationService';

interface HeaderAIButtonProps {
  onClick: () => void;
  isActive?: boolean;
}

export function HeaderAIButton({ onClick, isActive = false }: HeaderAIButtonProps) {
  const { t, isRTL } = useTranslation();

  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className={`
        relative overflow-hidden group header-ai-button
        bg-gradient-to-r from-purple-100/80 via-orange-100/80 to-green-100/80
        dark:from-purple-900/40 dark:via-orange-900/40 dark:to-green-900/40
        hover:from-purple-200/90 hover:via-orange-200/90 hover:to-green-200/90
        dark:hover:from-purple-800/60 dark:hover:via-orange-800/60 dark:hover:to-green-800/60
        border-2 border-purple-300/60 dark:border-purple-600/40
        text-purple-700 dark:text-purple-200
        transition-all duration-300 ease-in-out
        shadow-lg hover:shadow-xl header-ai-glow
        ${isActive ? 'scale-105 shadow-purple-400/50 dark:shadow-purple-600/30' : ''}
        ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'}
        px-2 py-1 rounded-lg text-xs
        backdrop-blur-sm
      `}
      aria-label="المساعد الذكي"
    >
      {/* Background Glow Effect */}
      <div className={`
        absolute inset-0 rounded-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300
        bg-gradient-to-r from-purple-400/20 via-orange-400/20 to-green-400/20
        ${isActive ? 'opacity-20' : ''}
      `}></div>
      
      {/* Sparkle Background Animation */}
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <div className={`
          absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-yellow-400 rounded-full opacity-60
          animate-ping animation-delay-0
          ${isActive ? 'animate-pulse' : ''}
        `}></div>
        <div className={`
          absolute top-1.5 right-1 w-0.5 h-0.5 bg-blue-400 rounded-full opacity-40
          animate-ping animation-delay-300
          ${isActive ? 'animate-pulse' : ''}
        `}></div>
        <div className={`
          absolute bottom-1 left-1.5 w-0.5 h-0.5 bg-green-400 rounded-full opacity-50
          animate-ping animation-delay-600
          ${isActive ? 'animate-pulse' : ''}
        `}></div>
      </div>

      {/* Main Content */}
      <div className={`relative z-10 flex items-center ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'}`}>
        {/* Bot Icon Container */}
        <div className="relative">
          <Bot className={`
            w-4 h-4 transition-all duration-300
            ${isActive ? 'text-purple-600 dark:text-purple-300 animate-pulse' : ''}
            group-hover:scale-110 group-hover:rotate-12
          `} />
          
          {/* Sparkle Accent */}
          <Sparkles className={`
            absolute -top-0.5 -right-0.5 w-2.5 h-2.5 text-yellow-500 
            transition-all duration-300 opacity-70 header-ai-sparkle
            ${isActive ? 'animate-spin opacity-100' : 'group-hover:animate-bounce'}
          `} />
        </div>

        {/* Text Label */}
        <span className={`
          font-medium text-xs transition-all duration-300
          ${isActive ? 'text-purple-700 dark:text-purple-200' : ''}
          group-hover:text-purple-800 dark:group-hover:text-purple-100
        `}>
          المساعد الذكي
        </span>

        {/* Active Indicator */}
        {isActive && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
        )}
      </div>

      {/* Hover Shine Effect */}
      <div className={`
        absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500
        bg-gradient-to-r from-transparent via-white/20 to-transparent
        transform -skew-x-12 -translate-x-full group-hover:translate-x-full
        animation-duration-700
      `}></div>

      {/* Active Pulse Border */}
      {isActive && (
        <div className="absolute inset-0 rounded-lg border-2 border-purple-400/50 animate-pulse"></div>
      )}
    </Button>
  );
}