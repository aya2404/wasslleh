/**
 * 🔐 لوحة إدارة مفاتيح APIs
 * واجهة مرئية آمنة لإدارة وتكوين مفاتيح APIs
 */

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Key, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  Download, 
  Upload,
  RefreshCw,
  Shield,
  Globe,
  MessageSquare,
  Map,
  Heart,
  ShoppingCart,
  Database,
  Bot
} from 'lucide-react';

import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';

import { SecureAPIKeysManager, ApiKeyValidation } from '../config/apiKeysManager';
import { EnvironmentValidator, EnvValidationResult } from '../config/envValidation';
import { useTranslation } from './services/TranslationService';

interface APIService {
  id: string;
  name: string;
  nameEn: string;
  icon: React.ComponentType<any>;
  description: string;
  keys: {
    id: string;
    name: string;
    nameEn: string;
    required: boolean;
    type: 'text' | 'password' | 'url';
    placeholder: string;
    example?: string;
  }[];
  docUrl?: string;
  isEnabled: boolean;
}

const API_SERVICES: APIService[] = [
  {
    id: 'googleMaps',
    name: 'خرائط Google',
    nameEn: 'Google Maps',
    icon: Map,
    description: 'للمسارات الآمنة والتنقل المساعد',
    keys: [
      {
        id: 'apiKey',
        name: 'مفتاح API',
        nameEn: 'API Key',
        required: true,
        type: 'password',
        placeholder: 'AIzaSyC...',
        example: 'AIzaSyC1234567890abcdef'
      },
      {
        id: 'mapId',
        name: 'معرف الخريطة',
        nameEn: 'Map ID',
        required: false,
        type: 'text',
        placeholder: 'your-map-id'
      }
    ],
    docUrl: 'https://console.cloud.google.com/',
    isEnabled: true
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    nameEn: 'LinkedIn',
    icon: Heart,
    description: 'للفرص الوظيفية المناسبة لذوي الاحتياجات الخاصة',
    keys: [
      {
        id: 'clientId',
        name: 'معرف العميل',
        nameEn: 'Client ID',
        required: true,
        type: 'text',
        placeholder: '86x1xl...'
      },
      {
        id: 'clientSecret',
        name: 'سر العميل',
        nameEn: 'Client Secret',
        required: true,
        type: 'password',
        placeholder: 'secret-key...'
      }
    ],
    docUrl: 'https://developer.linkedin.com/',
    isEnabled: true
  },
  {
    id: 'azure',
    name: 'Azure TTS',
    nameEn: 'Azure Text-to-Speech',
    icon: MessageSquare,
    description: 'للنطق باللهجة الأردنية والمحلية',
    keys: [
      {
        id: 'ttsKey',
        name: 'مفتاح النطق',
        nameEn: 'TTS Key',
        required: true,
        type: 'password',
        placeholder: 'a1b2c3d4...'
      },
      {
        id: 'ttsRegion',
        name: 'المنطقة',
        nameEn: 'Region',
        required: true,
        type: 'text',
        placeholder: 'eastus',
        example: 'eastus'
      }
    ],
    docUrl: 'https://portal.azure.com/',
    isEnabled: true
  },
  {
    id: 'googleTranslate',
    name: 'ترجمة Google',
    nameEn: 'Google Translate',
    icon: Globe,
    description: 'للترجمة بين العربية والإنجليزية',
    keys: [
      {
        id: 'apiKey',
        name: 'مفتاح API',
        nameEn: 'API Key',
        required: true,
        type: 'password',
        placeholder: 'AIzaSyB...'
      }
    ],
    docUrl: 'https://cloud.google.com/translate/',
    isEnabled: true
  },
  {
    id: 'ocr',
    name: 'تحليل النصوص',
    nameEn: 'OCR Service',
    icon: Eye,
    description: 'لتحليل النصوص من الصور والكاميرا',
    keys: [
      {
        id: 'apiKey',
        name: 'مفتاح API',
        nameEn: 'API Key',
        required: true,
        type: 'password',
        placeholder: 'ocr-api-key...'
      }
    ],
    docUrl: 'https://ocr.space/ocrapi',
    isEnabled: true
  },
  {
    id: 'gemini',
    name: 'Gemini AI',
    nameEn: 'Gemini AI',
    icon: Bot,
    description: 'للشات بوت الذكي والمساعدة',
    keys: [
      {
        id: 'apiKey',
        name: 'مفتاح API',
        nameEn: 'API Key',
        required: true,
        type: 'password',
        placeholder: 'AIzaSyG...'
      }
    ],
    docUrl: 'https://makersuite.google.com/',
    isEnabled: true
  },
  {
    id: 'amazon',
    name: 'Amazon',
    nameEn: 'Amazon Product API',
    icon: ShoppingCart,
    description: 'للمتجر وبيع أدوات ذوي الاحتياجات الخاصة',
    keys: [
      {
        id: 'accessKey',
        name: 'مفتاح الوصول',
        nameEn: 'Access Key',
        required: false,
        type: 'text',
        placeholder: 'AKIA...'
      },
      {
        id: 'secretKey',
        name: 'المفتاح السري',
        nameEn: 'Secret Key',
        required: false,
        type: 'password',
        placeholder: 'secret-key...'
      },
      {
        id: 'associateTag',
        name: 'تاج الشراكة',
        nameEn: 'Associate Tag',
        required: false,
        type: 'text',
        placeholder: 'your-tag-20'
      }
    ],
    docUrl: 'https://affiliate-program.amazon.com/',
    isEnabled: false
  },
  {
    id: 'supabase',
    name: 'Supabase',
    nameEn: 'Supabase Database',
    icon: Database,
    description: 'لقاعدة البيانات والمصادقة',
    keys: [
      {
        id: 'url',
        name: 'رابط المشروع',
        nameEn: 'Project URL',
        required: true,
        type: 'url',
        placeholder: 'https://your-project.supabase.co'
      },
      {
        id: 'anonKey',
        name: 'المفتاح العام',
        nameEn: 'Anon Key',
        required: true,
        type: 'password',
        placeholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      }
    ],
    docUrl: 'https://supabase.com/',
    isEnabled: true
  }
];

