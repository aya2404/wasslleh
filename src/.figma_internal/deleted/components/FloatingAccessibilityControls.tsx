import React, { useState } from 'react';
import { Settings, Camera, Volume2, Type, Accessibility, Sun, Moon, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { useTranslation } from './services/TranslationService';

interface FloatingAccessibilityControlsProps {
  onSettingsClick: () => void;
  onCameraClick: () => void;
  isDarkMode?: boolean;
  onDarkModeToggle?: () => void;
}

export function FloatingAccessibilityControls({ 
  onSettingsClick, 
  onCameraClick,
  isDarkMode,
  onDarkModeToggle 
}: FloatingAccessibilityControlsProps) {
  const { t, isRTL } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-40 flex flex-col items-center space-y-3`}>
      {/* Control Buttons - Show when expanded */}
      {isExpanded && (
        <div className="flex flex-col space-y-3 animate-in slide-in-from-bottom-2 duration-300">
          {/* Quick Dark Mode Toggle */}
          {onDarkModeToggle && (
            <Button
              onClick={onDarkModeToggle}
              size="lg"
              className="rounded-full w-14 h-14 bg-brand-orange hover:bg-brand-orange shadow-lg transition-all duration-200 hover:scale-105"
              aria-label={isDarkMode ? t('lightMode') : t('darkMode')}
            >
              {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </Button>
          )}

          {/* Camera/OCR Button */}
          <Button
            onClick={onCameraClick}
            size="lg"
            className="rounded-full w-14 h-14 bg-brand-green hover:bg-brand-green shadow-lg transition-all duration-200 hover:scale-105"
            aria-label={t('openCamera')}
          >
            <Camera className="w-6 h-6" />
          </Button>

          {/* Settings Button */}
          <Button
            onClick={onSettingsClick}
            size="lg"
            className="rounded-full w-14 h-14 bg-brand-purple hover:bg-brand-purple shadow-lg transition-all duration-200 hover:scale-105"
            aria-label={t('openSettings')}
          >
            <Settings className="w-6 h-6" />
          </Button>
        </div>
      )}

      {/* Main Toggle Button - Always visible */}
      <Button
        onClick={toggleExpanded}
        size="lg"
        className="rounded-full w-14 h-14 bg-brand-green hover:bg-brand-green shadow-lg transition-all duration-200 hover:scale-105"
        aria-label={isExpanded ? t('hideControls') : t('showControls')}
        aria-expanded={isExpanded}
      >
        {isExpanded ? (
          <ChevronDown className="w-6 h-6 text-white" />
        ) : (
          <Accessibility className="w-6 h-6 text-white" />
        )}
      </Button>
    </div>
  );
}