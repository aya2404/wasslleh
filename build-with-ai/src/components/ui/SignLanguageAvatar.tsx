// مكون الأفتار ثلاثي الأبعاد المتقدم لعرض لغة الإشارة
// Advanced 3D Avatar Component for Sign Language Display

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Settings, Volume2, VolumeX } from 'lucide-react';
import { Button } from './button';
import { useTranslation } from '../services/TranslationService';
import { SignLanguageConfig, AvatarAnimation } from '../../config/signLanguageConfig';

interface SignLanguageAvatarProps {
  text: string;
  isVisible: boolean;
  config: SignLanguageConfig;
  onClose?: () => void;
  onConfigChange?: (config: Partial<SignLanguageConfig>) => void;
  className?: string;
}

interface AvatarState {
  isPlaying: boolean;
  isPaused: boolean;
  currentFrame: number;
  totalFrames: number;
  playbackSpeed: number;
  volume: number;
  isLooping: boolean;
}

export function SignLanguageAvatar({
  text,
  isVisible,
  config,
  onClose,
  onConfigChange,
  className = ''
}: SignLanguageAvatarProps) {
  const { t, language } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [avatarState, setAvatarState] = useState<AvatarState>({
    isPlaying: false,
    isPaused: false,
    currentFrame: 0,
    totalFrames: 0,
    playbackSpeed: 1.0,
    volume: 0.8,
    isLooping: true
  });

  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // تهيئة الكانفاس وبدء الرسوم المتحركة
  useEffect(() => {
    if (isVisible && text && canvasRef.current) {
      initializeAvatar();
      startSignLanguageAnimation();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, text, config]);

  const initializeAvatar = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // تهيئة أبعاد الكانفاس
    const containerRect = canvas.parentElement?.getBoundingClientRect();
    if (containerRect) {
      canvas.width = containerRect.width * window.devicePixelRatio;
      canvas.height = containerRect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = `${containerRect.width}px`;
      canvas.style.height = `${containerRect.height}px`;
    }

    // رسم خلفية الأفتار
    drawAvatarBackground(ctx, canvas.width, canvas.height);
  };

  const drawAvatarBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // رسم خلفية متدرجة
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1e3a8a');
    gradient.addColorStop(0.5, '#3b82f6');
    gradient.addColorStop(1, '#1e40af');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // إضافة تأثير الإضاءة
    const lightGradient = ctx.createRadialGradient(width/2, height/3, 0, width/2, height/3, width/2);
    lightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    lightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = lightGradient;
    ctx.fillRect(0, 0, width, height);
  };

  const startSignLanguageAnimation = () => {
    if (!text.trim()) return;

    setAvatarState(prev => ({ 
      ...prev, 
      isPlaying: true, 
      isPaused: false,
      currentFrame: 0,
      totalFrames: calculateTotalFrames(text)
    }));

    animateSignLanguage();
  };

  const calculateTotalFrames = (text: string): number => {
    // حساب عدد الإطارات بناءً على طول النص ومعقدة الإشارات
    const words = text.split(' ').length;
    const baseFrames = words * 30; // 30 إطار لكل كلمة
    const speedMultiplier = 1 / config.animationSpeed;
    
    return Math.floor(baseFrames * speedMultiplier);
  };

  const animateSignLanguage = () => {
    const canvas = canvasRef.current;
    if (!canvas || !avatarState.isPlaying) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // مسح الكانفاس
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // رسم خلفية جديدة
    drawAvatarBackground(ctx, canvas.width, canvas.height);
    
    // رسم الأفتار الروبوت
    drawRobotAvatar(ctx, canvas.width, canvas.height);
    
    // رسم الإشارات
    drawCurrentGesture(ctx, canvas.width, canvas.height);
    
    // تحديث الإطار الحالي
    setAvatarState(prev => {
      const nextFrame = prev.currentFrame + (prev.playbackSpeed * config.animationSpeed);
      
      if (nextFrame >= prev.totalFrames) {
        if (prev.isLooping) {
          return { ...prev, currentFrame: 0 };
        } else {
          return { ...prev, isPlaying: false, currentFrame: prev.totalFrames };
        }
      }
      
      return { ...prev, currentFrame: nextFrame };
    });

    if (avatarState.isPlaying && !avatarState.isPaused) {
      animationRef.current = requestAnimationFrame(animateSignLanguage);
    }
  };

  const drawRobotAvatar = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = Math.min(width, height) / 400;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(scale, scale);

    // رسم جسم الروبوت
    drawRobotBody(ctx);
    
    // رسم رأس الروبوت
    drawRobotHead(ctx);
    
    // رسم الذراعين
    drawRobotArms(ctx);

    ctx.restore();
  };

  const drawRobotBody = (ctx: CanvasRenderingContext2D) => {
    // الجسم الرئيسي
    ctx.fillStyle = '#2563eb';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.roundRect(-40, 20, 80, 100, 10);
    ctx.fill();
    ctx.stroke();

    // تفاصيل الجسم
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.roundRect(-30, 35, 60, 15, 5);
    ctx.fill();
    
    ctx.beginPath();
    ctx.roundRect(-30, 60, 60, 15, 5);
    ctx.fill();
  };

  const drawRobotHead = (ctx: CanvasRenderingContext2D) => {
    // الرأس
    ctx.fillStyle = '#64748b';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.roundRect(-35, -40, 70, 50, 15);
    ctx.fill();
    ctx.stroke();

    // العيون
    const eyeGlow = avatarState.isPlaying ? '#60a5fa' : '#9333ea';
    ctx.fillStyle = eyeGlow;
    
    ctx.beginPath();
    ctx.arc(-15, -20, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(15, -20, 8, 0, Math.PI * 2);
    ctx.fill();

    // الفم
    ctx.fillStyle = avatarState.isPlaying ? '#22c55e' : '#16a34a';
    ctx.beginPath();
    ctx.roundRect(-20, -5, 40, 8, 4);
    ctx.fill();

    // هوائي
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -40);
    ctx.lineTo(0, -55);
    ctx.stroke();

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(0, -58, 4, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawRobotArms = (ctx: CanvasRenderingContext2D) => {
    const armAngle = Math.sin(avatarState.currentFrame * 0.1) * 0.3;
    
    ctx.save();
    
    // الذراع الأيمن
    ctx.translate(40, 30);
    ctx.rotate(armAngle);
    
    ctx.fillStyle = '#2563eb';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.roundRect(0, -8, 50, 16, 8);
    ctx.fill();
    ctx.stroke();
    
    // اليد اليمنى
    ctx.fillStyle = '#9333ea';
    ctx.beginPath();
    ctx.arc(50, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    
    // الذراع الأيسر
    ctx.save();
    ctx.translate(-40, 30);
    ctx.rotate(-armAngle);
    
    ctx.fillStyle = '#2563eb';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.roundRect(-50, -8, 50, 16, 8);
    ctx.fill();
    ctx.stroke();
    
    // اليد اليسرى
    ctx.fillStyle = '#9333ea';
    ctx.beginPath();
    ctx.arc(-50, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  };

  const drawCurrentGesture = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!text || !avatarState.isPlaying) return;

    // رسم النص الحالي
    const words = text.split(' ');
    const currentWordIndex = Math.floor((avatarState.currentFrame / avatarState.totalFrames) * words.length);
    const currentWord = words[currentWordIndex] || '';

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.min(width, height) / 20}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    
    ctx.fillText(currentWord, width / 2, height - 20);

    // رسم مؤشر التقدم
    const progress = avatarState.currentFrame / avatarState.totalFrames;
    const progressBarWidth = width * 0.8;
    const progressBarHeight = 4;
    const progressBarX = (width - progressBarWidth) / 2;
    const progressBarY = height - 40;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);

    ctx.fillStyle = '#22c55e';
    ctx.fillRect(progressBarX, progressBarY, progressBarWidth * progress, progressBarHeight);
  };

  const togglePlayPause = () => {
    if (avatarState.isPlaying) {
      setAvatarState(prev => ({ ...prev, isPaused: !prev.isPaused }));
    } else {
      startSignLanguageAnimation();
    }
    
    if (!avatarState.isPaused) {
      animateSignLanguage();
    }
  };

  const resetAnimation = () => {
    setAvatarState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      currentFrame: 0
    }));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getAvatarSizeClass = () => {
    if (isFullscreen) return 'fixed inset-0 z-50';
    
    switch (config.avatarSize) {
      case 'small': return 'w-48 h-64';
      case 'large': return 'w-96 h-128';
      default: return 'w-64 h-80';
    }
  };

  const getPositionClass = () => {
    if (isFullscreen) return '';
    
    switch (config.position) {
      case 'bottom-left': return 'bottom-4 left-4';
      case 'top-right': return 'top-4 right-4';
      case 'top-left': return 'top-4 left-4';
      case 'center': return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      default: return 'bottom-4 right-4';
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`${getAvatarSizeClass()} ${getPositionClass()} ${className}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* الكانفاس الرئيسي */}
        <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden shadow-2xl border border-gray-600">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ background: 'transparent' }}
          />
          
          {/* عناصر التحكم */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-black/80 p-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={togglePlayPause}
                      className="text-white hover:bg-white/20"
                    >
                      {avatarState.isPlaying && !avatarState.isPaused ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={resetAnimation}
                      className="text-white hover:bg-white/20"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setAvatarState(prev => ({ 
                        ...prev, 
                        volume: prev.volume > 0 ? 0 : 0.8 
                      }))}
                      className="text-white hover:bg-white/20"
                    >
                      {avatarState.volume > 0 ? (
                        <Volume2 className="w-4 h-4" />
                      ) : (
                        <VolumeX className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={toggleFullscreen}
                      className="text-white hover:bg-white/20"
                    >
                      {isFullscreen ? '⛶' : '⛝'}
                    </Button>
                    
                    {onClose && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={onClose}
                        className="text-white hover:bg-white/20"
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* معلومات النص الحالي */}
          <div className="absolute top-2 left-2 right-2">
            <div className="bg-black/60 text-white text-xs p-2 rounded">
              <div className="truncate">
                {language === 'ar' ? 'النص: ' : 'Text: '}{text}
              </div>
              <div className="mt-1 text-gray-300">
                {language === 'ar' ? 'الإطار: ' : 'Frame: '}
                {Math.floor(avatarState.currentFrame)} / {avatarState.totalFrames}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}