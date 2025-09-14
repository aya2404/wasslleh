// مكون الروبوت ثلاثي الأبعاد لعرض لغة الإشارة
// 3D Robot Avatar Component for Sign Language Display

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../services/TranslationService';
import { 
  robotAvatarConfig, 
  SignLanguageConfig, 
  AvatarAnimation,
  renderQuality 
} from '../../config/signLanguageConfig';

interface RobotAvatarProps {
  isVisible: boolean;
  currentGesture?: string;
  animationSequence?: AvatarAnimation[];
  config: SignLanguageConfig;
  quality?: 'low' | 'medium' | 'high';
  onAnimationComplete?: () => void;
  className?: string;
}

interface RobotState {
  headRotation: { x: number; y: number; z: number };
  rightArmPosition: { x: number; y: number; z: number };
  leftArmPosition: { x: number; y: number; z: number };
  rightHandGesture: string;
  leftHandGesture: string;
  eyeState: 'normal' | 'blink' | 'glow';
  mouthState: 'closed' | 'speaking' | 'smile';
  bodyPosture: 'idle' | 'active' | 'greeting';
}

export function RobotAvatar({
  isVisible,
  currentGesture,
  animationSequence = [],
  config,
  quality = 'medium',
  onAnimationComplete,
  className = ''
}: RobotAvatarProps) {
  const { t, language } = useTranslation();
  const avatarRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  
  const [robotState, setRobotState] = useState<RobotState>({
    headRotation: { x: 0, y: 0, z: 0 },
    rightArmPosition: { x: 0, y: 0, z: 0 },
    leftArmPosition: { x: 0, y: 0, z: 0 },
    rightHandGesture: 'neutral',
    leftHandGesture: 'neutral',
    eyeState: 'normal',
    mouthState: 'closed',
    bodyPosture: 'idle'
  });
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  
  const qualitySettings = renderQuality[quality];
  const colors = robotAvatarConfig.colors;
  const dimensions = robotAvatarConfig.dimensions;

  // تشغيل تسلسل الرسوم المتحركة
  useEffect(() => {
    if (animationSequence.length > 0 && isVisible) {
      playAnimationSequence();
    }
  }, [animationSequence, isVisible]);

  // رسوم متحركة خمول الروبوت
  useEffect(() => {
    if (isVisible && !isAnimating) {
      startIdleAnimation();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, isAnimating]);

  const playAnimationSequence = async () => {
    if (animationSequence.length === 0) return;
    
    setIsAnimating(true);
    const totalDuration = Math.max(...animationSequence.map(anim => anim.timestamp)) + 500;
    
    // تطبيق كل إطار في التسلسل
    animationSequence.forEach((animation) => {
      setTimeout(() => {
        applyAnimation(animation);
      }, animation.timestamp * config.animationSpeed);
    });
    
    // إنهاء الرسوم المتحركة
    setTimeout(() => {
      setIsAnimating(false);
      setAnimationProgress(0);
      resetToIdleState();
      onAnimationComplete?.();
    }, totalDuration * config.animationSpeed);
  };

  const applyAnimation = (animation: AvatarAnimation) => {
    setRobotState(prev => {
      const newState = { ...prev };
      
      switch (animation.bodyPart) {
        case 'rightHand':
          newState.rightArmPosition = animation.position;
          newState.rightHandGesture = animation.gesture;
          break;
        case 'leftHand':
          newState.leftArmPosition = animation.position;
          newState.leftHandGesture = animation.gesture;
          break;
        case 'face':
          if (animation.gesture.includes('smile')) {
            newState.mouthState = 'smile';
            newState.eyeState = 'glow';
          } else if (animation.gesture.includes('speak')) {
            newState.mouthState = 'speaking';
          }
          break;
        case 'body':
          newState.headRotation = animation.rotation;
          newState.bodyPosture = 'active';
          break;
      }
      
      return newState;
    });
  };

  const startIdleAnimation = () => {
    const idleLoop = () => {
      const time = Date.now() * 0.001;
      
      setRobotState(prev => ({
        ...prev,
        headRotation: {
          x: Math.sin(time * 0.5) * 2,
          y: Math.cos(time * 0.3) * 3,
          z: 0
        },
        eyeState: Math.sin(time * 2) > 0.9 ? 'blink' : 'normal',
        bodyPosture: 'idle'
      }));
      
      if (isVisible && !isAnimating) {
        animationRef.current = requestAnimationFrame(idleLoop);
      }
    };
    
    idleLoop();
  };

  const resetToIdleState = () => {
    setRobotState({
      headRotation: { x: 0, y: 0, z: 0 },
      rightArmPosition: { x: 0, y: 0, z: 0 },
      leftArmPosition: { x: 0, y: 0, z: 0 },
      rightHandGesture: 'neutral',
      leftHandGesture: 'neutral',
      eyeState: 'normal',
      mouthState: 'closed',
      bodyPosture: 'idle'
    });
  };

  const getAvatarSize = () => {
    switch (config.avatarSize) {
      case 'small': return 'w-24 h-36';
      case 'large': return 'w-48 h-72';
      default: return 'w-32 h-48';
    }
  };

  const getPositionClasses = () => {
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
        ref={avatarRef}
        className={`fixed ${getPositionClasses()} ${getAvatarSize()} z-50 ${className}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        {/* خلفية الروبوت */}
        <div className="relative w-full h-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-2xl border border-gray-600 overflow-hidden">
          {/* تأثير الإضاءة */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-50"></div>
          
          {/* SVG الروبوت */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 200 300"
            className="relative z-10"
          >
            {/* جسم الروبوت */}
            <g transform={`translate(100, 150) rotate(${robotState.headRotation.z})`}>
              {/* الجسم الرئيسي */}
              <rect
                x="-40"
                y="20"
                width="80"
                height="100"
                rx="10"
                fill={colors.primary}
                stroke={colors.light}
                strokeWidth="2"
              />
              
              {/* الرأس */}
              <g transform={`rotate(${robotState.headRotation.y})`}>
                <rect
                  x="-35"
                  y="-40"
                  width="70"
                  height="50"
                  rx="15"
                  fill={colors.metal}
                  stroke={colors.light}
                  strokeWidth="2"
                />
                
                {/* العيون */}
                <circle
                  cx="-15"
                  cy="-20"
                  r="8"
                  fill={robotState.eyeState === 'glow' ? colors.glow : colors.accent}
                  className={robotState.eyeState === 'blink' ? 'opacity-20' : 'opacity-100'}
                >
                  {robotState.eyeState === 'glow' && (
                    <animate
                      attributeName="r"
                      values="8;10;8"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  )}
                </circle>
                <circle
                  cx="15"
                  cy="-20"
                  r="8"
                  fill={robotState.eyeState === 'glow' ? colors.glow : colors.accent}
                  className={robotState.eyeState === 'blink' ? 'opacity-20' : 'opacity-100'}
                >
                  {robotState.eyeState === 'glow' && (
                    <animate
                      attributeName="r"
                      values="8;10;8"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  )}
                </circle>
                
                {/* الفم */}
                <rect
                  x="-20"
                  y="-5"
                  width="40"
                  height="8"
                  rx="4"
                  fill={robotState.mouthState === 'smile' ? colors.glow : colors.secondary}
                  className={robotState.mouthState === 'speaking' ? 'animate-pulse' : ''}
                />
              </g>
              
              {/* الذراع الأيمن */}
              <g transform={`translate(40, 30) translate(${robotState.rightArmPosition.x * 50}, ${robotState.rightArmPosition.y * 50}) rotate(${robotState.rightArmPosition.z * 45})`}>
                <rect
                  x="0"
                  y="-8"
                  width="50"
                  height="16"
                  rx="8"
                  fill={colors.primary}
                  stroke={colors.light}
                  strokeWidth="1"
                />
                
                {/* اليد اليمنى */}
                <g transform="translate(50, 0)">
                  {robotState.rightHandGesture === 'wave' && (
                    <g>
                      <circle cx="0" cy="0" r="12" fill={colors.accent} />
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        values="0;20;-20;0"
                        dur="0.5s"
                        repeatCount="indefinite"
                      />
                    </g>
                  )}
                  {robotState.rightHandGesture === 'thumbs_up' && (
                    <g>
                      <rect x="-8" y="-8" width="16" height="16" rx="4" fill={colors.secondary} />
                      <rect x="-2" y="-12" width="4" height="8" rx="2" fill={colors.glow} />
                    </g>
                  )}
                  {robotState.rightHandGesture === 'neutral' && (
                    <circle cx="0" cy="0" r="10" fill={colors.accent} />
                  )}
                </g>
              </g>
              
              {/* الذراع الأيسر */}
              <g transform={`translate(-40, 30) translate(${robotState.leftArmPosition.x * 50}, ${robotState.leftArmPosition.y * 50}) rotate(${robotState.leftArmPosition.z * -45})`}>
                <rect
                  x="-50"
                  y="-8"
                  width="50"
                  height="16"
                  rx="8"
                  fill={colors.primary}
                  stroke={colors.light}
                  strokeWidth="1"
                />
                
                {/* اليد اليسرى */}
                <g transform="translate(-50, 0)">
                  {robotState.leftHandGesture === 'letter_w' && (
                    <g>
                      <rect x="-10" y="-10" width="20" height="20" rx="4" fill={colors.secondary} />
                      <text x="0" y="5" textAnchor="middle" fill={colors.light} fontSize="12">W</text>
                    </g>
                  )}
                  {robotState.leftHandGesture === 'neutral' && (
                    <circle cx="0" cy="0" r="10" fill={colors.accent} />
                  )}
                </g>
              </g>
              
              {/* مؤشر حالة النشاط */}
              {isAnimating && (
                <g transform="translate(0, -60)">
                  <circle
                    cx="0"
                    cy="0"
                    r="5"
                    fill={colors.glow}
                    opacity="0.8"
                  >
                    <animate
                      attributeName="r"
                      values="3;8;3"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.8;0.3;0.8"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              )}
            </g>
            
            {/* تأثيرات ضوئية إضافية */}
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
          </svg>
          
          {/* شريط التقدم للرسوم المتحركة */}
          {isAnimating && (
            <div className="absolute bottom-2 left-2 right-2 h-1 bg-gray-600 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: "linear" }}
              />
            </div>
          )}
          
          {/* تسمية توضيحية */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 text-center">
            {language === 'ar' ? 'مترجم لغة الإشارة' : 'Sign Language Interpreter'}
          </div>
        </div>
        
        {/* أزرار التحكم */}
        <div className="absolute -top-8 right-0 flex space-x-1">
          <button
            onClick={() => setRobotState(prev => ({ ...prev, bodyPosture: 'greeting' }))}
            className="w-6 h-6 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white text-xs"
            title={language === 'ar' ? 'تحية' : 'Greeting'}
          >
            👋
          </button>
          <button
            onClick={resetToIdleState}
            className="w-6 h-6 bg-gray-600 hover:bg-gray-700 rounded-full flex items-center justify-center text-white text-xs"
            title={language === 'ar' ? 'إعادة تعيين' : 'Reset'}
          >
            🔄
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}