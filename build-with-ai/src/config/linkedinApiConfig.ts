// تكوين LinkedIn Jobs API للوظائف المناسبة لذوي الاحتياجات الخاصة

export interface LinkedInAPIConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
  apiVersion: string;
}

export interface AccessibilityKeywords {
  visual: string[];
  hearing: string[];
  motor: string[];
  cognitive: string[];
  general: string[];
}

export interface JobSearchFilters {
  location?: string;
  keywords?: string;
  disabilityType?: string;
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'executive';
  jobType?: 'full-time' | 'part-time' | 'contract' | 'internship' | 'temporary';
  remoteWork?: boolean;
  accessibilityFriendly?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  postedTimeRange?: number; // أيام
}

// إعدادات LinkedIn API (تحتاج تسجيل تطبيق في LinkedIn Developer Portal)
export const linkedInAPIConfig: LinkedInAPIConfig = {
  clientId: process.env.LINKEDIN_CLIENT_ID || 'YOUR_LINKEDIN_CLIENT_ID',
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET || 'YOUR_LINKEDIN_CLIENT_SECRET',
  redirectUri: process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:3000/auth/linkedin/callback',
  scope: ['r_liteprofile', 'r_emailaddress', 'w_member_social'],
  apiVersion: 'v2'
};

// كلمات مفتاحية للبحث عن وظائف مناسبة لكل نوع إعاقة
export const accessibilityKeywords: AccessibilityKeywords = {
  visual: [
    'blind-friendly', 'screen reader compatible', 'visual impairment', 'braille',
    'voice recognition', 'accessible technology', 'assistive software',
    'NVDA', 'JAWS', 'screen magnification', 'high contrast',
    'text-to-speech', 'voice over', 'accessibility testing'
  ],
  hearing: [
    'deaf-friendly', 'hearing impairment', 'sign language', 'deaf culture',
    'closed captioning', 'visual alerts', 'hearing aids compatible',
    'lip reading', 'ASL', 'deaf community', 'hearing assistive technology',
    'visual communication', 'vibrating alerts'
  ],
  motor: [
    'wheelchair accessible', 'mobility impairment', 'physical disability',
    'ergonomic workspace', 'adaptive equipment', 'voice control',
    'eye tracking', 'switch navigation', 'modified keyboard',
    'accessible parking', 'ramp access', 'assistive devices',
    'physical accommodation'
  ],
  cognitive: [
    'cognitive disability', 'learning disability', 'ADHD-friendly',
    'autism spectrum', 'intellectual disability', 'memory support',
    'simplified instructions', 'flexible schedule', 'sensory-friendly',
    'routine-based work', 'clear communication', 'structured environment',
    'cognitive support'
  ],
  general: [
    'disability inclusive', 'accessibility', 'inclusive workplace',
    'reasonable accommodation', 'equal opportunity', 'diverse abilities',
    'adaptive technology', 'barrier-free', 'universal design',
    'inclusive hiring', 'disability confident', 'accessible workplace',
    'accommodation support', 'inclusive employer', 'disability friendly'
  ]
};

// أماكن العمل المعروفة بدعم ذوي الاحتياجات الخاصة في الأردن
export const inclusiveEmployersJordan = [
  {
    name: 'Aramex Jordan',
    location: 'Amman, Jordan',
    knownFor: ['inclusive hiring', 'wheelchair accessible', 'flexible hours'],
    industries: ['logistics', 'technology']
  },
  {
    name: 'Bank of Jordan',
    location: 'Amman, Jordan', 
    knownFor: ['sign language support', 'accessible banking', 'inclusive policies'],
    industries: ['banking', 'finance']
  },
  {
    name: 'Orange Jordan',
    location: 'Multiple locations',
    knownFor: ['deaf employment', 'accessibility technology', 'inclusive culture'],
    industries: ['telecommunications', 'technology']
  },
  {
    name: 'Zain Jordan',
    location: 'Amman, Jordan',
    knownFor: ['disability inclusion', 'accessible offices', 'adaptive technology'],
    industries: ['telecommunications']
  },
  {
    name: 'Jordan University of Science and Technology',
    location: 'Irbid, Jordan',
    knownFor: ['academic accommodation', 'research accessibility', 'inclusive education'],
    industries: ['education', 'research']
  },
  {
    name: 'King Hussein Medical Center',
    location: 'Amman, Jordan',
    knownFor: ['healthcare accessibility', 'medical accommodation', 'inclusive practices'],
    industries: ['healthcare', 'medical']
  }
];

// وظائف مناسبة حسب نوع الإعاقة
export const jobTypesByDisability = {
  visual: [
    'software developer', 'data analyst', 'customer service', 'content writer',
    'voice actor', 'translator', 'telephone operator', 'researcher',
    'social media manager', 'podcast producer', 'accessibility consultant'
  ],
  hearing: [
    'graphic designer', 'web developer', 'data entry', 'laboratory technician',
    'photographer', 'video editor', 'quality assurance', 'warehouse worker',
    'librarian', 'research assistant', 'sign language interpreter'
  ],
  motor: [
    'remote software developer', 'online tutor', 'content creator', 'data analyst',
    'customer support', 'virtual assistant', 'writer', 'consultant',
    'social media specialist', 'online researcher', 'digital marketer'
  ],
  cognitive: [
    'data entry', 'library assistant', 'file clerk', 'receptionist',
    'customer service', 'inventory specialist', 'packaging worker',
    'maintenance assistant', 'kitchen helper', 'retail associate'
  ]
};