interface APIKeysManagementPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function APIKeysManagementPanel({ isOpen, onClose }: APIKeysManagementPanelProps) {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState('services');
  const [keys, setKeys] = useState<Record<string, Record<string, string>>>({});
  const [validations, setValidations] = useState<Record<string, ApiKeyValidation>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [envValidation, setEnvValidation] = useState<EnvValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  
  // تحميل المفاتيح عند فتح اللوحة
  useEffect(() => {
    if (isOpen) {
      loadAllKeys();
      validateEnvironment();
    }
  }, [isOpen]);

  /**
   * تحميل جميع المفاتيح
   */
  const loadAllKeys = () => {
    const loadedKeys: Record<string, Record<string, string>> = {};
    
    API_SERVICES.forEach(service => {
      loadedKeys[service.id] = {};
      service.keys.forEach(key => {
        const value = SecureAPIKeysManager.getApiKey(service.id as any, key.id);
        loadedKeys[service.id][key.id] = value || '';
      });
    });
    
    setKeys(loadedKeys);
  };

  /**
   * التحقق من البيئة
   */
  const validateEnvironment = () => {
    const validation = EnvironmentValidator.validateEnvironment();
    setEnvValidation(validation);
  };

  /**
   * حفظ مفتاح API
   */
  const saveApiKey = async (serviceId: string, keyId: string, value: string) => {
    const success = SecureAPIKeysManager.setApiKey(serviceId as any, value, keyId);
    
    if (success) {
      setKeys(prev => ({
        ...prev,
        [serviceId]: {
          ...prev[serviceId],
          [keyId]: value
        }
      }));
      
      toast.success(language === 'ar' ? 'تم حفظ المفتاح بنجاح' : 'API key saved successfully');
      
      // التحقق من صحة المفتاح
      validateApiKey(serviceId, keyId);
    } else {
      toast.error(language === 'ar' ? 'فشل في حفظ المفتاح' : 'Failed to save API key');
    }
  };

  /**
   * التحقق من صحة مفتاح API
   */
  const validateApiKey = async (serviceId: string, keyId: string) => {
    setIsValidating(true);
    
    try {
      const validation = await SecureAPIKeysManager.validateApiKey(serviceId as any, keyId);
      setValidations(prev => ({
        ...prev,
        [`${serviceId}.${keyId}`]: validation
      }));
    } catch (error) {
      console.error('خطأ في التحقق من المفتاح:', error);
    }
    
    setIsValidating(false);
  };

