const disabilityIcons = {
  visual: Eye,
  auditory: Ear,
  motor: Hand,
  cognitive: Brain
};

const disabilityLabels = {
  visual: 'إعاقة بصرية',
  auditory: 'إعاقة سمعية',
  motor: 'إعاقة حركية',
  cognitive: 'إعاقة إدراكية'
};
import React, { useState } from 'react';
import { getRecommendedJobs } from './services/GeminiSmartFilter';
import { Search, Briefcase, GraduationCap, Users, MapPin, Clock, Eye, Ear, Hand, Brain, ExternalLink, Linkedin } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LinkedInJobsService } from './services/LinkedInJobsService';
import { useTranslation } from './services/TranslationService';

// Type definitions
interface JobOpportunity {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  accessibility: string[];
  salary: string;
  description: string;
  requirements: string[];
}

interface EducationalOpportunity {
  id: number;
  title: string;
  duration: string;
  level: string;
  accessibility: string[];
  price: string;
  description: string;
  features: string[];
  provider: string;
}

interface CommunityEvent {
  id: number;
  title: string;
  organizer: string;
  date: string;
  time: string;
  location: string;
  accessibility: string[];
  type: string;
  description: string;
}

type Opportunity = JobOpportunity | EducationalOpportunity | CommunityEvent;

