import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, AlertCircle, Loader } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  address?: string;
  timestamp: number;
}

interface LocationServiceProps {
  onLocationUpdate: (location: LocationData) => void;
  onError?: (error: string) => void;
  autoRequest?: boolean;
  showControls?: boolean;
  className?: string;
}

export function LocationService({
  onLocationUpdate,
  onError,
  autoRequest = false,
  showControls = true,
  className = ""
}: LocationServiceProps) {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [error, setError] = useState<string>('');
  const [isSupported, setIsSupported] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [isWatching, setIsWatching] = useState(false);

  // التحقق من دعم المتصفح للموقع الجغرافي
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      setIsSupported(true);
      
      if (autoRequest) {
        getCurrentLocation();
      }
    } else {
      setIsSupported(false);
      const errorMessage = 'المتصفح لا يدعم خدمات الموقع الجغرافي';
      setError(errorMessage);
      if (onError) onError(errorMessage);
    }
  }, [autoRequest]);

  // تنظيف الموارد عند إلغاء المكون
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const getCurrentLocation = () => {
    if (!isSupported || isGettingLocation) return;

    setIsGettingLocation(true);
    setError('');

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000 // 1 minute cache
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };

        // محاولة الحصول على العنوان (Reverse Geocoding)
        reverseGeocode(locationData.latitude, locationData.longitude)
          .then(address => {
            locationData.address = address;
            setLocation(locationData);
            onLocationUpdate(locationData);
          })
          .catch(() => {
            // استخدام الموقع بدون عنوان إذا فشل Reverse Geocoding
            setLocation(locationData);
            onLocationUpdate(locationData);
          });

        setIsGettingLocation(false);
      },
      (error) => {
        setIsGettingLocation(false);
        let errorMessage = '';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'تم رفض الإذن للوصول إلى الموقع. يرجى منح الإذن في إعدادات المتصفح.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'معلومات الموقع غير متاحة حالياً.';
            break;
          case error.TIMEOUT:
            errorMessage = 'انتهت مهلة طلب الموقع. يرجى المحاولة مرة أخرى.';
            break;
          default:
            errorMessage = 'حدث خطأ أثناء الحصول على الموقع.';
            break;
        }
        
        setError(errorMessage);
        console.warn('Location error:', errorMessage, error);
        if (onError) onError(errorMessage);
      },
      options
    );
  };

  const startWatchingLocation = () => {
    if (!isSupported || isWatching) return;

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 30000 // 30 seconds cache for watching
    };

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };

        reverseGeocode(locationData.latitude, locationData.longitude)
          .then(address => {
            locationData.address = address;
            setLocation(locationData);
            onLocationUpdate(locationData);
          })
          .catch(() => {
            setLocation(locationData);
            onLocationUpdate(locationData);
          });
      },
      (error) => {
        console.warn('Watch location error:', error);
      },
      options
    );

    setWatchId(id);
    setIsWatching(true);
  };

  const stopWatchingLocation = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsWatching(false);
    }
  };

  // محاكاة Reverse Geocoding (في التطبيق الحقيقي، استخدم Google Maps Geocoding API)
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      // محاكاة تأخير الشبكة
      setTimeout(() => {
        // عناوين وهمية بناءً على الإحداثيات تقريبياً
        const mockAddresses = [
          'شارع الجامعة، عمان، الأردن',
          'شارع الملكة رانيا، عمان، الأردن',
          'شارع عبدالله غوشة، عمان، الأردن',
          'شارع وادي صقرة، عمان، الأردن'
        ];
        
        const randomAddress = mockAddresses[Math.floor(Math.random() * mockAddresses.length)];
        resolve(randomAddress);
      }, 500);
    });
  };

  const getAccuracyLevel = (accuracy: number) => {
    if (accuracy <= 10) return { level: 'عالية جداً', color: 'bg-green-500' };
    if (accuracy <= 50) return { level: 'عالية', color: 'bg-blue-500' };
    if (accuracy <= 100) return { level: 'متوسطة', color: 'bg-yellow-500' };
    return { level: 'منخفضة', color: 'bg-red-500' };
  };

  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ar-JO', {
      timeZone: 'Asia/Amman',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isSupported) {
    return (
      <Card className={className}>
        <CardContent className="p-4 text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
          <p className="text-sm text-muted-foreground">
            المتصفح لا يدعم خدمات الموقع الجغرافي
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!showControls) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={getCurrentLocation}
        disabled={isGettingLocation}
        className={className}
        aria-label="الحصول على الموقع الحالي"
      >
        {isGettingLocation ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <MapPin className="w-4 h-4" />
        )}
      </Button>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-reverse space-x-2">
          <MapPin className="w-5 h-5" />
          <span>خدمة الموقع الجغرافي</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* أزرار التحكم */}
        <div className="flex space-x-reverse space-x-3">
          <Button
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            className="flex-1"
          >
            {isGettingLocation ? (
              <Loader className="w-4 h-4 animate-spin ml-2" />
            ) : (
              <MapPin className="w-4 h-4 ml-2" />
            )}
            {isGettingLocation ? 'جاري التحديد...' : 'الحصول على الموقع'}
          </Button>

          {!isWatching ? (
            <Button
              onClick={startWatchingLocation}
              variant="outline"
              disabled={isGettingLocation}
            >
              <Navigation className="w-4 h-4 ml-2" />
              تتبع
            </Button>
          ) : (
            <Button
              onClick={stopWatchingLocation}
              variant="outline"
            >
              إيقاف التتبع
            </Button>
          )}
        </div>

        {/* معلومات الموقع */}
        {location && (
          <div className="space-y-3 pt-3 border-t">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">الموقع الحالي:</h4>
              <div className="flex items-center space-x-reverse space-x-2">
                {isWatching && (
                  <Badge variant="secondary" className="animate-pulse">
                    يتابع
                  </Badge>
                )}
                <Badge 
                  variant="outline"
                  className={`${getAccuracyLevel(location.accuracy).color} text-white border-none`}
                >
                  دقة {getAccuracyLevel(location.accuracy).level}
                </Badge>
              </div>
            </div>

            {location.address && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-medium mb-1">العنوان:</p>
                <p className="text-sm">{location.address}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-muted-foreground">الإحداثيات:</p>
                <p className="text-sm font-mono">
                  {formatCoordinates(location.latitude, location.longitude)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-muted-foreground">دقة الموقع:</p>
                  <p className="text-sm">{Math.round(location.accuracy)} متر</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-muted-foreground">آخر تحديث:</p>
                  <p className="text-sm">{formatTimestamp(location.timestamp)}</p>
                </div>
              </div>
            </div>

            {/* معلومات إضافية */}
            <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
              <p>• يتم تحديث الموقع تلقائياً عند تفعيل التتبع</p>
              <p>• دقة الموقع تعتمد على قوة إشارة GPS والشبكة</p>
              <p>• يتم حفظ الموقع محلياً ولا يرسل لخوادم خارجية</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// مكون مبسط للموقع
export function QuickLocation({ 
  onLocationUpdate, 
  className = "" 
}: { 
  onLocationUpdate: (location: LocationData) => void; 
  className?: string; 
}) {
  const [isGetting, setIsGetting] = useState(false);

  const getLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation || isGetting) return;

    setIsGetting(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };
        
        onLocationUpdate(locationData);
        setIsGetting(false);
      },
      (error) => {
        setIsGetting(false);
        console.warn('QuickLocation error:', error);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={getLocation}
      disabled={isGetting}
      className={className}
    >
      {isGetting ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <MapPin className="w-4 h-4" />
      )}
    </Button>
  );
}