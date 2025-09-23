import React, { useState, useEffect } from 'react';
import { Settings, Camera, Volume2, Type, Accessibility, Sun, Moon, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { useTranslation } from './services/TranslationService';

interface FloatingAccessibilityControlsProps {
  onSettingsClick: () => void;
  onCameraClick: () => void;
  onAudioToggle?: () => void;
  isAudioEnabled?: boolean;
  isDarkMode?: boolean;
  onDarkModeToggle?: () => void;
}

export function FloatingAccessibilityControls({ 
  onSettingsClick, 
  onCameraClick,
  onAudioToggle,
  isAudioEnabled = false,
  isDarkMode,
  onDarkModeToggle 
}: FloatingAccessibilityControlsProps) {
  const { t, isRTL } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [disabilityType, setDisabilityType] = useState('none');

  // تحديد نوع الإعاقة من localStorage
  useEffect(() => {
    const savedDisabilityType = localStorage.getItem('disabilityType') || 'none';
    setDisabilityType(savedDisabilityType);
  }, []);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // الحصول على إعدادات التكييف حسب نوع الإعاقة
  const getButtonSize = () => {
    switch (disabilityType) {
      case 'visual':
      case 'motor':
        return { width: '4rem', height: '4rem' }; // 64px
      case 'cognitive':
        return { width: '3.75rem', height: '3.75rem' }; // 60px
      default:
        return { width: '3.5rem', height: '3.5rem' }; // 56px (default)
    }
  };

  const getIconSize = () => {
    return disabilityType === 'motor' || disabilityType === 'visual' ? 28 : 24;
  };

  const buttonSize = getButtonSize();
  const iconSize = getIconSize();

  return (
    <div 
      className={`floating-accessibility-controls fixed z-40 flex flex-col items-center ${
        disabilityType === 'motor' ? 'bottom-8' : 'bottom-6'
      } ${isRTL ? 'left-6' : 'right-6'} space-y-3`}
    >
      {/* Control Buttons - Show when expanded */}
      {isExpanded && (
        <div className="flex flex-col space-y-3 animate-in slide-in-from-bottom-2 duration-300">
          {/* Audio Toggle Button */}
          {onAudioToggle && disabilityType !== 'auditory' && (
            <Button
              onClick={onAudioToggle}
              size="lg"
              className={`rounded-full shadow-lg transition-all duration-200 hover:scale-105 enhanced-focus audio-control ${
                isAudioEnabled 
                  ? 'bg-[var(--color-calm-green)] hover:bg-[var(--color-calm-green)]/90 text-white active' 
                  : 'bg-white hover:bg-gray-100 border-2 border-[var(--color-calm-green)] text-[var(--color-calm-green)]'
              } ${disabilityType === 'visual' ? 'border-4 border-black' : ''}`}
              style={buttonSize}
              aria-label={isAudioEnabled ? t('disableAudio') : t('enableAudio')}
              title={isAudioEnabled ? t('disableAudio') : t('enableAudio')}
            >
              <Volume2 size={iconSize} />
            </Button>
          )}

          {/* Quick Dark Mode Toggle */}
          {onDarkModeToggle && (
            <Button
              onClick={onDarkModeToggle}
              size="lg"
              className={`rounded-full bg-[var(--color-light-orange)] hover:bg-[var(--color-vibrant-orange)] shadow-lg transition-all duration-200 hover:scale-105 text-white enhanced-focus ${
                disabilityType === 'visual' ? 'border-4 border-black' : ''
              }`}
              style={buttonSize}
              aria-label={isDarkMode ? t('lightMode') : t('darkMode')}
              title={isDarkMode ? t('lightMode') : t('darkMode')}
            >
              {isDarkMode ? <Sun size={iconSize} /> : <Moon size={iconSize} />}
            </Button>
          )}

          {/* Camera/OCR Button */}
          <Button
            onClick={onCameraClick}
            size="lg"
            className={`rounded-full bg-[var(--color-calm-green)] hover:bg-[var(--color-calm-green)]/90 shadow-lg transition-all duration-200 hover:scale-105 text-white enhanced-focus ${
              disabilityType === 'visual' ? 'border-4 border-black' : ''
            }`}
            style={buttonSize}
            aria-label={t('openCamera')}
            title={t('openCamera')}
          >
            <Camera size={iconSize} />
          </Button>

          {/* Settings Button */}
          <Button
            onClick={onSettingsClick}
            size="lg"
            className={`rounded-full bg-[var(--color-dark-purple)] hover:bg-[var(--color-dark-purple)]/90 shadow-lg transition-all duration-200 hover:scale-105 text-white enhanced-focus ${
              disabilityType === 'visual' ? 'border-4 border-black' : ''
            }`}
            style={buttonSize}
            aria-label={t('openSettings')}
            title={t('openSettings')}
          >
            <Settings size={iconSize} />
          </Button>
        </div>
      )}

      {/* Main Toggle Button - Always visible */}
      <Button
        onClick={toggleExpanded}
        size="lg"
        className={`main-toggle-button rounded-full bg-[var(--color-dark-purple)] hover:bg-[var(--color-dark-purple)]/80 dark:bg-[var(--color-pastel-purple)] dark:hover:bg-[var(--color-dark-purple)] shadow-lg transition-all duration-200 hover:scale-105 text-white dark:text-[var(--color-dark-purple)] dark:hover:text-white enhanced-focus ${
          disabilityType === 'visual' ? 'border-4 border-black' : ''
        } ${disabilityType === 'cognitive' ? 'shadow-2xl' : ''}`}
        style={buttonSize}
        aria-label={isExpanded ? t('hideControls') : t('showControls')}
        aria-expanded={isExpanded}
      >
        {isExpanded ? (
          <ChevronDown size={iconSize} />
        ) : (
          <Accessibility size={iconSize} />
        )}
      </Button>
    </div>
  );
}