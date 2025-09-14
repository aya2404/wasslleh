import React from 'react';
import { Settings, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useTranslation } from './services/TranslationService';

interface FloatingButtonsProps {
  onSettingsClick: () => void;
  onCameraClick: () => void;
}

export function FloatingButtons({ onSettingsClick, onCameraClick }: FloatingButtonsProps) {
  const { t, isRTL } = useTranslation();
  
  return (
    <TooltipProvider>
      <div className={`fixed ${isRTL ? 'left-6' : 'right-6'} bottom-6 flex flex-col space-y-4 z-50`} role="group" aria-label={t('quickAccess')}>
        {/* Settings Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onSettingsClick}
              size="lg"
              className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-300 hover:scale-110"
              aria-label={t('openAccessibilitySettings')}
              tabIndex={0}
            >
              <Settings className="w-6 h-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side={isRTL ? "right" : "left"} className="bg-gray-900 text-white p-2 rounded">
            <p>{t('accessibilitySettings')}</p>
          </TooltipContent>
        </Tooltip>

        {/* Camera Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onCameraClick}
              size="lg"
              className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg transition-all duration-300 hover:scale-110"
              aria-label={t('openTextAnalysis')}
              tabIndex={0}
            >
              <Camera className="w-6 h-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side={isRTL ? "right" : "left"} className="bg-gray-900 text-white p-2 rounded">
            <p>{t('openTextAnalysis')}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}