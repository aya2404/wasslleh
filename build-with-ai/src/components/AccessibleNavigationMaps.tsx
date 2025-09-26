import React, { useState, useEffect, useRef } from 'react';
import { Navigation, MapPin, Car, Train, Bus, Clock, DollarSign, Star, Route, Zap, Activity, CheckCircle, AlertTriangle, Wifi, Phone, Settings, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useTranslation } from './services/TranslationService';
import { toast } from 'sonner@2.0.3';

// مكون هيدر المسارات الآمنة
function SafePathsHeader({ language, isRTL }) {
  return (
    <div className="text-center space-y-6 mb-8">
      <div className="flex items-center justify-center space-x-3">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 via-orange-500 to-green-500 rounded-full flex items-center justify-center shadow-xl">
          <Navigation className="w-8 h-8 text-white" />
        </div>
      </div>
      <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-purple-600 via-orange-500 to-green-500 bg-clip-text text-transparent">
        {language === 'ar' ? 'المسارات الآمنة الذكية' : 'Smart Safe Paths'}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
        {language === 'ar' 
          ? 'اختر وسيلة المواصلات المفضلة واتركنا نجد لك أفضل مسارين آمنين بتقنية الذكاء الاصطناعي'
          : 'Choose your preferred transportation and let us find the best two safe routes with AI technology'
        }
      </p>
    </div>
  );
}