  /**
   * التحقق من جميع المفاتيح
   */
  const validateAllKeys = async () => {
    setIsValidating(true);
    
    for (const service of API_SERVICES) {
      for (const key of service.keys) {
        await validateApiKey(service.id, key.id);
      }
    }
    
    setIsValidating(false);
    toast.success(language === 'ar' ? 'تم فحص جميع المفاتيح' : 'All keys validated');
  };

  /**
   * نسخ المفتاح للحافظة
   */
  const copyKey = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success(language === 'ar' ? 'تم نسخ المفتاح' : 'Key copied to clipboard');
  };

  /**
   * تصدير المفاتيح
   */
  const exportKeys = () => {
    const exported = SecureAPIKeysManager.exportKeys();
    const blob = new Blob([exported], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'waslah-api-keys-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(language === 'ar' ? 'تم تصدير المفاتيح' : 'Keys exported successfully');
  };

  /**
   * استيراد المفاتيح
   */
  const importKeys = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const success = SecureAPIKeysManager.importKeys(content);
        
        if (success) {
          loadAllKeys();
          toast.success(language === 'ar' ? 'تم استيراد المفاتيح بنجاح' : 'Keys imported successfully');
        } else {
          toast.error(language === 'ar' ? 'فشل في استيراد المفاتيح' : 'Failed to import keys');
        }
      } catch (error) {
        toast.error(language === 'ar' ? 'ملف غير صالح' : 'Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  /**
   * مسح جميع المفاتيح
   */
  const clearAllKeys = () => {
    if (window.confirm(language === 'ar' ? 'هل أنت متأكد من مسح جميع المفاتيح؟' : 'Are you sure you want to clear all keys?')) {
      SecureAPIKeysManager.clearAllKeys();
      loadAllKeys();
      setValidations({});
      toast.success(language === 'ar' ? 'تم مسح جميع المفاتيح' : 'All keys cleared');
    }
  };

  /**
   * رسم خدمة API
   */
  const renderApiService = (service: APIService) => {
    const ServiceIcon = service.icon;
    
    return (
      <Card key={service.id} className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <ServiceIcon className="w-6 h-6 text-blue-600" />
            <div>
              <div className="font-heading">
                {language === 'ar' ? service.name : service.nameEn}
              </div>
              <CardDescription className="font-body text-sm">
                {service.description}
              </CardDescription>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {service.docUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(service.docUrl, '_blank')}
                  className="font-body"
                >
                  {language === 'ar' ? 'دليل' : 'Docs'}
                </Button>
              )}
              <Badge variant={service.isEnabled ? 'default' : 'secondary'}>
                {service.isEnabled ? 
                  (language === 'ar' ? 'مفعل' : 'Enabled') : 
                  (language === 'ar' ? 'معطل' : 'Disabled')
                }
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {service.keys.map(key => {
            const keyPath = `${service.id}.${key.id}`;
            const value = keys[service.id]?.[key.id] || '';
            const validation = validations[keyPath];
            const isVisible = showKeys[keyPath];
            
            return (
              <div key={key.id} className="space-y-2">
                <Label className="flex items-center gap-2 font-body">
                  {language === 'ar' ? key.name : key.nameEn}
                  {key.required && <span className="text-red-500">*</span>}
                  {validation && (
                    validation.isValid ? 
                      <CheckCircle className="w-4 h-4 text-green-500" /> :
                      <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                </Label>
                
                <div className="flex gap-2">
                  <Input
                    type={key.type === 'password' && !isVisible ? 'password' : 'text'}
                    value={value}
                    placeholder={key.placeholder}
                    onChange={(e) => saveApiKey(service.id, key.id, e.target.value)}
                    className={`font-body ${
                      validation?.isValid === false ? 'border-red-500' : 
                      validation?.isValid === true ? 'border-green-500' : ''
                    }`}
                  />
                  
                  {key.type === 'password' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowKeys(prev => ({
                        ...prev,
                        [keyPath]: !prev[keyPath]
                      }))}
                    >
                      {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  )}
                  
                  {value && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyKey(value)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => validateApiKey(service.id, key.id)}
                    disabled={isValidating}
                  >
                    <RefreshCw className={`w-4 h-4 ${isValidating ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
                
                {validation?.error && (
                  <Alert variant="destructive">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription className="font-body text-sm">
                      {validation.error}
                    </AlertDescription>
                  </Alert>
                )}
                
                {key.example && (
                  <p className="text-sm text-gray-500 font-body">
                    {language === 'ar' ? 'مثال:' : 'Example:'} {key.example}
                  </p>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center justify-between font-heading">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-blue-600" />
              {language === 'ar' ? 'إدارة مفاتيح APIs' : 'API Keys Management'}
            </div>
            <Button variant="outline" onClick={onClose} className="font-body">
              {language === 'ar' ? 'إغلاق' : 'Close'}
            </Button>
          </CardTitle>
          <CardDescription className="font-body">
            {language === 'ar' ? 
              'قم بتكوين مفاتيح APIs للخدمات المختلفة في التطبيق' :
              'Configure API keys for different services in the application'
            }
          </CardDescription>
        </CardHeader>
        
        <div className="flex-1 overflow-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="services" className="font-body">
                {language === 'ar' ? 'الخدمات' : 'Services'}
              </TabsTrigger>
              <TabsTrigger value="validation" className="font-body">
                {language === 'ar' ? 'التحقق' : 'Validation'}
              </TabsTrigger>
              <TabsTrigger value="backup" className="font-body">
                {language === 'ar' ? 'النسخ الاحتياطي' : 'Backup'}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="services" className="p-6 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-heading text-lg">
                  {language === 'ar' ? 'خدمات APIs' : 'API Services'}
                </h3>
                <Button onClick={validateAllKeys} disabled={isValidating} className="font-body">
                  <RefreshCw className={`w-4 h-4 mr-2 ${isValidating ? 'animate-spin' : ''}`} />
                  {language === 'ar' ? 'فحص الكل' : 'Validate All'}
                </Button>
              </div>
              
              {API_SERVICES.map(renderApiService)}
            </TabsContent>
            
            <TabsContent value="validation" className="p-6">
              <div className="space-y-4">
                <h3 className="font-heading text-lg">
                  {language === 'ar' ? 'حالة البيئة' : 'Environment Status'}
                </h3>
                
                {envValidation && (
                  <Alert variant={envValidation.isValid ? 'default' : 'destructive'}>
                    {envValidation.isValid ? 
                      <CheckCircle className="w-4 h-4" /> : 
                      <AlertCircle className="w-4 h-4" />
                    }
                    <AlertDescription className="font-body">
                      {envValidation.isValid ? 
                        (language === 'ar' ? 'جميع المتغيرات مُكونة بشكل صحيح' : 'All environment variables are properly configured') :
                        (language === 'ar' ? `يوجد ${envValidation.errors.length} مشاكل في التكوين` : `${envValidation.errors.length} configuration issues found`)
                      }
                    </AlertDescription>
                  </Alert>
                )}
                
                <Textarea
                  value={EnvironmentValidator.generateReport()}
                  readOnly
                  className="font-mono text-sm h-64 font-body"
                  placeholder={language === 'ar' ? 'تقرير فحص البيئة...' : 'Environment validation report...'}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="backup" className="p-6">
              <div className="space-y-4">
                <h3 className="font-heading text-lg">
                  {language === 'ar' ? 'النسخ الاحتياطي للمفاتيح' : 'Keys Backup'}
                </h3>
                
                <div className="flex gap-4">
                  <Button onClick={exportKeys} className="font-body">
                    <Download className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'تصدير المفاتيح' : 'Export Keys'}
                  </Button>
                  
                  <label>
                    <Button variant="outline" className="font-body">
                      <Upload className="w-4 h-4 mr-2" />
                      {language === 'ar' ? 'استيراد المفاتيح' : 'Import Keys'}
                    </Button>
                    <input
                      type="file"
                      accept=".json"
                      onChange={importKeys}
                      className="hidden"
                    />
                  </label>
                  
                  <Button 
                    variant="destructive" 
                    onClick={clearAllKeys}
                    className="font-body"
                  >
                    {language === 'ar' ? 'مسح الكل' : 'Clear All'}
                  </Button>
                </div>
                
                <Alert>
                  <Shield className="w-4 h-4" />
                  <AlertDescription className="font-body">
                    {language === 'ar' ? 
                      'المفاتيح المُصدرة محمية بتشفير أساسي. احتفظ بها في مكان آمن.' :
                      'Exported keys are protected with basic encryption. Keep them in a secure location.'
                    }
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
}

export default APIKeysManagementPanel;