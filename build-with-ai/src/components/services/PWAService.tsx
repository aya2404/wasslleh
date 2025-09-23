import React, { useState, useEffect } from 'react';
import { Download, Wifi, WifiOff, Smartphone, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';

interface PWAServiceProps {
  onInstall?: () => void;
  onOffline?: () => void;
  onOnline?: () => void;
  className?: string;
}

export function PWAService({ onInstall, onOffline, onOnline, className = "" }: PWAServiceProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // التحقق من حالة التثبيت
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone || isInWebAppiOS);

    // مراقبة أحداث PWA
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      
      // إظهار اقتراح التثبيت بعد 10 ثواني
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 10000);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setShowInstallPrompt(false);
      if (onInstall) onInstall();
    };

    // مراقبة حالة الاتصال
    const handleOnline = () => {
      setIsOnline(true);
      if (onOnline) onOnline();
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (onOffline) onOffline();
    };

    // تسجيل المستمعين
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // تنظيف المستمعين
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onInstall, onOffline, onOnline]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setShowInstallPrompt(false);
    }
    
    setDeferredPrompt(null);
  };

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false);
  };

  // مكون شريط الحالة
  const StatusBar = () => (
    <div className={`fixed top-0 left-0 right-0 z-50 ${isOnline ? 'bg-green-600' : 'bg-red-600'} text-white py-1 px-4 text-sm transition-all duration-300`}>
      <div className="flex items-center justify-center space-x-reverse space-x-2">
        {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
        <span>{isOnline ? 'متصل' : 'غير متصل - يعمل في الوضع المحلي'}</span>
      </div>
    </div>
  );

  // مكون اقتراح التثبيت
  const InstallPrompt = () => {
    if (!showInstallPrompt || !isInstallable) return null;

    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:w-96">
        <Card className="border-2 border-blue-500 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-reverse space-x-2 text-lg">
                <Smartphone className="w-5 h-5 text-blue-600" />
                <span>تثبيت وصال</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissInstallPrompt}
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              ثبت وصال على جهازك للحصول على تجربة أفضل وإمكانية الوصول السريع!
            </p>
            <div className="flex space-x-reverse space-x-3">
              <Button onClick={handleInstallClick} className="flex-1">
                <Download className="w-4 h-4 ml-2" />
                تثبيت الآن
              </Button>
              <Button variant="outline" onClick={dismissInstallPrompt}>
                لاحقاً
              </Button>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• وصول سريع من الشاشة الرئيسية</p>
              <p>• يعمل بدون اتصال إنترنت</p>
              <p>• إشعارات تلقائية للفرص الجديدة</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <>
      {/* شريط حالة الاتصال */}
      {!isOnline && <StatusBar />}

      {/* اقتراح التثبيت */}
      <InstallPrompt />

      {/* معلومات PWA */}
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-reverse space-x-2">
            <Smartphone className="w-5 h-5" />
            <span>حالة التطبيق</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* حالة التثبيت */}
          <div className="flex items-center justify-between">
            <span className="text-sm">حالة التثبيت:</span>
            <Badge variant={isInstalled ? "default" : "outline"}>
              {isInstalled ? 'مثبت' : 'غير مثبت'}
            </Badge>
          </div>

          {/* حالة الاتصال */}
          <div className="flex items-center justify-between">
            <span className="text-sm">حالة الاتصال:</span>
            <Badge variant={isOnline ? "default" : "destructive"}>
              {isOnline ? (
                <><Wifi className="w-3 h-3 ml-1" /> متصل</>
              ) : (
                <><WifiOff className="w-3 h-3 ml-1" /> غير متصل</>
              )}
            </Badge>
          </div>

          {/* إمكانية التثبيت */}
          {isInstallable && !isInstalled && (
            <div className="pt-3 border-t">
              <Button onClick={handleInstallClick} className="w-full">
                <Download className="w-4 h-4 ml-2" />
                تثبيت التطبيق
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                استمتع بتجربة أفضل مع التطبيق المثبت
              </p>
            </div>
          )}

          {/* رسالة للمستخدمين المثبتين */}
          {isInstalled && (
            <Alert>
              <Smartphone className="w-4 h-4" />
              <AlertDescription>
                تم تثبيت وصال بنجاح! يمكنك الوصول إليه من الشاشة الرئيسية.
              </AlertDescription>
            </Alert>
          )}

          {/* معلومات الوضع المحلي */}
          {!isOnline && (
            <Alert>
              <WifiOff className="w-4 h-4" />
              <AlertDescription>
                يعمل التطبيق حالياً في الوضع المحلي. بعض الميزات قد تكون محدودة.
              </AlertDescription>
            </Alert>
          )}

          {/* إحصائيات الاستخدام */}
          <div className="pt-3 border-t">
            <h4 className="text-sm font-medium mb-2">ميزات التطبيق:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-reverse space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>يعمل بدون إنترنت</span>
              </div>
              <div className="flex items-center space-x-reverse space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>تحديثات تلقائية</span>
              </div>
              <div className="flex items-center space-x-reverse space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>إشعارات ذكية</span>
              </div>
              <div className="flex items-center space-x-reverse space-x-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>وصول سريع</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// Hook مخصص لـ PWA
export function usePWA() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstallPromptAvailable, setIsInstallPromptAvailable] = useState(false);
  
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone || isInWebAppiOS);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleBeforeInstallPrompt = () => setIsInstallPromptAvailable(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return {
    isInstalled,
    isOnline,
    isInstallPromptAvailable,
    canInstall: isInstallPromptAvailable && !isInstalled
  };
}