/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { PracticeAreasSection } from './components/PracticeAreasSection';
import { PartnersSection } from './components/PartnersSection';
import { WhyChooseUsSection } from './components/WhyChooseUsSection';
import { AchievementsSection } from './components/AchievementsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { BlogSection } from './components/BlogSection';
import { ContactAndOfficesSection } from './components/ContactAndOfficesSection';
import { Footer } from './components/Footer';
import { ConsultationModal } from './components/ConsultationModal';
import { AdminDashboard } from './components/AdminDashboard';
import { storageService } from './services/storageService';
import { applyTypographySettings } from './services/typographyService';
import { Partner, PracticeArea, Testimonial, BlogPost, CaseStudy, SiteSettings, OfficeLocation, Language } from './types';

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [settings, setSettings] = useState<SiteSettings>(storageService.getSettings());
  const [partners, setPartners] = useState<Partner[]>([]);
  const [practiceAreas, setPracticeAreas] = useState<PracticeArea[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [offices, setOffices] = useState<OfficeLocation[]>([]);

  // Modals state
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [selectedPracticeId, setSelectedPracticeId] = useState<string | undefined>(undefined);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | undefined>(undefined);

  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Sync state with storage service
  const refreshData = () => {
    setSettings(storageService.getSettings());
    setPartners(storageService.getPartners());
    setPracticeAreas(storageService.getPracticeAreas());
    setCaseStudies(storageService.getCaseStudies());
    setTestimonials(storageService.getTestimonials());
    setBlogPosts(storageService.getBlogPosts());
    setOffices(storageService.getOffices());
  };

  useEffect(() => {
    storageService.init();
    refreshData();

    // Listen for live updates from Admin Dashboard
    const handleStorageChange = () => {
      refreshData();
    };

    window.addEventListener('aladl_storage_sync', handleStorageChange);
    return () => window.removeEventListener('aladl_storage_sync', handleStorageChange);
  }, []);

  // Update HTML document direction, title and typography on settings/language change
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    if (lang === 'ar') {
      document.title = `${settings.firmNameAr} | محاماة واستشارات قانونية`;
    } else if (lang === 'tr') {
      document.title = `${settings.firmNameTr || settings.firmNameEn} | Uluslararası Hukuk Bürosu`;
    } else {
      document.title = `${settings.firmNameEn} | Premier International Law Firm`;
    }

    applyTypographySettings(settings);
  }, [lang, settings]);

  const handleChangeLang = (newLang: Language) => {
    setLang(newLang);
  };

  const handleOpenConsultation = (practiceId?: string, partnerId?: string) => {
    setSelectedPracticeId(practiceId);
    setSelectedPartnerId(partnerId);
    setIsConsultationOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fbf8f2] text-[#181512] selection:bg-[#b38a38]/30 selection:text-[#87641d] font-body-custom">
      
      {/* 1. Header / Navbar */}
      <Navbar
        settings={settings}
        lang={lang}
        onChangeLang={handleChangeLang}
        onOpenConsultation={handleOpenConsultation}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 2. Hero Section */}
      <HeroSection
        settings={settings}
        lang={lang}
        onOpenConsultation={() => handleOpenConsultation()}
      />

      {/* 3. About Us Section */}
      <AboutSection
        settings={settings}
        lang={lang}
        onOpenConsultation={() => handleOpenConsultation()}
      />

      {/* 4. Practice Areas Section */}
      <PracticeAreasSection
        practiceAreas={practiceAreas}
        partners={partners}
        lang={lang}
        onOpenConsultation={handleOpenConsultation}
      />

      {/* 5. Our Partners & Attorneys */}
      <PartnersSection
        partners={partners}
        lang={lang}
        onOpenConsultation={handleOpenConsultation}
      />

      {/* 6. Why Choose Us */}
      <WhyChooseUsSection
        lang={lang}
      />

      {/* 7. Landmark Achievements & Transactions */}
      <AchievementsSection
        caseStudies={caseStudies}
        lang={lang}
        onOpenConsultation={() => handleOpenConsultation()}
      />

      {/* 8. Client Testimonials */}
      <TestimonialsSection
        testimonials={testimonials}
        lang={lang}
      />

      {/* 9. Legal Blog & Thought Leadership */}
      <BlogSection
        blogPosts={blogPosts}
        lang={lang}
      />

      {/* 10. Contact & Interactive Office Locations */}
      <ContactAndOfficesSection
        settings={settings}
        practiceAreas={practiceAreas}
        offices={offices}
        lang={lang}
      />

      {/* 11. Footer */}
      <Footer
        settings={settings}
        practiceAreas={practiceAreas}
        lang={lang}
        onOpenConsultation={handleOpenConsultation}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Modals */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        partners={partners}
        practiceAreas={practiceAreas}
        defaultPracticeId={selectedPracticeId}
        defaultPartnerId={selectedPartnerId}
        lang={lang}
      />

      {/* Protected Admin Control Center - The ONLY place for modifications */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        lang={lang}
      />

    </div>
  );
}
