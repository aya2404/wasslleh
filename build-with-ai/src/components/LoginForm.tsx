import React, { useState } from 'react';
import { X, LogIn, User, Eye, Volume2, Hand, Brain, Lock, Mail, UserPlus, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useTranslation } from './services/TranslationService';
import { UserService, AccessibilityAdapter } from './services/UserService';
import { toast } from 'sonner@2.0.3';

interface LoginFormProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (profile: any) => void;
}

export function LoginForm({ isOpen, onClose, onLogin }: LoginFormProps) {
  const { t, language, isRTL } = useTranslation();
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    disabilityType: 'none',
    confirmPassword: ''
  });

  const disabilityTypes = [
    { value: 'none', label: t('noDisability'), icon: null },
    { value: 'visual', label: t('visualImpairment'), icon: Eye },
    { value: 'auditory', label: t('hearingImpairment'), icon: Volume2 },
    { value: 'motor', label: t('motorImpairment'), icon: Hand },
    { value: 'cognitive', label: t('cognitiveImpairment'), icon: Brain }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (activeTab === 'register') {
        // التحقق من تطابق كلمات المرور
        if (formData.password !== formData.confirmPassword) {
          toast.error(language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
          setIsLoading(false);
          return;
        }

        // تسجيل مستخدم جديد
        const { user, profile, error } = await UserService.signUp({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          disabilityType: formData.disabilityType,
          language: language
        });

        if (error) {
          toast.error(language === 'ar' ? 'فشل في إنشاء الحساب' : 'Failed to create account');
          console.error('خطأ في التسجيل:', error);
          setIsLoading(false);
          return;
        }

        toast.success(language === 'ar' ? 'تم إنشاء الحساب بنجاح!' : 'Account created successfully!');
        
        // تطبيق إعدادات الوصولية
        if (profile && profile.disabilityType !== 'none') {
          AccessibilityAdapter.applyStyles(profile.disabilityType);
        }

        onLogin(profile);
      } else {
        // تسجيل دخول
        const { user, profile, error } = await UserService.signIn(formData.email, formData.password);

        if (error) {
          toast.error(language === 'ar' ? 'فشل في تسجيل الدخول' : 'Failed to sign in');
          console.error('خطأ في تسجيل الدخول:', error);
          setIsLoading(false);
          return;
        }

        toast.success(language === 'ar' ? 'مرحباً بعودتك!' : 'Welcome back!');
        
        // تطبيق إعدادات الوصولية
        if (profile && profile.disabilityType !== 'none') {
          AccessibilityAdapter.applyStyles(profile.disabilityType);
        }

        onLogin(profile);
      }

      onClose();
      
      // إعادة تعيين النموذج
      setFormData({
        email: '',
        password: '',
        name: '',
        disabilityType: 'none',
        confirmPassword: ''
      });

    } catch (error) {
      console.error('خطأ في العملية:', error);
      toast.error(language === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
    >
      <Card 
        className="w-full max-w-md border-[var(--color-dark-purple)] dark:border-[var(--color-pastel-purple)]"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-[var(--color-pastel-purple)] to-[var(--color-light-orange)] dark:from-[var(--color-dark-purple)] dark:to-[var(--color-vibrant-orange)]">
          <CardTitle id="login-title" className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
            <LogIn className="w-5 h-5 text-[var(--color-dark-purple)] dark:text-white" />
            <span className="text-[var(--color-dark-purple)] dark:text-white">
              {t('welcomeToWasla')}
            </span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label={t('close')}
            className="text-[var(--color-dark-purple)] dark:text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger 
                value="login"
                className="bg-[var(--color-light-beige)] data-[state=active]:bg-[var(--color-dark-purple)] data-[state=active]:text-white"
              >
                {t('login')}
              </TabsTrigger>
              <TabsTrigger 
                value="register"
                className="bg-[var(--color-light-beige)] data-[state=active]:bg-[var(--color-dark-purple)] data-[state=active]:text-white"
              >
                {t('register')}
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-[var(--color-dark-purple)] dark:text-[var(--color-pastel-purple)]">
                    {t('email')}
                  </Label>
                  <div className="relative">
                    <Mail className={`absolute top-3 w-4 h-4 text-[var(--color-calm-green)] ${isRTL ? 'right-3' : 'left-3'}`} />
                    <Input
                      id="login-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`${isRTL ? 'pr-10' : 'pl-10'} border-[var(--color-calm-green)] focus:border-[var(--color-dark-purple)]`}
                      placeholder={t('enterEmail')}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-[var(--color-dark-purple)] dark:text-[var(--color-pastel-purple)]">
                    {t('password')}
                  </Label>
                  <div className="relative">
                    <Lock className={`absolute top-3 w-4 h-4 text-[var(--color-calm-green)] ${isRTL ? 'right-3' : 'left-3'}`} />
                    <Input
                      id="login-password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`${isRTL ? 'pr-10' : 'pl-10'} border-[var(--color-calm-green)] focus:border-[var(--color-dark-purple)]`}
                      placeholder={t('enterPassword')}
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-[var(--color-dark-purple)] hover:bg-[var(--color-dark-purple)]/90 text-white"
                >
                  {isLoading ? (
                    <Loader2 className={`w-4 h-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  ) : (
                    <LogIn className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  )}
                  {isLoading ? (language === 'ar' ? 'جارٍ تسجيل الدخول...' : 'Signing in...') : t('login')}
                </Button>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="text-[var(--color-dark-purple)] dark:text-[var(--color-pastel-purple)]">
                    {t('fullName')}
                  </Label>
                  <div className="relative">
                    <User className={`absolute top-3 w-4 h-4 text-[var(--color-calm-green)] ${isRTL ? 'right-3' : 'left-3'}`} />
                    <Input
                      id="register-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`${isRTL ? 'pr-10' : 'pl-10'} border-[var(--color-calm-green)] focus:border-[var(--color-dark-purple)]`}
                      placeholder={t('enterFullName')}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-[var(--color-dark-purple)] dark:text-[var(--color-pastel-purple)]">
                    {t('email')}
                  </Label>
                  <div className="relative">
                    <Mail className={`absolute top-3 w-4 h-4 text-[var(--color-calm-green)] ${isRTL ? 'right-3' : 'left-3'}`} />
                    <Input
                      id="register-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`${isRTL ? 'pr-10' : 'pl-10'} border-[var(--color-calm-green)] focus:border-[var(--color-dark-purple)]`}
                      placeholder={t('enterEmail')}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[var(--color-dark-purple)] dark:text-[var(--color-pastel-purple)]">
                    {t('disabilityType')}
                  </Label>
                  <Select value={formData.disabilityType} onValueChange={(value) => handleInputChange('disabilityType', value)}>
                    <SelectTrigger className="border-[var(--color-calm-green)] focus:border-[var(--color-dark-purple)]">
                      <SelectValue placeholder={t('selectDisabilityType')} />
                    </SelectTrigger>
                    <SelectContent>
                      {disabilityTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                              {Icon && <Icon className="w-4 h-4" />}
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-[var(--color-dark-purple)] dark:text-[var(--color-pastel-purple)]">
                    {t('password')}
                  </Label>
                  <div className="relative">
                    <Lock className={`absolute top-3 w-4 h-4 text-[var(--color-calm-green)] ${isRTL ? 'right-3' : 'left-3'}`} />
                    <Input
                      id="register-password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`${isRTL ? 'pr-10' : 'pl-10'} border-[var(--color-calm-green)] focus:border-[var(--color-dark-purple)]`}
                      placeholder={t('enterPassword')}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-[var(--color-dark-purple)] dark:text-[var(--color-pastel-purple)]">
                    {t('confirmPassword')}
                  </Label>
                  <div className="relative">
                    <Lock className={`absolute top-3 w-4 h-4 text-[var(--color-calm-green)] ${isRTL ? 'right-3' : 'left-3'}`} />
                    <Input
                      id="confirm-password"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`${isRTL ? 'pr-10' : 'pl-10'} border-[var(--color-calm-green)] focus:border-[var(--color-dark-purple)]`}
                      placeholder={t('confirmPassword')}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-[var(--color-calm-green)] hover:bg-[var(--color-calm-green)]/90 text-white"
                >
                  {isLoading ? (
                    <Loader2 className={`w-4 h-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  ) : (
                    <UserPlus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  )}
                  {isLoading ? (language === 'ar' ? 'جارٍ إنشاء الحساب...' : 'Creating account...') : t('createAccount')}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Accessibility Note */}
          <div className="mt-6 p-4 bg-gradient-to-r from-[var(--color-light-beige)] to-[var(--color-light-orange)] rounded-lg border border-[var(--color-calm-green)]">
            <h4 className="font-medium text-[var(--color-dark-purple)] mb-2">
              {t('accessibilityAdaptation')}
            </h4>
            <p className="text-sm text-[var(--color-dark-purple)]/80">
              {language === 'ar' 
                ? 'سيتم تكييف واجهة الموقع تلقائياً حسب نوع الإعاقة المحددة لتوفير أفضل تجربة استخدام ممكنة.'
                : 'The website interface will automatically adapt based on the selected disability type to provide the best possible user experience.'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}