export function OpportunitiesPage() {
  // Smart filter state
  const [aiFilteredJobs, setAiFilteredJobs] = useState<JobOpportunity[] | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Smart filter handler
  const handleSmartFilter = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const filtered = await getRecommendedJobs(selectedDisability, allJobs);
      setAiFilteredJobs(filtered);
    } catch (err: any) {
      setAiError(err.message);
    } finally {
      setAiLoading(false);
    }
  };
  const { t, language } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisability, setSelectedDisability] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  // Modal state for application form
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(null);
  // Arabic location options for filter dropdown
  const locationOptions = [
    { value: 'all', label: 'جميع المواقع' },
    { value: 'الرياض', label: 'الرياض' },
    { value: 'جدة', label: 'جدة' },
    { value: 'الدمام', label: 'الدمام' },
    { value: 'عن بُعد', label: 'عن بُعد' },
  ];


  // Data arrays (inside function only)
  const jobOpportunities: JobOpportunity[] = [
    // Visual disability jobs
    {
      id: 1,
      title: 'مبرمج صوتي للمكفوفين',
      company: 'مركز التقنية البصرية',
      location: 'الرياض',
      type: 'دوام كامل',
      accessibility: ['visual'],
      salary: '9,000 - 12,000 ريال',
      description: 'تطوير تطبيقات صوتية لمساعدة المكفوفين في التنقل واستخدام التقنية.',
      requirements: ['خبرة في تطوير تطبيقات صوتية', 'إتقان لغة البرمجة Python']
    },
    {
      id: 2,
      title: 'مدرب برايل',
      company: 'جمعية المكفوفين الخيرية',
      location: 'جدة',
      type: 'دوام جزئي',
      accessibility: ['visual'],
      salary: '5,000 - 7,000 ريال',
      description: 'تدريب الطلاب على استخدام لغة برايل في القراءة والكتابة.',
      requirements: ['شهادة في برايل', 'خبرة في التعليم']
    },
    {
      id: 3,
      title: 'محرر محتوى صوتي',
      company: 'منصة التعليم الشامل',
      location: 'عن بُعد',
      type: 'عمل حر',
      accessibility: ['visual'],
      salary: 'حسب المشروع',
      description: 'تحويل المحتوى النصي إلى صوتي لدعم المكفوفين.',
      requirements: ['إتقان اللغة العربية', 'خبرة في تحرير الصوت']
    },
    {
      id: 4,
      title: 'مطور مواقع متوافقة مع قارئ الشاشة',
      company: 'شركة حلول الويب',
      location: 'الدمام',
      type: 'دوام كامل',
      accessibility: ['visual'],
      salary: '8,500 - 11,000 ريال',
      description: 'تطوير مواقع تدعم قارئ الشاشة للمستخدمين المكفوفين.',
      requirements: ['خبرة في HTML و ARIA', 'معرفة بمعايير الوصولية']
    },

    // Auditory disability jobs
    {
      id: 5,
      title: 'مترجم لغة الإشارة',
      company: 'مستشفى الملك فيصل',
      location: 'الرياض',
      type: 'دوام جزئي',
      accessibility: ['auditory'],
      salary: '4,000 - 6,000 ريال',
      description: 'مترجم لغة الإشارة لمساعدة المرضى في التواصل.',
      requirements: ['شهادة في لغة الإشارة', 'خبرة سنتين على الأقل']
    },
    {
      id: 6,
      title: 'مدرب لغة الإشارة',
      company: 'مركز التأهيل السمعي',
      location: 'جدة',
      type: 'دوام كامل',
      accessibility: ['auditory'],
      salary: '7,000 - 9,000 ريال',
      description: 'تدريب الطلاب على التواصل بلغة الإشارة.',
      requirements: ['شهادة في لغة الإشارة', 'خبرة في التدريب']
    },
    {
      id: 7,
      title: 'محرر فيديو مترجم للإشارة',
      company: 'منصة التعليم الشامل',
      location: 'عن بُعد',
      type: 'عمل حر',
      accessibility: ['auditory'],
      salary: 'حسب المشروع',
      description: 'إضافة ترجمة لغة الإشارة إلى الفيديوهات التعليمية.',
      requirements: ['خبرة في تحرير الفيديو', 'إتقان لغة الإشارة']
    },
    {
      id: 8,
      title: 'دعم فني عبر الدردشة النصية',
      company: 'شركة الاتصالات الذكية',
      location: 'الدمام',
      type: 'دوام كامل',
      accessibility: ['auditory'],
      salary: '6,500 - 8,000 ريال',
      description: 'تقديم الدعم الفني للعملاء من ذوي الإعاقة السمعية عبر الدردشة النصية.',
      requirements: ['خبرة في خدمة العملاء', 'إتقان الكتابة السريعة']
    },

    // Motor disability jobs
    {
      id: 9,
      title: 'مطور واجهات سهلة الاستخدام',
      company: 'شركة حلول البرمجيات',
      location: 'الرياض',
      type: 'دوام كامل',
      accessibility: ['motor'],
      salary: '9,000 - 12,000 ريال',
      description: 'تصميم وتطوير واجهات تطبيقات تدعم سهولة الاستخدام لذوي الإعاقة الحركية.',
      requirements: ['خبرة في تصميم UX', 'معرفة بمعايير الوصولية']
    },
    {
      id: 10,
      title: 'مدرب رياضة علاجية',
      company: 'مركز التأهيل الحركي',
      location: 'جدة',
      type: 'دوام جزئي',
      accessibility: ['motor'],
      salary: '5,500 - 7,500 ريال',
      description: 'تدريب ذوي الإعاقة الحركية على تمارين علاجية.',
      requirements: ['شهادة في العلاج الطبيعي', 'خبرة في التدريب الرياضي']
    },
    {
      id: 11,
      title: 'دعم فني عن بُعد',
      company: 'شركة التقنية الذكية',
      location: 'عن بُعد',
      type: 'عمل حر',
      accessibility: ['motor'],
      salary: 'حسب المشروع',
      description: 'تقديم الدعم الفني للمستخدمين من ذوي الإعاقة الحركية عن بُعد.',
      requirements: ['خبرة في الدعم الفني', 'إتقان استخدام الحاسوب']
    },
    {
      id: 12,
      title: 'مساعد إداري في بيئة مهيأة',
      company: 'شركة الإدارة الحديثة',
      location: 'الدمام',
      type: 'دوام كامل',
      accessibility: ['motor'],
      salary: '7,000 - 9,000 ريال',
      description: 'العمل الإداري في بيئة مهيأة لذوي الإعاقة الحركية.',
      requirements: ['خبرة في الإدارة', 'إتقان برامج الأوفيس']
    },

    // Cognitive disability jobs
    {
      id: 13,
      title: 'مدرب مهارات حياتية',
      company: 'مركز التأهيل الإدراكي',
      location: 'الرياض',
      type: 'دوام كامل',
      accessibility: ['cognitive'],
      salary: '8,000 - 10,000 ريال',
      description: 'تدريب ذوي الإعاقة الإدراكية على المهارات الحياتية اليومية.',
      requirements: ['شهادة في التربية الخاصة', 'خبرة في التدريب']
    },
    {
      id: 14,
      title: 'مساعد معلم في صفوف الدمج',
      company: 'مدرسة الدمج الشامل',
      location: 'جدة',
      type: 'دوام جزئي',
      accessibility: ['cognitive'],
      salary: '5,000 - 7,000 ريال',
      description: 'مساعدة المعلمين في صفوف الدمج لذوي الإعاقة الإدراكية.',
      requirements: ['خبرة في التعليم', 'إتقان التعامل مع الأطفال']
    },
    {
      id: 15,
      title: 'محرر محتوى مبسط',
      company: 'منصة التعليم المبسط',
      location: 'عن بُعد',
      type: 'عمل حر',
      accessibility: ['cognitive'],
      salary: 'حسب المشروع',
      description: 'كتابة وتحرير محتوى مبسط لذوي الإعاقة الإدراكية.',
      requirements: ['إتقان اللغة العربية', 'خبرة في التحرير']
    },
    {
      id: 16,
      title: 'مطور ألعاب تعليمية مبسطة',
      company: 'شركة الألعاب الذكية',
      location: 'الدمام',
      type: 'دوام كامل',
      accessibility: ['cognitive'],
      salary: '9,000 - 11,000 ريال',
      description: 'تطوير ألعاب تعليمية مبسطة لذوي الإعاقة الإدراكية.',
      requirements: ['خبرة في تطوير الألعاب', 'معرفة بأساليب التعليم المبسط']
    },
  ];

  const educationalOpportunities: EducationalOpportunity[] = [
    {
      id: 1,
      title: 'دورة البرمجة للمبتدئين',
      provider: 'أكاديمية الكود',
      duration: '3 أشهر',
      level: 'مبتدئ',
      accessibility: ['visual', 'auditory', 'motor', 'cognitive'],
      price: 'مجاني',
      description: 'تعلم أساسيات البرمجة مع دعم كامل لذوي الاحتياجات الخاصة',
      features: ['محتوى صوتي', 'ترجمة إشارة', 'واجهة مبسطة']
    },
    {
      id: 2,
      title: 'ورشة عمل في التصميم الجرافيكي',
      provider: 'معهد الفنون التطبيقية',
      duration: '6 أسابيع',
      level: 'متوسط',
      accessibility: ['auditory', 'motor'],
      price: '500 ريال',
      description: 'تعلم أساسيات التصميم الجرافيكي مع أدوات متخصصة',
      features: ['أدوات مساعدة', 'دعم فردي', 'مشاريع عملية']
    },
    {
      id: 3,
      title: 'كورس إدارة الأعمال الرقمية',
      provider: 'جامعة الأعمال الذكية',
      duration: '4 أشهر',
      level: 'متقدم',
      accessibility: ['visual', 'cognitive'],
      price: '1,200 ريال',
      description: 'دبلوم في إدارة الأعمال الرقمية مع تركيز على الشمولية',
      features: ['شهادة معتمدة', 'تدريب عملي', 'إرشاد مهني']
    },
  ];

  const communityEvents: CommunityEvent[] = [
    {
      id: 1,
      title: 'ملتقى ذوي الاحتياجات الخاصة في التكنولوجيا',
      organizer: 'جمعية التكنولوجيا الشاملة',
      date: '15 مارس 2024',
      time: '10:00 ص - 4:00 م',
      location: 'مركز الرياض للمؤتمرات',
      accessibility: ['visual', 'auditory', 'motor', 'cognitive'],
      type: 'مؤتمر',
      description: 'ملتقى سنوي لمناقشة أحدث التطورات في التكنولوجيا المساعدة'
    },
    {
      id: 2,
      title: 'ورشة عمل لتعلم لغة الإشارة',
      organizer: 'مركز التأهيل الشامل',
      date: '22 مارس 2024',
      time: '6:00 م - 8:00 م',
      location: 'مركز الحي - الرياض',
      accessibility: ['auditory'],
      type: 'ورشة عمل',
      description: 'تعلم أساسيات لغة الإشارة مع مترجمين معتمدين'
    },
    {
      id: 3,
      title: 'نشاط رياضي شامل في الحديقة',
      organizer: 'نادي الرياضة للجميع',
      date: '30 مارس 2024',
      time: '8:00 ص - 12:00 م',
      location: 'حديقة الملك عبدالله',
      accessibility: ['visual', 'auditory', 'motor'],
      type: 'نشاط رياضي',
      description: 'فعالية رياضية مصممة لتناسب جميع القدرات'
    }
  ];

  // For now, use only local jobs (LinkedIn integration requires API or mock data)
  const allJobs: JobOpportunity[] = jobOpportunities;

  // Filtering functions
  const filterByDisability = (items: Opportunity[]) => {
    if (selectedDisability === 'all') return items;
    return items.filter(item => item.accessibility.includes(selectedDisability));
  };

  const filterBySearch = (items: Opportunity[]) => {
    if (!searchTerm) return items;
    return items.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filterByLocation = (items: Opportunity[]) => {
    if (selectedLocation === 'all') return items;
    return items.filter((item) => {
      if ('location' in item && typeof item.location === 'string') {
        return item.location.includes(selectedLocation);
      }
      return true;
    });
  };

  const applyFilters = (items: Opportunity[], includeLocation: boolean = true) => {
    let filtered = items;
    if (includeLocation) {
      filtered = filterByLocation(filtered);
    }
    filtered = filterByDisability(filtered);
    filtered = filterBySearch(filtered);
    return filtered;
  };


  // Application form submit handler (dummy)
  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowApplicationForm(false);
    setSelectedJob(null);
    alert('تم إرسال طلب التقديم بنجاح!');
  };

  // Debug: log state on every render
  console.log('DEBUG: render', { showApplicationForm, selectedJob });
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
          الفرص المتاحة
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          اكتشف الوظائف والدورات التدريبية والفعاليات المصممة لدعم ذوي الاحتياجات الخاصة
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ابحث في الفرص..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
                aria-label="البحث في الفرص المتاحة"
              />
            </div>

            {/* Disability Filter */}
            <Select value={selectedDisability} onValueChange={setSelectedDisability}>
              <SelectTrigger aria-label="تصفية حسب نوع الإعاقة">
                <SelectValue placeholder="تصفية حسب نوع الإعاقة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="visual">إعاقة بصرية</SelectItem>
                <SelectItem value="auditory">إعاقة سمعية</SelectItem>
                <SelectItem value="motor">إعاقة حركية</SelectItem>
                <SelectItem value="cognitive">إعاقة إدراكية</SelectItem>
              </SelectContent>
            </Select>

            {/* Location Filter */}
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger aria-label="تصفية حسب الموقع">
                <SelectValue placeholder="تصفية حسب الموقع" />
              </SelectTrigger>
              <SelectContent>
                {locationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Application Modal */}
      {showApplicationForm && selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm border-4 border-green-500">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto border-4 border-blue-500">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">نموذج التقديم على الوظيفة</h2>
                <button
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  onClick={() => { setShowApplicationForm(false); setSelectedJob(null); }}
                  aria-label="إغلاق"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Job Info */}
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">{selectedJob.title}</h3>
                <p className="text-blue-700 dark:text-blue-300">{selectedJob.company}</p>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">{selectedJob.location}</p>
              </div>
            </div>
            {/* Form Content */}
            <form onSubmit={handleApplicationSubmit} className="p-6 space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                  المعلومات الشخصية
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                      الاسم الأول *
                    </label>
                    <input 
                      type="text" 
                      required 
                      className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                      placeholder="أدخل اسمك الأول" 
                    />
                  </div>
                  <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                اسم العائلة *
              </label>
              <input 
                type="text" 
                required 
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                placeholder="أدخل اسم العائلة" 
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              البريد الإلكتروني *
            </label>
            <input 
              type="email" 
              required 
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              placeholder="example@email.com" 
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              رقم الهاتف *
            </label>
            <input 
              type="tel" 
              required 
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              placeholder="+966 XX XXX XXXX" 
            />
          </div>
        </div>

        {/* Professional Information Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            المعلومات المهنية
          </h4>
          
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              سنوات الخبرة
            </label>
            <select className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
              <option value="">اختر سنوات الخبرة</option>
              <option value="0-1">أقل من سنة</option>
              <option value="1-3">1-3 سنوات</option>
              <option value="3-5">3-5 سنوات</option>
              <option value="5+">أكثر من 5 سنوات</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              المؤهل العلمي
            </label>
            <select className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
              <option value="">اختر المؤهل العلمي</option>
              <option value="high-school">ثانوية عامة</option>
              <option value="diploma">دبلوم</option>
              <option value="bachelor">بكالوريوس</option>
              <option value="master">ماجستير</option>
              <option value="phd">دكتوراه</option>
            </select>
          </div>
        </div>

        {/* Accessibility Needs Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            احتياجات الوصولية (اختياري)
          </h4>
          
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              هل تحتاج إلى أي ترتيبات خاصة؟
            </label>
            <textarea 
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-20" 
              placeholder="اذكر أي ترتيبات خاصة تحتاجها للمقابلة أو العمل..."
              rows={3}
            />
          </div>
        </div>

        {/* Cover Letter Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            رسالة التقديم
          </h4>
          
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              لماذا تريد العمل في هذا المنصب؟ *
            </label>
            <textarea 
              required 
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-32" 
              placeholder="اكتب رسالة تقديم مقنعة تظهر اهتمامك بالوظيفة ومؤهلاتك..."
              rows={5}
            />
          </div>
        </div>

        {/* File Upload Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            المرفقات
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                السيرة الذاتية *
              </label>
              <input 
                type="file" 
                accept=".pdf,.doc,.docx"
                required
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX (أقصى حجم: 5MB)</p>
            </div>
            
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                خطاب التوصية (اختياري)
              </label>
              <input 
                type="file" 
                accept=".pdf,.doc,.docx"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX (أقصى حجم: 5MB)</p>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-4">
          <div className="flex items-start space-x-reverse space-x-3">
            <input 
              type="checkbox" 
              required 
              id="terms"
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
              أوافق على <a href="#" className="text-blue-600 hover:underline">شروط وأحكام</a> الموقع و
              <a href="#" className="text-blue-600 hover:underline"> سياسة الخصوصية</a> *
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-reverse space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            type="submit" 
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium focus:ring-4 focus:ring-blue-300 focus:outline-none"
          >
            <span className="flex items-center justify-center space-x-reverse space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span>إرسال الطلب</span>
            </span>
          </button>
          <button 
            type="button"
            onClick={() => { setShowApplicationForm(false); setSelectedJob(null); }}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      {/* Opportunities Section: Only local jobs */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-blue-600" />
          {language === 'ar' ? 'الوظائف المتاحة' : 'Available Jobs'}
        </h2>
        {/* Removed smart filter button. Show error if exists. */}
        {aiError && <span className="text-red-600">{aiError}</span>}
        <div className="grid gap-6">
          {((aiFilteredJobs ?? applyFilters(allJobs)) as JobOpportunity[]).map((job: JobOpportunity) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              {/* ...existing code... */}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <p className="text-muted-foreground">{job.company}</p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {job.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Always show AI filter phrase for every job card */}
                <div className="mb-2 text-sm text-blue-700 font-bold border border-blue-200 rounded px-2 py-1 bg-blue-50">
                  تمت التصفية من خلال الذكاء الاصطناعي
                </div>
                <p className="text-sm text-muted-foreground">{job.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="flex items-center space-x-reverse space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{job.location}</span>
                  </Badge>
                  <Badge variant="secondary">
                    {job.salary}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">مناسب لـ:</p>
                  <div className="flex flex-wrap gap-2">
                    {job.accessibility.map((type) => {
                      const Icon = disabilityIcons[type as keyof typeof disabilityIcons];
                      return (
                        <Badge key={type} variant="outline" className="flex items-center space-x-reverse space-x-1">
                          <Icon className="w-3 h-3" />
                          <span>{disabilityLabels[type as keyof typeof disabilityLabels]}</span>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">المتطلبات:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start space-x-reverse space-x-2">
                        <span className="text-blue-600">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex space-x-reverse space-x-3">
                  <Button 
                    type="button"
                    className="flex-1 border-2 border-red-500" 
                    onClick={() => { 
                      console.log('DEBUG: تقدم الآن clicked for job', job); 
                      setShowApplicationForm(true); 
                      setSelectedJob(job); 
                    }}
                  >
                    تقدم الآن
                  </Button>
                  <Button variant="outline">
                    حفظ
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Educational Opportunities Section */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-green-600" />
          {language === 'ar' ? 'الفرص التعليمية' : 'Educational Opportunities'}
        </h2>
        <div className="grid gap-6">
          {(applyFilters(educationalOpportunities) as EducationalOpportunity[]).map((course: EducationalOpportunity) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <p className="text-muted-foreground">{course.provider}</p>
                  </div>
                  <Badge variant={course.price === 'مجاني' ? 'default' : 'secondary'}>
                    {course.price}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{course.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="flex items-center space-x-reverse space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{course.duration}</span>
                  </Badge>
                  <Badge variant="outline">
                    {course.level}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">مناسب لـ:</p>
                  <div className="flex flex-wrap gap-2">
                    {course.accessibility.map((type) => {
                      const Icon = disabilityIcons[type as keyof typeof disabilityIcons];
                      return (
                        <Badge key={type} variant="outline" className="flex items-center space-x-reverse space-x-1">
                          <Icon className="w-3 h-3" />
                          <span>{disabilityLabels[type as keyof typeof disabilityLabels]}</span>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">المميزات:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {course.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-reverse space-x-2">
                        <span className="text-green-600">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex space-x-reverse space-x-3">
                  <Button className="flex-1">
                    سجل الآن
                  </Button>
                  <Button variant="outline">
                    المزيد
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Community Events Section */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Users className="w-6 h-6 text-purple-600" />
          {language === 'ar' ? 'الفعاليات المجتمعية' : 'Community Events'}
        </h2>
        <div className="grid gap-6">
          {(applyFilters(communityEvents) as CommunityEvent[]).map((event: CommunityEvent) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <p className="text-muted-foreground">{event.organizer}</p>
                  </div>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700">
                    {event.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{event.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="flex items-center space-x-reverse space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{event.date} - {event.time}</span>
                  </Badge>
                  <Badge variant="secondary" className="flex items-center space-x-reverse space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{event.location}</span>
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">مناسب لـ:</p>
                  <div className="flex flex-wrap gap-2">
                    {event.accessibility.map((type) => {
                      const Icon = disabilityIcons[type as keyof typeof disabilityIcons];
                      return (
                        <Badge key={type} variant="outline" className="flex items-center space-x-reverse space-x-1">
                          <Icon className="w-3 h-3" />
                          <span>{disabilityLabels[type as keyof typeof disabilityLabels]}</span>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
                <div className="flex space-x-reverse space-x-3">
                  <Button className="flex-1">
                    احجز مكانك
                  </Button>
                  <Button variant="outline">
                    المزيد
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

