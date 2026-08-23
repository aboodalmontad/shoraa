import { Partner, PracticeArea, Testimonial, BlogPost, CaseStudy, ContactMessage, SiteSettings, OfficeLocation, AuditLog } from '../types';
import { initialPartners, initialPracticeAreas, initialTestimonials, initialBlogPosts, initialCaseStudies, initialContactMessages, initialSiteSettings, initialOffices } from '../data/initialData';

const STORAGE_KEYS = {
  PARTNERS: 'aladl_partners_v1',
  PRACTICE_AREAS: 'aladl_practice_areas_v1',
  TESTIMONIALS: 'aladl_testimonials_v1',
  BLOG_POSTS: 'aladl_blog_posts_v1',
  CASE_STUDIES: 'aladl_case_studies_v1',
  MESSAGES: 'aladl_messages_v1',
  SETTINGS: 'aladl_settings_v1',
  OFFICES: 'aladl_offices_v1',
  AUDIT_LOGS: 'aladl_audit_logs_v1',
};


const notifyChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('aladl_storage_sync'));
  }
};

export const storageService = {
  // Init and seed if empty
  init: () => {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.PARTNERS)) {
      localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(initialPartners));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRACTICE_AREAS)) {
      localStorage.setItem(STORAGE_KEYS.PRACTICE_AREAS, JSON.stringify(initialPracticeAreas));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TESTIMONIALS)) {
      localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(initialTestimonials));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BLOG_POSTS)) {
      localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(initialBlogPosts));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CASE_STUDIES)) {
      localStorage.setItem(STORAGE_KEYS.CASE_STUDIES, JSON.stringify(initialCaseStudies));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(initialContactMessages));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(initialSiteSettings));
    }
    if (!localStorage.getItem(STORAGE_KEYS.OFFICES)) {
      localStorage.setItem(STORAGE_KEYS.OFFICES, JSON.stringify(initialOffices));
    }
  },

  // Partners CRUD
  getPartners: (): Partner[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PARTNERS);
      const parsed = data ? JSON.parse(data) : initialPartners;
      if (!Array.isArray(parsed)) return initialPartners;
      return parsed.map((p: any) => ({
        ...p,
        languages: Array.isArray(p.languages) ? p.languages : ['العربية', 'الإنجليزية'],
        education: Array.isArray(p.education) ? p.education : [],
        name: p.name || '',
        nameEn: p.nameEn || p.name || '',
      }));
    } catch {
      return initialPartners;
    }
  },

  savePartner: (partner: Partner): Partner[] => {
    const list = storageService.getPartners();
    const index = list.findIndex(p => p.id === partner.id);
    let updated: Partner[];
    const isAssociate = partner.isPartner === false;
    const label = isAssociate ? 'المحامي / المستشار' : 'الشريك';
    if (index >= 0) {
      updated = [...list];
      updated[index] = partner;
      storageService.logAction('UPDATE', 'الشركاء والمحامين (Legal Team)', partner.id, `تعديل بيانات ${label}: ${partner.name}`);
    } else {
      updated = [partner, ...list];
      storageService.logAction('CREATE', 'الشركاء والمحامين (Legal Team)', partner.id, `إضافة ${label} جديد: ${partner.name}`);
    }
    localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(updated));
    notifyChange();
    return updated;
  },

  deletePartner: (id: string): Partner[] => {
    const partner = storageService.getPartners().find(p => p.id === id);
    const list = storageService.getPartners().filter(p => p.id !== id);
    const isAssociate = partner?.isPartner === false;
    const label = isAssociate ? 'المحامي / المستشار' : 'الشريك';
    localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(list));
    storageService.logAction('DELETE', 'الشركاء والمحامين (Legal Team)', id, `حذف ${label}: ${partner?.name || id}`);
    notifyChange();
    return list;
  },

  // Practice Areas CRUD
  getPracticeAreas: (): PracticeArea[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRACTICE_AREAS);
      const parsed = data ? JSON.parse(data) : initialPracticeAreas;
      if (!Array.isArray(parsed)) return initialPracticeAreas;
      return parsed.map((p: any) => ({
        ...p,
        keyServices: Array.isArray(p.keyServices) ? p.keyServices : [],
        keyServicesEn: Array.isArray(p.keyServicesEn) ? p.keyServicesEn : (Array.isArray(p.keyServices) ? p.keyServices : []),
        casesCount: typeof p.casesCount === 'number' ? p.casesCount : 0,
      }));
    } catch {
      return initialPracticeAreas;
    }
  },

  savePracticeArea: (item: PracticeArea): PracticeArea[] => {
    const list = storageService.getPracticeAreas();
    const index = list.findIndex(p => p.id === item.id);
    let updated: PracticeArea[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = item;
      storageService.logAction('UPDATE', 'الاختصاصات (Practice Areas)', item.id, `تعديل الاختصاص: ${item.title}`);
    } else {
      updated = [...list, item];
      storageService.logAction('CREATE', 'الاختصاصات (Practice Areas)', item.id, `إضافة اختصاص جديد: ${item.title}`);
    }
    localStorage.setItem(STORAGE_KEYS.PRACTICE_AREAS, JSON.stringify(updated));
    notifyChange();
    return updated;
  },

  deletePracticeArea: (id: string): PracticeArea[] => {
    const item = storageService.getPracticeAreas().find(p => p.id === id);
    const list = storageService.getPracticeAreas().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRACTICE_AREAS, JSON.stringify(list));
    storageService.logAction('DELETE', 'الاختصاصات (Practice Areas)', id, `حذف الاختصاص: ${item?.title || id}`);
    notifyChange();
    return list;
  },

  // Case Studies CRUD
  getCaseStudies: (): CaseStudy[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CASE_STUDIES);
      return data ? JSON.parse(data) : initialCaseStudies;
    } catch {
      return initialCaseStudies;
    }
  },

  saveCaseStudy: (item: CaseStudy): CaseStudy[] => {
    const list = storageService.getCaseStudies();
    const index = list.findIndex(c => c.id === item.id);
    let updated: CaseStudy[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = item;
      storageService.logAction('UPDATE', 'الإنجازات والقضايا (Case Studies)', item.id, `تعديل القضية: ${item.title}`);
    } else {
      updated = [item, ...list];
      storageService.logAction('CREATE', 'الإنجازات والقضايا (Case Studies)', item.id, `إضافة قضية جديدة: ${item.title}`);
    }
    localStorage.setItem(STORAGE_KEYS.CASE_STUDIES, JSON.stringify(updated));
    notifyChange();
    return updated;
  },

  deleteCaseStudy: (id: string): CaseStudy[] => {
    const item = storageService.getCaseStudies().find(c => c.id === id);
    const list = storageService.getCaseStudies().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CASE_STUDIES, JSON.stringify(list));
    storageService.logAction('DELETE', 'الإنجازات والقضايا (Case Studies)', id, `حذف القضية: ${item?.title || id}`);
    notifyChange();
    return list;
  },

  // Testimonials CRUD
  getTestimonials: (): Testimonial[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
      return data ? JSON.parse(data) : initialTestimonials;
    } catch {
      return initialTestimonials;
    }
  },

  saveTestimonial: (item: Testimonial): Testimonial[] => {
    const list = storageService.getTestimonials();
    const index = list.findIndex(t => t.id === item.id);
    let updated: Testimonial[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = item;
      storageService.logAction('UPDATE', 'آراء العملاء (Testimonials)', item.id, `تعديل شهادة: ${item.clientName}`);
    } else {
      updated = [item, ...list];
      storageService.logAction('CREATE', 'آراء العملاء (Testimonials)', item.id, `إضافة شهادة جديدة: ${item.clientName}`);
    }
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(updated));
    notifyChange();
    return updated;
  },

  deleteTestimonial: (id: string): Testimonial[] => {
    const item = storageService.getTestimonials().find(t => t.id === id);
    const list = storageService.getTestimonials().filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(list));
    storageService.logAction('DELETE', 'آراء العملاء (Testimonials)', id, `حذف شهادة: ${item?.clientName || id}`);
    notifyChange();
    return list;
  },

  // Blog Posts CRUD
  getBlogPosts: (): BlogPost[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BLOG_POSTS);
      return data ? JSON.parse(data) : initialBlogPosts;
    } catch {
      return initialBlogPosts;
    }
  },

  saveBlogPost: (post: BlogPost): BlogPost[] => {
    const list = storageService.getBlogPosts();
    const index = list.findIndex(b => b.id === post.id);
    let updated: BlogPost[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = post;
      storageService.logAction('UPDATE', 'المقالات والمدونة (Blog)', post.id, `تعديل المقال: ${post.title}`);
    } else {
      updated = [post, ...list];
      storageService.logAction('CREATE', 'المقالات والمدونة (Blog)', post.id, `إضافة مقال جديد: ${post.title}`);
    }
    localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(updated));
    notifyChange();
    return updated;
  },

  deleteBlogPost: (id: string): BlogPost[] => {
    const item = storageService.getBlogPosts().find(b => b.id === id);
    const list = storageService.getBlogPosts().filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(list));
    storageService.logAction('DELETE', 'المقالات والمدونة (Blog)', id, `حذف المقال: ${item?.title || id}`);
    notifyChange();
    return list;
  },

  // Offices CRUD
  getOffices: (): OfficeLocation[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.OFFICES);
      return data ? JSON.parse(data) : initialOffices;
    } catch {
      return initialOffices;
    }
  },

  saveOffice: (office: OfficeLocation): OfficeLocation[] => {
    const list = storageService.getOffices();
    const index = list.findIndex(o => o.id === office.id);
    let updated: OfficeLocation[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = office;
      storageService.logAction('UPDATE', 'المقار والفروع (Offices)', office.id, `تعديل المقر: ${office.cityAr}`);
    } else {
      updated = [...list, office];
      storageService.logAction('CREATE', 'المقار والفروع (Offices)', office.id, `إضافة مقر جديد: ${office.cityAr}`);
    }
    localStorage.setItem(STORAGE_KEYS.OFFICES, JSON.stringify(updated));
    notifyChange();
    return updated;
  },

  deleteOffice: (id: string): OfficeLocation[] => {
    const item = storageService.getOffices().find(o => o.id === id);
    const list = storageService.getOffices().filter(o => o.id !== id);
    localStorage.setItem(STORAGE_KEYS.OFFICES, JSON.stringify(list));
    storageService.logAction('DELETE', 'المقار والفروع (Offices)', id, `حذف المقر: ${item?.cityAr || id}`);
    notifyChange();
    return list;
  },

  // Contact Inquiries CRUD
  getMessages: (): ContactMessage[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return data ? JSON.parse(data) : initialContactMessages;
    } catch {
      return initialContactMessages;
    }
  },

  addMessage: (message: Omit<ContactMessage, 'id' | 'createdAt' | 'status'> & { id?: string }): ContactMessage => {
    const list = storageService.getMessages();
    const newMsg: ContactMessage = {
      id: message.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      fullName: message.fullName,
      email: message.email,
      phone: message.phone,
      company: message.company || '',
      consultationType: message.consultationType,
      preferredDate: message.preferredDate,
      isUrgent: message.isUrgent,
      message: message.message,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    const updated = [newMsg, ...list];
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updated));
    notifyChange();
    return newMsg;
  },

  updateMessageStatus: (id: string, status: ContactMessage['status'], responseNote?: string): ContactMessage[] => {
    const list = storageService.getMessages();
    const updated = list.map(m => m.id === id ? { ...m, status, responseNote: responseNote !== undefined ? responseNote : m.responseNote } : m);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updated));
    storageService.logAction('STATUS_CHANGE', 'رسائل العملاء (Messages)', id, `تحديث حالة الاستشارة إلى: ${status}`);
    notifyChange();
    return updated;
  },

  deleteMessage: (id: string): ContactMessage[] => {
    const msg = storageService.getMessages().find(m => m.id === id);
    const list = storageService.getMessages().filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(list));
    storageService.logAction('DELETE', 'رسائل العملاء (Messages)', id, `حذف استشارة الموكل: ${msg?.fullName || id}`);
    notifyChange();
    return list;
  },

  // Site Settings
  getSettings: (): SiteSettings => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) return initialSiteSettings;
      const parsed = JSON.parse(data);
      return {
        ...initialSiteSettings,
        ...parsed,
        stats: {
          ...initialSiteSettings.stats,
          ...(parsed.stats || {}),
        }
      };
    } catch {
      return initialSiteSettings;
    }
  },

  saveSettings: (settings: SiteSettings): SiteSettings => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    storageService.logAction('UPDATE', 'إعدادات الموقع (Settings)', 'site-settings', `تحديث إعدادات واسم المكتب: ${settings.firmNameAr}`);
    notifyChange();
    return settings;
  },

  // Audit Logs
  getAuditLogs: (): AuditLog[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  logAction: (action: AuditLog['action'], entity: string, entityId: string, details: string) => {
    try {
      const logs = storageService.getAuditLogs();
      const newLog: AuditLog = {
        id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: new Date().toISOString(),
        adminUser: 'مدير النظام (Admin)',
        action,
        entity,
        entityId,
        details
      };
      const updated = [newLog, ...logs.slice(0, 199)]; // Keep last 200 logs
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to log audit action', e);
    }
  },

  // Export full JSON Backup
  exportDataJSON: () => {
    const backup = {
      partners: storageService.getPartners(),
      practiceAreas: storageService.getPracticeAreas(),
      caseStudies: storageService.getCaseStudies(),
      testimonials: storageService.getTestimonials(),
      blogPosts: storageService.getBlogPosts(),
      messages: storageService.getMessages(),
      settings: storageService.getSettings(),
      offices: storageService.getOffices(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(backup, null, 2);
  },

  // Import full JSON Backup
  importDataJSON: (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.partners) localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(data.partners));
      if (data.practiceAreas) localStorage.setItem(STORAGE_KEYS.PRACTICE_AREAS, JSON.stringify(data.practiceAreas));
      if (data.caseStudies) localStorage.setItem(STORAGE_KEYS.CASE_STUDIES, JSON.stringify(data.caseStudies));
      if (data.testimonials) localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(data.testimonials));
      if (data.blogPosts) localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(data.blogPosts));
      if (data.messages) localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(data.messages));
      if (data.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
      if (data.offices) localStorage.setItem(STORAGE_KEYS.OFFICES, JSON.stringify(data.offices));
      notifyChange();
      return true;
    } catch (e) {
      console.error('Failed to parse JSON backup', e);
      return false;
    }
  },

  // Reset to initial Seed Data
  resetToDefaults: () => {
    localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(initialPartners));
    localStorage.setItem(STORAGE_KEYS.PRACTICE_AREAS, JSON.stringify(initialPracticeAreas));
    localStorage.setItem(STORAGE_KEYS.CASE_STUDIES, JSON.stringify(initialCaseStudies));
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(initialTestimonials));
    localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(initialBlogPosts));
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(initialContactMessages));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(initialSiteSettings));
    localStorage.setItem(STORAGE_KEYS.OFFICES, JSON.stringify(initialOffices));
    notifyChange();
  }
};
