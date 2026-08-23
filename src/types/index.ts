export type Language = 'ar' | 'en' | 'tr';

export interface Partner {
  id: string;
  name: string;
  nameEn: string;
  nameTr?: string;
  title: string;
  titleEn: string;
  titleTr?: string;
  specialty: string;
  specialtyEn: string;
  specialtyTr?: string;
  experienceYears: number;
  education: string[];
  educationEn?: string[];
  educationTr?: string[];
  bio: string;
  bioEn: string;
  bioTr?: string;
  email: string;
  phone: string;
  linkedin: string;
  image: string;
  featured: boolean;
  barAdmission: string;
  barAdmissionEn?: string;
  barAdmissionTr?: string;
  languages: string[];
  casesWonCount?: number;
  isPartner?: boolean; // true for equity/senior/junior partners, false for non-partner associate lawyers & counsel
  roleCategory?: 'senior_partner' | 'managing_partner' | 'partner' | 'counsel' | 'associate' | 'legal_consultant' | 'trainee';
}

export interface PracticeArea {
  id: string;
  title: string;
  titleEn: string;
  titleTr?: string;
  category: string; // 'corporate' | 'disputes' | 'finance' | 'technology' | 'realestate' | 'labor' | 'tax' | 'general' | custom string
  categoryLabelAr?: string;
  categoryLabelEn?: string;
  categoryLabelTr?: string;
  iconName: string;
  shortDesc: string;
  shortDescEn: string;
  shortDescTr?: string;
  fullDesc: string;
  fullDescEn: string;
  fullDescTr?: string;
  keyServices: string[];
  keyServicesEn: string[];
  keyServicesTr?: string[];
  casesCount: number;
  image: string;
  leadPartnerId?: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientNameEn: string;
  clientNameTr?: string;
  clientRole: string;
  clientRoleEn: string;
  clientRoleTr?: string;
  company: string;
  companyEn: string;
  companyTr?: string;
  content: string;
  contentEn: string;
  contentTr?: string;
  rating: number;
  avatar: string;
  caseType: string;
  caseTypeTr?: string;
  year: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  titleEn: string;
  titleTr?: string;
  category: string;
  categoryTr?: string;
  outcome: string;
  outcomeTr?: string;
  summary: string;
  summaryTr?: string;
  year: string;
  value?: string;
  highlight: string;
  highlightTr?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  titleEn: string;
  titleTr?: string;
  slug: string;
  slugTr?: string;
  category: string;
  categoryTr?: string;
  excerpt: string;
  excerptTr?: string;
  content: string;
  contentTr?: string;
  authorName: string;
  authorNameTr?: string;
  authorRole: string;
  authorRoleTr?: string;
  date: string;
  readTime: string;
  readTimeTr?: string;
  image: string;
  tags: string[];
  tagsTr?: string[];
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  consultationType: string;
  preferredDate?: string;
  isUrgent: boolean;
  message: string;
  status: 'new' | 'contacted' | 'scheduled' | 'closed';
  createdAt: string;
  responseNote?: string;
}

export interface SiteSettings {
  firmNameAr: string;
  firmNameEn: string;
  firmNameTr?: string;
  sloganAr: string;
  sloganEn: string;
  sloganTr?: string;
  subSloganAr: string;
  subSloganEn: string;
  subSloganTr?: string;
  aboutTextAr: string;
  aboutTextEn: string;
  aboutTextTr?: string;
  aboutVisionAr?: string;
  aboutVisionEn?: string;
  aboutVisionTr?: string;
  aboutMethodologyAr?: string;
  aboutMethodologyEn?: string;
  aboutMethodologyTr?: string;
  aboutConfidentialityAr?: string;
  aboutConfidentialityEn?: string;
  aboutConfidentialityTr?: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  consultationEmail: string;
  addressAr: string;
  addressEn: string;
  addressTr?: string;
  workingHoursAr: string;
  workingHoursEn: string;
  workingHoursTr?: string;
  stats: {
    yearsExperience: number;
    casesWon: number;
    activeClients: number;
    successRate: number;
    recoveredMillionsUSD: number;
  };
  socialLinks: {
    linkedin: string;
    twitter: string;
    youtube: string;
  };
  customLogoUrl?: string;
  logoIcon?: string;
  
  // Visual Branding & Layout Customization
  logoSizeNavbar?: 'sm' | 'md' | 'lg' | 'xl';
  logoSizeHero?: 'sm' | 'md' | 'lg' | 'xl' | 'hidden';
  logoShape?: 'rounded' | 'circle' | 'square' | 'transparent';
  brandingLayout?: 'horizontal' | 'vertical';
  brandingPositionNavbar?: 'start' | 'center';
  firmNameSizeNavbar?: 'sm' | 'md' | 'lg' | 'xl';
  firmNameWeightNavbar?: 'normal' | 'semibold' | 'bold' | 'extrabold';
  firmNameLinesNavbar?: '1' | '2' | 'auto';
  firmNameSizeHero?: 'sm' | 'md' | 'lg' | 'xl';
  heroAlignment?: 'center' | 'start';
  showNavbarSubtitle?: boolean;
  navbarSubtitleAr?: string;
  navbarSubtitleEn?: string;
  navbarSubtitleTr?: string;

  // Address & Headline line & format controls
  addressLinesCount?: '1' | '2' | '3' | 'auto';
  addressDisplayMode?: 'single' | 'multiline' | 'detailed';
  heroHeadlineLines?: '1' | '2' | '3' | 'auto';
  heroSubheadlineLines?: '1' | '2' | '3' | 'auto';

  // Typography & Font Customization Suite
  fontFamilyBody?: 'tajawal' | 'cairo' | 'amiri' | 'almarai' | 'elmessiri' | 'notokufi' | 'notonaskh' | 'alexandria' | 'readex' | 'inter' | string;
  fontFamilyHeadings?: 'amiri' | 'cairo' | 'tajawal' | 'almarai' | 'elmessiri' | 'notokufi' | 'notonaskh' | 'alexandria' | 'playfair' | 'cormorant' | 'cinzel' | string;
  fontFamilyFirmName?: 'amiri' | 'cairo' | 'tajawal' | 'almarai' | 'elmessiri' | 'notokufi' | 'notonaskh' | 'alexandria' | 'cormorant' | 'cinzel' | string;
  fontFamilyHeroHeadline?: 'amiri' | 'cairo' | 'tajawal' | 'almarai' | 'elmessiri' | 'notokufi' | 'notonaskh' | 'alexandria' | 'playfair' | 'cormorant' | 'cinzel' | string;
  fontFamilyNavbar?: 'tajawal' | 'cairo' | 'amiri' | 'almarai' | 'elmessiri' | 'notokufi' | 'alexandria' | 'readex' | string;
  fontFamilyCards?: 'tajawal' | 'cairo' | 'almarai' | 'notokufi' | 'alexandria' | 'readex' | string;

  adminPassword?: string;
}

export interface OfficeLocation {
  id: string;
  cityAr: string;
  cityEn: string;
  cityTr?: string;
  countryAr: string;
  countryEn: string;
  countryTr?: string;
  addressAr: string;
  addressEn: string;
  addressTr?: string;
  phone: string;
  email: string;
  mapEmbedUrl: string;
  isHeadquarter?: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminUser: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' | 'IMPORT' | 'RESET';
  entity: string;
  entityId?: string;
  details: string;
}