// مكون اختيار المواصلات ونقاط الرحلة
function TransportationSelector({ 
  origin, setOrigin, 
  destination, setDestination, 
  selectedTransports, setSelectedTransports,
  disabilityType, setDisabilityType, 
  onFindRoutes, 
  language, isRTL 
}) {
  const transportOptions = [
    { id: 'walking', name: language === 'ar' ? 'مشي' : 'Walking', icon: '🚶‍♂️' },
    { id: 'bus', name: language === 'ar' ? 'حافلة عامة' : 'Public Bus', icon: '🚌' },
    { id: 'taxi', name: language === 'ar' ? 'تاكسي' : 'Taxi', icon: '🚕' },
    { id: 'metro', name: language === 'ar' ? 'مترو' : 'Metro', icon: '🚇' },
    { id: 'bike', name: language === 'ar' ? 'دراجة' : 'Bicycle', icon: '🚲' },
    { id: 'car', name: language === 'ar' ? 'سيارة خاصة' : 'Private Car', icon: '🚗' }
  ];

  const disabilityOptions = [
    { value: 'none', label: language === 'ar' ? 'بدون إعاقة' : 'No Disability', color: '#6b7280' },
    { value: 'mobility', label: language === 'ar' ? 'إعاقة حركية' : 'Mobility Impairment', color: '#504e76' },
    { value: 'visual', label: language === 'ar' ? 'إعاقة بصرية' : 'Visual Impairment', color: '#e06e35' },
    { value: 'hearing', label: language === 'ar' ? 'إعاقة سمعية' : 'Hearing Impairment', color: '#8e955f' }
  ];

  const selectedOption = disabilityOptions.find(option => option.value === disabilityType);

  const toggleTransport = (transportId) => {
    setSelectedTransports(prev => {
      if (prev.includes(transportId)) {
        return prev.filter(id => id !== transportId);
      } else {
        return [...prev, transportId];
      }
    });
  };

  return (
    <Card className="mb-6 shadow-lg border-0 bg-white dark:bg-gray-800 overflow-hidden">
      <CardHeader className="pb-4 px-6 pt-6">
        <CardTitle className="flex items-center space-x-3 text-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-orange-500 rounded-full flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
            {language === 'ar' ? 'تخطيط الرحلة الذكية' : 'Smart Trip Planning'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6">
        {/* نقاط الرحلة */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              {language === 'ar' ? 'من' : 'From'}
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-500" />
              <Input
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder={language === 'ar' ? 'أدخل نقطة البداية' : 'Enter starting point'}
                className="pl-10 h-12 border-2 border-purple-200 focus:border-purple-500 rounded-lg text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              {language === 'ar' ? 'إلى' : 'To'}
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-orange-500" />
              <Input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder={language === 'ar' ? 'أدخل الوجهة' : 'Enter destination'}
                className="pl-10 h-12 border-2 border-orange-200 focus:border-orange-500 rounded-lg text-base"
              />
            </div>
          </div>
        </div>

        {/* اختيار وسائل المواصلات */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            {language === 'ar' ? 'اختر وسائل المواصلات المفضلة' : 'Choose Preferred Transportation'}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {transportOptions.map((transport) => (
              <button
                key={transport.id}
                onClick={() => toggleTransport(transport.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedTransports.includes(transport.id)
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-purple-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-2xl">{transport.icon}</span>
                  <span className="text-sm font-medium text-center">{transport.name}</span>
                </div>
                {selectedTransports.includes(transport.id) && (
                  <CheckCircle className="w-4 h-4 text-purple-500 mx-auto mt-1" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* نوع الإعاقة */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            {language === 'ar' ? 'نوع الإعاقة' : 'Accessibility Needs'}
          </label>
          <Select value={disabilityType} onValueChange={setDisabilityType}>
            <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-purple-500 rounded-lg text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {disabilityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full border border-white shadow-sm" 
                      style={{ backgroundColor: option.color }}
                    />
                    <span className="text-sm">{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* زر البحث */}
        <Button 
          onClick={onFindRoutes}
          disabled={!origin || !destination || selectedTransports.length === 0}
          className="w-full h-14 text-lg font-bold bg-gradient-to-r from-purple-600 via-orange-500 to-green-500 hover:from-purple-700 hover:via-orange-600 hover:to-green-600 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
          style={{
            background: selectedOption ? `linear-gradient(135deg, ${selectedOption.color}AA, ${selectedOption.color}CC)` : undefined
          }}
        >
          <Route className="w-6 h-6 mr-2" />
          {language === 'ar' ? 'البحث عن أفضل مسارين' : 'Find Best Two Routes'}
        </Button>
      </CardContent>
    </Card>
  );
}

// مكون الخريطة التفاعلية
function InteractiveMap({ routes, language, isRTL, disabilityType }) {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        if (typeof window !== 'undefined' && !window.L) {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = () => {
            if (window.L && mapRef.current && !leafletMapRef.current) {
              try {
                const DefaultIcon = window.L.icon({
                  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDOC4xMzQgMiA1IDUuMTM0IDUgOUM1IDEyLjc1IDEyIDIyIDEyIDIyUzE5IDEyLjc1IDE5IDlDMTkgNS4xMzQgMTUuODY2IDIgMTIgMloiIGZpbGw9IiNGRjAwMDAiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iOSIgcj0iMyIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4K',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDEiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCA0MSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGVsbGlwc2UgY3g9IjIwLjUiIGN5PSIzNy41IiByeD0iMTguNSIgcnk9IjMuNSIgZmlsbD0iIzAwMDAwMCIgZmlsbC1vcGFjaXR5PSIwLjMiLz4KPC9zdmc+',
                  shadowSize: [41, 41]
                });

                window.L.Marker.prototype.options.icon = DefaultIcon;

                const map = window.L.map(mapRef.current, {
                  zoomControl: true,
                  attributionControl: true
                }).setView([31.9539, 35.9106], 13);

                window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  maxZoom: 19,
                  attribution: '© OpenStreetMap contributors',
                  errorTileUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEyOCIgeT0iMTI4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUIxMTFFIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiPk1hcCBUaWxlPC90ZXh0Pgo8L3N2Zz4K'
                }).addTo(map);

                leafletMapRef.current = map;
                setIsMapReady(true);
                setMapError(false);
              } catch (error) {
                console.warn('Could not initialize map:', error);
                setMapError(true);
              }
            }
          };
          script.onerror = () => {
            console.warn('Could not load Leaflet from CDN');
            setMapError(true);
          };
          document.head.appendChild(script);
        } else if (window.L && mapRef.current && !leafletMapRef.current) {
          try {
            const map = window.L.map(mapRef.current).setView([31.9539, 35.9106], 13);
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            leafletMapRef.current = map;
            setIsMapReady(true);
          } catch (error) {
            setMapError(true);
          }
        }
      } catch (error) {
        console.warn('Error loading Leaflet:', error);
        setMapError(true);
      }
    };

    loadLeaflet();

    return () => {
      if (leafletMapRef.current) {
        try {
          leafletMapRef.current.remove();
          leafletMapRef.current = null;
        } catch (error) {
          console.warn('Error cleaning up map:', error);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (routes && routes.length > 0 && leafletMapRef.current && window.L && isMapReady) {
      try {
        // مسح الطبقات السابقة
        leafletMapRef.current.eachLayer((layer) => {
          if (layer instanceof window.L.Marker || layer instanceof window.L.Polyline) {
            leafletMapRef.current.removeLayer(layer);
          }
        });

        let allBounds = [];

        routes.forEach((route, index) => {
          // إضافة نقاط البداية والنهاية
          const startMarker = window.L.marker(route.coordinates[0]).addTo(leafletMapRef.current);
          const endMarker = window.L.marker(route.coordinates[route.coordinates.length - 1]).addTo(leafletMapRef.current);
          
          startMarker.bindPopup(language === 'ar' ? 'نقطة البداية' : 'Start Point');
          endMarker.bindPopup(language === 'ar' ? 'الوجهة' : 'Destination');

          // إضافة خط المسار
          const routeLine = window.L.polyline(route.coordinates, {
            color: route.color,
            weight: index === 0 ? 6 : 4,
            opacity: index === 0 ? 0.9 : 0.7,
            dashArray: index === 0 ? null : '10, 5'
          }).addTo(leafletMapRef.current);

          // إضافة نافذة منبثقة للمسار
          routeLine.bindPopup(`
            <div class="font-bold">${route.title}</div>
            <div class="text-sm">
              ${language === 'ar' ? 'المسافة:' : 'Distance:'} ${route.distance}<br/>
              ${language === 'ar' ? 'الوقت:' : 'Time:'} ${route.duration}<br/>
              ${language === 'ar' ? 'التكلفة:' : 'Cost:'} ${route.cost} ${language === 'ar' ? 'دينار' : 'JOD'}
            </div>
          `);

          allBounds = allBounds.concat(route.coordinates);
        });

        // تحديد حدود الخريطة لإظهار جميع المسارات
        if (allBounds.length > 0) {
          leafletMapRef.current.fitBounds(allBounds, { padding: [30, 30] });
        }
      } catch (error) {
        console.warn('Could not update map:', error);
      }
    }
  }, [routes, language, isMapReady]);

  const renderMapFallback = () => {
    if (mapError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
          <div className="text-center space-y-4 p-8">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto">
              <MapPin className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {language === 'ar' ? 'خريطة محاكاة' : 'Simulated Map'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'ar' ? 'عذراً، لا يمكن تحميل الخريطة التفاعلية في الوقت الحالي' : 'Sorry, interactive map cannot be loaded at the moment'}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <MapPin className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {isMapReady 
              ? (language === 'ar' ? 'اختر المواصلات وابحث عن المسارات لعرضها على الخريطة' : 'Select transportation and search for routes to display on map')
              : (language === 'ar' ? 'جاري تحميل الخريطة...' : 'Loading map...')
            }
          </p>
        </div>
      </div>
    );
  };

  return (
    <Card className="mb-6 shadow-lg border-0 overflow-hidden">
      <CardHeader className="pb-3 px-6 pt-4 bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20">
        <CardTitle className="flex items-center space-x-3 text-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-orange-500 rounded-full flex items-center justify-center">
            <Navigation className="w-4 h-4 text-white" />
          </div>
          <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent font-bold">
            {language === 'ar' ? 'خريطة المسارات الحقيقية' : 'Real Routes Map'}
          </span>
          {routes && routes.length > 0 && (
            <Badge className="ml-auto bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              {routes.length} {language === 'ar' ? 'مسار' : 'Routes'}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          ref={mapRef} 
          className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900"
          style={{ minHeight: '384px' }}
        >
          {(!isMapReady || mapError || !routes || routes.length === 0) && renderMapFallback()}
        </div>
      </CardContent>
    </Card>
  );
}

// مكون تفاصيل المسار الكاملة
function RouteDetailsModal({ route, isOpen, onClose, language, isRTL }) {
  if (!isOpen || !route) return null;

  const getRouteIcon = (transport) => {
    switch (transport) {
      case 'bus': return <Bus className="w-8 h-8" />;
      case 'taxi': return <Car className="w-8 h-8" />;
      case 'metro': return <Train className="w-8 h-8" />;
      case 'walking': return '🚶‍♂️';
      case 'bike': return '🚲';
      case 'car': return <Car className="w-8 h-8" />;
      default: return <Route className="w-8 h-8" />;
    }
  };

  const getDetailedSteps = () => {
    const steps = [
      {
        step: 1,
        title: language === 'ar' ? 'البداية من النقطة المحددة' : 'Start from specified point',
        description: language === 'ar' ? 'ابدأ من الموقع الذي حددته واتبع الإرشادات الصوتية' : 'Start from your selected location and follow audio directions',
        duration: '2 min',
        distance: '0.1 km',
        icon: <MapPin className="w-5 h-5 text-green-600" />
      },
      {
        step: 2,
        title: language === 'ar' ? 'التوجه إلى محطة المواصلات' : 'Head to transportation station',
        description: language === 'ar' ? 'اتجه إلى أقرب محطة مواصلات آمنة ومجهزة' : 'Head to nearest safe and equipped transportation station',
        duration: '5 min',
        distance: '0.4 km',
        icon: <Navigation className="w-5 h-5 text-blue-600" />
      },
      {
        step: 3,
        title: language === 'ar' ? 'استخدام وسيلة المواصلات' : 'Use transportation',
        description: language === 'ar' ? `استخدم ${route.title} للوصول إلى وجهتك بأمان` : `Use ${route.title} to safely reach your destination`,
        duration: route.duration,
        distance: route.distance,
        icon: getRouteIcon(route.transport)
      },
      {
        step: 4,
        title: language === 'ar' ? 'الوصول إلى الوجهة' : 'Arrive at destination',
        description: language === 'ar' ? 'وصلت إلى وجهتك بأمان وراحة' : 'You have safely and comfortably arrived at your destination',
        duration: '1 min',
        distance: '0.05 km',
        icon: <CheckCircle className="w-5 h-5 text-green-600" />
      }
    ];
    return steps;
  };

  const getSafetyFeatures = () => {
    const features = [
      {
        title: language === 'ar' ? 'مراقبة مباشرة' : 'Live Monitoring',
        description: language === 'ar' ? 'نظام مراقبة ذكي على مدار الساعة' : '24/7 intelligent monitoring system',
        icon: <Shield className="w-5 h-5 text-blue-600" />
      },
      {
        title: language === 'ar' ? 'دعم طوارئ' : 'Emergency Support',
        description: language === 'ar' ? 'خدمة طوارئ سريعة الاستجابة' : 'Quick response emergency service',
        icon: <Phone className="w-5 h-5 text-red-600" />
      },
      {
        title: language === 'ar' ? 'إنترنت مجاني' : 'Free WiFi',
        description: language === 'ar' ? 'اتصال إنترنت مجاني وآمن' : 'Free and secure internet connection',
        icon: <Wifi className="w-5 h-5 text-green-600" />
      },
      {
        title: language === 'ar' ? 'إرشاد ذكي' : 'Smart Guidance',
        description: language === 'ar' ? 'نظام إرشاد متطور بالذكاء الاصطناعي' : 'Advanced AI guidance system',
        icon: <Activity className="w-5 h-5 text-purple-600" />
      }
    ];
    return features;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-orange-500 rounded-xl flex items-center justify-center">
                {getRouteIcon(route.transport)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {route.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">{route.description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full w-10 h-10 p-0"
            >
              ✕
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Route Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-purple-600">{route.distance}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {language === 'ar' ? 'المسافة' : 'Distance'}
              </div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-blue-600">{route.duration}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {language === 'ar' ? 'الوقت' : 'Time'}
              </div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-green-600">{route.cost}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {language === 'ar' ? 'دينار أردني' : 'JOD'}
              </div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-orange-600">{route.confidence}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {language === 'ar' ? 'ثقة الذكاء الاصطناعي' : 'AI Confidence'}
              </div>
            </Card>
          </div>

          {/* Detailed Steps */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Route className="w-6 h-6 mr-2" />
              {language === 'ar' ? 'خطوات المسار المفصلة' : 'Detailed Route Steps'}
            </h3>
            <div className="space-y-4">
              {getDetailedSteps().map((step, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                        {step.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold flex items-center">
                          {step.icon}
                          <span className="ml-2">{step.title}</span>
                        </h4>
                        <div className="flex space-x-2 text-sm text-gray-500">
                          <span>{step.duration}</span>
                          <span>•</span>
                          <span>{step.distance}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Safety Features */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-2" />
              {language === 'ar' ? 'ميزات الأمان والسلامة' : 'Safety & Security Features'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getSafetyFeatures().map((feature, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* AI Recommendation */}
          <Card className="p-6 bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Activity className="w-6 h-6 mr-2" />
              {language === 'ar' ? 'توصية الذكاء الاصطناعي' : 'AI Recommendation'}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{route.aiRecommendation}</p>
            <div className="flex items-center">
              <span className="text-sm mr-3">{language === 'ar' ? 'مستوى الثقة:' : 'Confidence Level:'}</span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="h-3 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full transition-all duration-1000"
                  style={{ width: `${route.confidence}%` }}
                ></div>
              </div>
              <span className="ml-3 font-bold">{route.confidence}%</span>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <Button 
              className="flex-1 bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white"
              onClick={() => {
                toast.success(language === 'ar' ? 'تم بدء الملاحة!' : 'Navigation started!');
                onClose();
              }}
            >
              <Navigation className="w-5 h-5 mr-2" />
              {language === 'ar' ? 'بدء الملاحة' : 'Start Navigation'}
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              {language === 'ar' ? 'إغلاق' : 'Close'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// مكون عرض أفضل مسارين
function BestRoutesDisplay({ routes, language, isRTL, onSelectRoute }) {
  const [selectedRouteDetails, setSelectedRouteDetails] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  if (!routes || routes.length === 0) {
    return null;
  }

  const getRouteIcon = (transport) => {
    switch (transport) {
      case 'bus': return <Bus className="w-6 h-6" />;
      case 'taxi': return <Car className="w-6 h-6" />;
      case 'metro': return <Train className="w-6 h-6" />;
      case 'walking': return '🚶‍♂️';
      case 'bike': return '🚲';
      case 'car': return <Car className="w-6 h-6" />;
      default: return <Route className="w-6 h-6" />;
    }
  };

  const handleShowDetails = (route) => {
    setSelectedRouteDetails(route);
    setShowDetailsModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
          {language === 'ar' ? 'أفضل مسارين موصى بهما' : 'Top Two Recommended Routes'}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {language === 'ar' ? 'تم اختيارهما بواسطة الذكاء الاصطناعي بناءً على تفضيلاتك' : 'Selected by AI based on your preferences'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {routes.map((route, index) => (
          <Card key={index} className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer ${
            index === 0 
              ? 'border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' 
              : 'border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
          }`} onClick={() => onSelectRoute && onSelectRoute(route)}>
            
            {/* شريط الترتيب */}
            <div className={`absolute top-0 left-0 right-0 h-2 ${
              index === 0 ? 'bg-green-500' : 'bg-blue-500'
            }`} />

            {/* شارة التوصية */}
            {index === 0 && (
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                <Star className="w-3 h-3 inline mr-1" />
                {language === 'ar' ? 'الأفضل' : 'Best'}
              </div>
            )}

            <CardHeader className="pb-3 pt-6">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    index === 0 ? 'bg-green-100 dark:bg-green-800' : 'bg-blue-100 dark:bg-blue-800'
                  }`}>
                    {getRouteIcon(route.transport)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{route.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{route.description}</p>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* معلومات أساسية */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg">
                  <div className={`text-lg font-bold ${index === 0 ? 'text-green-600' : 'text-blue-600'}`}>
                    {route.distance}
                  </div>
                  <div className="text-xs text-gray-500">{language === 'ar' ? 'المسافة' : 'Distance'}</div>
                </div>
                <div className="text-center p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg">
                  <div className={`text-lg font-bold ${index === 0 ? 'text-green-600' : 'text-blue-600'}`}>
                    {route.duration}
                  </div>
                  <div className="text-xs text-gray-500">{language === 'ar' ? 'الوقت' : 'Time'}</div>
                </div>
                <div className="text-center p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg">
                  <div className={`text-lg font-bold ${index === 0 ? 'text-green-600' : 'text-blue-600'}`}>
                    {route.cost}
                  </div>
                  <div className="text-xs text-gray-500">{language === 'ar' ? 'دينار' : 'JOD'}</div>
                </div>
              </div>

              {/* تفاصيل المسار */}
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-semibold mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'تفاصيل المسار' : 'Route Details'}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span>{route.startLocation}</span>
                  </div>
                  {route.stops && route.stops.map((stop, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-600">
                      <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                      <span>{stop}</span>
                    </div>
                  ))}
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span>{route.endLocation}</span>
                  </div>
                </div>
              </div>

              {/* ميزات المسار */}
              <div className="flex flex-wrap gap-2">
                {route.features && route.features.map((feature, idx) => (
                  <Badge key={idx} className={`text-xs ${
                    index === 0 
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                  }`}>
                    {feature}
                  </Badge>
                ))}
              </div>

              {/* توصية الذكاء الاصطناعي */}
              <div className={`p-3 rounded-lg border-l-4 ${
                index === 0 
                  ? 'bg-green-50 border-green-400 dark:bg-green-900/30' 
                  : 'bg-blue-50 border-blue-400 dark:bg-blue-900/30'
              }`}>
                <div className="flex items-center mb-2">
                  <Activity className="w-4 h-4 mr-2" />
                  <span className="font-semibold text-sm">
                    {language === 'ar' ? 'توصية الذكاء الاصطناعي' : 'AI Recommendation'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {route.aiRecommendation}
                </p>
                <div className="mt-2 flex items-center">
                  <span className="text-xs mr-2">{language === 'ar' ? 'ثقة:' : 'Confidence:'}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${index === 0 ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${route.confidence}%` }}
                    ></div>
                  </div>
                  <span className="text-xs ml-2">{route.confidence}%</span>
                </div>
              </div>

              {/* زر التفاصيل */}
              <Button 
                className={`w-full ${
                  index === 0 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleShowDetails(route);
                }}
              >
                {language === 'ar' ? 'عرض التفاصيل الكاملة' : 'View Full Details'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Route Details Modal */}
      <RouteDetailsModal
        route={selectedRouteDetails}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedRouteDetails(null);
        }}
        language={language}
        isRTL={isRTL}
      />
    </div>
  );
}

// المكون الرئيسي
export function AccessibleNavigationMaps() {
  const { t, language, isRTL } = useTranslation();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedTransports, setSelectedTransports] = useState([]);
  const [disabilityType, setDisabilityType] = useState('none');
  const [routes, setRoutes] = useState(null);
  const [loading, setLoading] = useState(false);

  // الذكاء الاصطناعي لاختيار أفضل مسارين
  const generateAIOptimizedRoutes = (origin, destination, transports, disabilityType) => {
    // محاكاة استدعاء الذكاء الاصطناعي لاختيار أفضل مسارين
    const allPossibleRoutes = [];

    // إنشاء مسارات محتملة لكل وسيلة مواصلات
    transports.forEach(transport => {
      const routeData = generateRouteData(transport, disabilityType, language);
      allPossibleRoutes.push(routeData);
    });

    // خوارزمية الذكاء الاصطناعي لاختيار أفضل مسارين
    // تأخذ في الاعتبار: الأمان، السرعة، التكلفة، سهولة الوصول
    const scoredRoutes = allPossibleRoutes.map(route => {
      let score = 0;
      
      // تسجيل النقاط بناءً على عوامل مختلفة
      if (disabilityType === 'mobility') {
        if (route.transport === 'bus' || route.transport === 'taxi') score += 30;
        if (route.accessibility) score += 25;
      } else if (disabilityType === 'visual') {
        if (route.transport === 'taxi') score += 25;
        if (route.audioGuidance) score += 20;
      } else if (disabilityType === 'hearing') {
        if (route.transport === 'metro') score += 25;
        if (route.visualSignals) score += 20;
      }

      // عوامل عامة
      score += (100 - parseFloat(route.cost)) * 0.3; // التكلفة الأقل أفضل
      score += (60 - parseFloat(route.duration.replace(/[^\d]/g, ''))) * 0.5; // الوقت الأقل أفضل
      score += route.safetyRating * 0.4; // تقييم الأمان

      return { ...route, aiScore: score };
    });

    // ترتيب المسارات وأخذ أفضل اثنين
    const topRoutes = scoredRoutes
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 2);

    return topRoutes;
  };

  // توليد بيانات المسار لكل وسيلة مواصلات
  const generateRouteData = (transport, disabilityType, language) => {
    const transportData = {
      bus: {
        title: language === 'ar' ? 'حافلة عامة' : 'Public Bus',
        description: language === 'ar' ? 'حافلة مجهزة للوصولية' : 'Accessibility-equipped bus',
        distance: '2.3 km',
        duration: '15 min',
        cost: '0.8',
        color: '#22c55e',
        startLocation: language === 'ar' ? 'محطة وسط البلد' : 'Downtown Station',
        endLocation: language === 'ar' ? 'محطة الجامعة' : 'University Station',
        stops: [
          language === 'ar' ? 'محطة السوق' : 'Market Station',
          language === 'ar' ? 'محطة المستشفى' : 'Hospital Station'
        ],
        features: [
          language === 'ar' ? 'مجهز للكراسي' : 'Wheelchair accessible',
          language === 'ar' ? 'مكيف' : 'Air conditioned',
          language === 'ar' ? 'WiFi مجاني' : 'Free WiFi'
        ],
        accessibility: true,
        safetyRating: 85,
        coordinates: [
          [31.9539, 35.9106],
          [31.9560, 35.9120],
          [31.9580, 35.9140],
          [31.9620, 35.9180]
        ]
      },
      taxi: {
        title: language === 'ar' ? 'تاكسي ذكي' : 'Smart Taxi',
        description: language === 'ar' ? 'تاكسي مجهز بأحدث التقنيات' : 'Taxi equipped with latest technology',
        distance: '2.1 km',
        duration: '8 min',
        cost: '7.5',
        color: '#3b82f6',
        startLocation: language === 'ar' ? 'موقعك الحالي' : 'Your Current Location',
        endLocation: language === 'ar' ? 'الوجهة مباشرة' : 'Direct to Destination',
        stops: [],
        features: [
          language === 'ar' ? 'خدمة شخصية' : 'Personal service',
          language === 'ar' ? 'نظيف ومريح' : 'Clean & comfortable',
          language === 'ar' ? 'دفع إلكتروني' : 'Electronic payment'
        ],
        accessibility: true,
        audioGuidance: true,
        safetyRating: 92,
        coordinates: [
          [31.9539, 35.9106],
          [31.9570, 35.9130],
          [31.9620, 35.9180]
        ]
      },
      metro: {
        title: language === 'ar' ? 'مترو سريع' : 'Express Metro',
        description: language === 'ar' ? 'مترو بتقنيات حديثة' : 'Metro with modern technology',
        distance: '2.8 km',
        duration: '12 min',
        cost: '1.2',
        color: '#8b5cf6',
        startLocation: language === 'ar' ? 'محطة مترو المركز' : 'Central Metro Station',
        endLocation: language === 'ar' ? 'محطة مترو الجامعة' : 'University Metro Station',
        stops: [
          language === 'ar' ? 'محطة التجارة' : 'Commerce Station'
        ],
        features: [
          language === 'ar' ? 'سريع ومنتظم' : 'Fast & regular',
          language === 'ar' ? 'إشارات بصرية' : 'Visual signals',
          language === 'ar' ? 'أمان عالي' : 'High security'
        ],
        visualSignals: true,
        safetyRating: 95,
        coordinates: [
          [31.9539, 35.9106],
          [31.9565, 35.9125],
          [31.9590, 35.9155],
          [31.9620, 35.9180]
        ]
      },
      walking: {
        title: language === 'ar' ? 'مشي' : 'Walking',
        description: language === 'ar' ? 'مسار مشي آمن ومضاء' : 'Safe and illuminated walking path',
        distance: '2.0 km',
        duration: '25 min',
        cost: '0.0',
        color: '#f59e0b',
        startLocation: language === 'ar' ? 'نقطة البداية' : 'Starting Point',
        endLocation: language === 'ar' ? 'الوجهة' : 'Destination',
        stops: [
          language === 'ar' ? 'حديقة الوسط' : 'Central Park',
          language === 'ar' ? 'ساحة الثقافة' : 'Culture Square'
        ],
        features: [
          language === 'ar' ? 'مجاني' : 'Free',
          language === 'ar' ? 'صحي' : 'Healthy',
          language === 'ar' ? 'صديق للبيئة' : 'Eco-friendly'
        ],
        safetyRating: 80,
        coordinates: [
          [31.9539, 35.9106],
          [31.9550, 35.9115],
          [31.9570, 35.9135],
          [31.9590, 35.9155],
          [31.9620, 35.9180]
        ]
      },
      bike: {
        title: language === 'ar' ? 'دراجة هوائية' : 'Bicycle',
        description: language === 'ar' ? 'مسار دراجات آمن' : 'Safe bicycle path',
        distance: '2.2 km',
        duration: '18 min',
        cost: '1.0',
        color: '#10b981',
        startLocation: language === 'ar' ? 'محطة الدراجات' : 'Bike Station',
        endLocation: language === 'ar' ? 'محطة الوصول' : 'Arrival Station',
        stops: [
          language === 'ar' ? 'نقطة استراحة' : 'Rest Point'
        ],
        features: [
          language === 'ar' ? 'سريع ومرن' : 'Fast & flexible',
          language === 'ar' ? 'رياضي' : 'Sporty',
          language === 'ar' ? 'اقتصادي' : 'Economical'
        ],
        safetyRating: 75,
        coordinates: [
          [31.9539, 35.9106],
          [31.9555, 35.9118],
          [31.9575, 35.9142],
          [31.9620, 35.9180]
        ]
      },
      car: {
        title: language === 'ar' ? 'سيارة خاصة' : 'Private Car',
        description: language === 'ar' ? 'قيادة بسيارتك الخاصة' : 'Drive with your own car',
        distance: '2.4 km',
        duration: '10 min',
        cost: '3.5',
        color: '#ef4444',
        startLocation: language === 'ar' ? 'موقف السيارات' : 'Parking Lot',
        endLocation: language === 'ar' ? 'موقف الوجهة' : 'Destination Parking',
        stops: [],
        features: [
          language === 'ar' ? 'راحة كاملة' : 'Full comfort',
          language === 'ar' ? 'خصوصية' : 'Privacy',
          language === 'ar' ? 'مرونة في التوقيت' : 'Time flexibility'
        ],
        safetyRating: 88,
        coordinates: [
          [31.9539, 35.9106],
          [31.9565, 35.9128],
          [31.9620, 35.9180]
        ]
      }
    };

    const baseRoute = transportData[transport] || transportData.bus;
    
    // إضافة توصيات الذكاء الاصطناعي المخصصة
    let aiRecommendation = '';
    let confidence = 85;

    if (disabilityType === 'mobility') {
      if (transport === 'bus') {
        aiRecommendation = language === 'ar' 
          ? 'مثالي للكراسي المتحركة مع منصة رفع ومقاعد مخصصة'
          : 'Perfect for wheelchairs with lift platform and designated seats';
        confidence = 95;
      } else if (transport === 'taxi') {
        aiRecommendation = language === 'ar'
          ? 'خدمة شخصية مع إمكانية طلب تاكسي مجهز للكراسي'
          : 'Personal service with option to request wheelchair-accessible taxi';
        confidence = 90;
      }
    } else if (disabilityType === 'visual') {
      if (transport === 'taxi') {
        aiRecommendation = language === 'ar'
          ? 'الأفضل للمكفوفين - خدمة شخصية مع إرشاد صوتي'
          : 'Best for blind users - personal service with audio guidance';
        confidence = 93;
      } else if (transport === 'bus') {
        aiRecommendation = language === 'ar'
          ? 'حافلة مع إعلانات صوتية واضحة وأزرار برايل'
          : 'Bus with clear audio announcements and Braille buttons';
        confidence = 88;
      }
    } else if (disabilityType === 'hearing') {
      if (transport === 'metro') {
        aiRecommendation = language === 'ar'
          ? 'أفضل خيار - شاشات بصرية متقدمة وإشارات ضوئية'
          : 'Best option - advanced visual displays and light signals';
        confidence = 96;
      }
    } else {
      aiRecommendation = language === 'ar'
        ? 'خيار متوازن من حيث الوقت والتكلفة والراحة'
        : 'Balanced option for time, cost, and comfort';
      confidence = 85;
    }

    return {
      ...baseRoute,
      transport,
      aiRecommendation,
      confidence
    };
  };

  // وظيفة البحث عن المسارات
  const handleFindRoutes = async () => {
    if (!origin || !destination || selectedTransports.length === 0) {
      toast.error(language === 'ar' ? 'يرجى إدخال جميع البيانات المطلوبة' : 'Please enter all required information');
      return;
    }

    setLoading(true);
    
    try {
      // محاكاة استدعاء API للذكاء الاصطناعي
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const optimizedRoutes = generateAIOptimizedRoutes(origin, destination, selectedTransports, disabilityType);
      setRoutes(optimizedRoutes);
      
      toast.success(
        language === 'ar' 
          ? 'تم العثور على أفضل مسارين بواسطة الذكاء الاصطناعي'
          : 'Found best two routes using AI technology'
      );
    } catch (error) {
      toast.error(language === 'ar' ? 'حدث خطأ في البحث' : 'Error occurred while searching');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRoute = (route) => {
    toast.success(
      language === 'ar' 
        ? `تم اختيار مسار ${route.title}` 
        : `Selected ${route.title} route`
    );
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <SafePathsHeader language={language} isRTL={isRTL} />

        {/* Transportation Selector */}
        <TransportationSelector
          origin={origin}
          setOrigin={setOrigin}
          destination={destination}
          setDestination={setDestination}
          selectedTransports={selectedTransports}
          setSelectedTransports={setSelectedTransports}
          disabilityType={disabilityType}
          setDisabilityType={setDisabilityType}
          onFindRoutes={handleFindRoutes}
          language={language}
          isRTL={isRTL}
        />

        {/* Loading State */}
        {loading && (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <p className="text-lg font-medium">
                {language === 'ar' ? 'جاري البحث عن أفضل المسارات...' : 'Searching for the best routes...'}
              </p>
              <p className="text-sm text-gray-600">
                {language === 'ar' ? 'الذكاء الاصطناعي يحلل الخيارات المتاحة' : 'AI is analyzing available options'}
              </p>
            </div>
          </Card>
        )}

        {/* Interactive Map */}
        <InteractiveMap
          routes={routes}
          language={language}
          isRTL={isRTL}
          disabilityType={disabilityType}
        />

        {/* Best Routes Display */}
        <BestRoutesDisplay
          routes={routes}
          language={language}
          isRTL={isRTL}
          onSelectRoute={handleSelectRoute}
        />
      </div>
    </div>
  );
}