// مستويات الراتب في الأردن (بالدينار الأردني)
export const salaryRangesJordan = {
  entry: { min: 300, max: 600 },
  mid: { min: 600, max: 1200 },
  senior: { min: 1200, max: 2500 },
  executive: { min: 2500, max: 5000 }
};

// دالة للحصول على كلمات مفتاحية ذكية حسب نوع الإعاقة
export function getSmartKeywords(disabilityType: string, jobTitle?: string): string[] {
  const baseKeywords = accessibilityKeywords.general;
  
  if (disabilityType === 'none' || !disabilityKeywords[disabilityType as keyof AccessibilityKeywords]) {
    return baseKeywords;
  }
  
  const specificKeywords = accessibilityKeywords[disabilityType as keyof AccessibilityKeywords];
  const combinedKeywords = [...baseKeywords, ...specificKeywords];
  
  // إضافة كلمات مفتاحية خاصة بالوظيفة إذا كانت متوفرة
  if (jobTitle) {
    const relevantJobs = jobTypesByDisability[disabilityType as keyof typeof jobTypesByDisability] || [];
    const jobKeywords = relevantJobs.filter(job => 
      jobTitle.toLowerCase().includes(job.toLowerCase()) ||
      job.toLowerCase().includes(jobTitle.toLowerCase())
    );
    combinedKeywords.push(...jobKeywords);
  }
  
  return [...new Set(combinedKeywords)]; // إزالة التكرار
}

// دالة لتقييم مدى ملاءمة الوظيفة لذوي الاحتياجات الخاصة
export function calculateAccessibilityScore(
  jobDescription: string,
  jobTitle: string,
  company: string,
  disabilityType: string
): number {
  let score = 0;
  const keywords = getSmartKeywords(disabilityType, jobTitle);
  const text = `${jobDescription} ${jobTitle} ${company}`.toLowerCase();
  
  // تقييم مبني على الكلمات المفتاحية
  keywords.forEach(keyword => {
    if (text.includes(keyword.toLowerCase())) {
      score += 10;
    }
  });
  
  // نقاط إضافية للشركات المعروفة بالشمولية
  const isInclusiveEmployer = inclusiveEmployersJordan.some(employer => 
    company.toLowerCase().includes(employer.name.toLowerCase())
  );
  if (isInclusiveEmployer) {
    score += 50;
  }
  
  // نقاط إضافية للعمل عن بُعد
  const remoteKeywords = ['remote', 'work from home', 'telecommute', 'virtual', 'online'];
  if (remoteKeywords.some(keyword => text.includes(keyword))) {
    score += 30;
  }
  
  // نقاط إضافية للمرونة في العمل
  const flexibilityKeywords = ['flexible', 'part-time', 'flexible hours', 'accommodation'];
  if (flexibilityKeywords.some(keyword => text.includes(keyword))) {
    score += 20;
  }
  
  return Math.min(score, 100); // الحد الأقصى 100
}

// دالة لتوليد استعلام بحث ذكي
export function generateSmartSearchQuery(filters: JobSearchFilters): string {
  const keywords = getSmartKeywords(filters.disabilityType || 'none', filters.keywords);
  const location = filters.location || 'Jordan';
  
  // تكوين استعلام البحث
  let query = keywords.slice(0, 5).join(' OR '); // أخذ أول 5 كلمات مفتاحية
  
  if (filters.keywords) {
    query = `(${filters.keywords}) AND (${query})`;
  }
  
  if (filters.remoteWork) {
    query += ' AND (remote OR "work from home" OR telecommute)';
  }
  
  return query;
}

// Mock API response generator للاختبار
export function generateMockLinkedInJob(filters: JobSearchFilters) {
  const keywords = getSmartKeywords(filters.disabilityType || 'none');
  const relevantJobs = jobTypesByDisability[filters.disabilityType as keyof typeof jobTypesByDisability] || ['Software Developer'];
  const randomJob = relevantJobs[Math.floor(Math.random() * relevantJobs.length)];
  const randomEmployer = inclusiveEmployersJordan[Math.floor(Math.random() * inclusiveEmployersJordan.length)];
  
  return {
    id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: randomJob.charAt(0).toUpperCase() + randomJob.slice(1),
    company: randomEmployer.name,
    location: randomEmployer.location,
    description: `Great opportunity for ${randomJob} with ${keywords.slice(0, 3).join(', ')} support`,
    postedTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    employmentType: filters.jobType || 'Full-time',
    experienceLevel: filters.experienceLevel || 'Mid-level',
    isAccessibilityFriendly: true,
    accommodations: randomEmployer.knownFor,
    salaryRange: `${salaryRangesJordan.mid.min}-${salaryRangesJordan.mid.max} JOD`,
    remoteWorkAvailable: filters.remoteWork || Math.random() > 0.5,
    applicationUrl: `https://linkedin.com/jobs/view/${Math.random().toString(36).substr(2, 9)}`,
    industry: randomEmployer.industries[0],
    skills: keywords.slice(0, 3),
    accessibilityScore: calculateAccessibilityScore(
      `Great opportunity for ${randomJob}`,
      randomJob,
      randomEmployer.name,
      filters.disabilityType || 'none'
    )
  };
}

export default {
  linkedInAPIConfig,
  accessibilityKeywords,
  inclusiveEmployersJordan,
  jobTypesByDisability,
  salaryRangesJordan,
  getSmartKeywords,
  calculateAccessibilityScore,
  generateSmartSearchQuery,
  generateMockLinkedInJob
};