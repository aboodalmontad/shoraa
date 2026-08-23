import React, { useState } from 'react';
import { 
  Send, Phone, Mail, MapPin, Clock, Shield, CheckCircle2, Building 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { storageService } from '../services/storageService';
import { SiteSettings, PracticeArea, OfficeLocation, Language } from '../types';
import { useTranslation, getLocalized } from '../services/i18n';

interface ContactSectionProps {
  settings: SiteSettings;
  practiceAreas: PracticeArea[];
  offices: OfficeLocation[];
  lang: Language;
}

export const ContactAndOfficesSection: React.FC<ContactSectionProps> = ({
  settings,
  practiceAreas,
  offices,
  lang,
}) => {
  const t = useTranslation(lang);
  const [activeOffice, setActiveOffice] = useState<OfficeLocation>(offices[0] || {} as OfficeLocation);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    consultationType: 'corporate-m-a',
    preferredDate: '',
    isUrgent: false,
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      storageService.addMessage({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        consultationType: formData.consultationType,
        preferredDate: formData.preferredDate,
        isUrgent: formData.isUrgent,
        message: formData.message,
      });

      // Confetti burst
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#c5a869', '#e5cb8e', '#ffffff', '#aa8022']
      });

      setSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        consultationType: 'corporate-m-a',
        preferredDate: '',
        isUrgent: false,
        message: '',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const workingHours = getLocalized(settings, 'workingHours', lang, settings.workingHoursAr);

  return (
    <section id="contact" className="py-24 bg-[#f7f2e8] relative border-t border-[#e6ddcc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#b38a38]/12 border border-[#b38a38]/30 text-[#87641d] text-xs font-bold uppercase tracking-wider mb-4">
            <Mail className="w-3.5 h-3.5" />
            <span>{t.contactBadge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-title font-bold text-[#181512] tracking-tight mb-4">
            {lang === 'ar' ? (
              <>
                دعنا نبدأ في <span className="gold-gradient-text">حماية وتنمية مصالحك القانونية</span>
              </>
            ) : lang === 'tr' ? (
              <>
                Hukuki Çıkarlarınızı <span className="gold-gradient-text">Korumaya ve Güvenceye Almaya Başlayalım</span>
              </>
            ) : (
              <>
                Let Us Begin <span className="gold-gradient-text">Safeguarding Your Legal Interests</span>
              </>
            )}
          </h2>

          <p className="text-[#4b4334] text-base sm:text-lg">
            {t.contactSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column (7 cols): Consultation Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white p-8 sm:p-10 border border-[#c5a869]/40 shadow-xl relative font-cards-custom">
              
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif-title font-bold text-[#181512]">
                    {t.successTitle}
                  </h3>
                  <p className="text-[#4b4334] text-sm max-w-md mx-auto leading-relaxed">
                    {t.successDesc}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b38a38] via-[#c5a869] to-[#87641d] text-white font-bold text-xs shadow-md transition cursor-pointer mt-4"
                  >
                    {t.submitAnother}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="pb-2 border-b border-[#e6ddcc]">
                    <h3 className="text-xl font-bold font-serif-title text-[#181512]">
                      {t.formTitle}
                    </h3>
                  </div>

                  {/* Row 1: Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#2c261e] mb-1.5">
                        {t.fullName} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder={lang === 'ar' ? 'مثال: عبد العزيز بن ناصر' : lang === 'tr' ? 'Örn: Ahmet Yılmaz' : 'e.g. Johnathan Doe'}
                        className="w-full px-4 py-3 rounded-xl bg-[#fbf8f2] border border-[#d8ceb8] text-[#181512] text-sm focus:border-[#b38a38] focus:bg-white focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2c261e] mb-1.5">
                        {t.phone} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+966 5X XXX XXXX / +90 5XX XXX XX XX"
                        className="w-full px-4 py-3 rounded-xl bg-[#fbf8f2] border border-[#d8ceb8] text-[#181512] text-sm focus:border-[#b38a38] focus:bg-white focus:outline-none transition ltr"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email & Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#2c261e] mb-1.5">
                        {t.email} *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@company.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#fbf8f2] border border-[#d8ceb8] text-[#181512] text-sm focus:border-[#b38a38] focus:bg-white focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2c261e] mb-1.5">
                        {t.company}
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder={lang === 'ar' ? 'اسم الشركة أو المؤسسة' : lang === 'tr' ? 'Şirket veya Kurum Adı' : 'Company name'}
                        className="w-full px-4 py-3 rounded-xl bg-[#fbf8f2] border border-[#d8ceb8] text-[#181512] text-sm focus:border-[#b38a38] focus:bg-white focus:outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Row 3: Practice Area & Preferred Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#2c261e] mb-1.5">
                        {t.practiceAreaSelect} *
                      </label>
                      <select
                        value={formData.consultationType}
                        onChange={(e) => setFormData({ ...formData, consultationType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#fbf8f2] border border-[#d8ceb8] text-[#181512] text-sm focus:border-[#b38a38] focus:bg-white focus:outline-none transition"
                      >
                        {practiceAreas.map((p) => (
                          <option key={p.id} value={p.id} className="bg-white text-[#181512]">
                            {getLocalized(p, 'title', lang, p.title)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2c261e] mb-1.5">
                        {t.preferredDate}
                      </label>
                      <input
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#fbf8f2] border border-[#d8ceb8] text-[#181512] text-sm focus:border-[#b38a38] focus:bg-white focus:outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Urgent Checkbox */}
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#f4eee2] border border-[#e6ddcc]">
                    <input
                      type="checkbox"
                      id="isUrgent"
                      checked={formData.isUrgent}
                      onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                      className="w-4 h-4 rounded text-[#b38a38] focus:ring-[#b38a38] bg-white border-[#d8ceb8] cursor-pointer"
                    />
                    <label htmlFor="isUrgent" className="text-xs text-[#2c261e] cursor-pointer flex items-center gap-1.5">
                      <span className="font-bold text-[#87641d]">{t.urgentLabel}</span>
                      <span className="text-[#6b6255]">({t.urgentHint})</span>
                    </label>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-[#2c261e] mb-1.5">
                      {t.summaryLabel} *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t.summaryPlaceholder}
                      className="w-full px-4 py-3 rounded-xl bg-[#fbf8f2] border border-[#d8ceb8] text-[#181512] text-sm focus:border-[#b38a38] focus:bg-white focus:outline-none transition resize-none"
                    />
                  </div>

                  {/* Confidentiality Notice */}
                  <div className="flex items-center gap-2 text-[11px] text-[#6b6255]">
                    <Shield className="w-4 h-4 text-[#b38a38] flex-shrink-0" />
                    <span>{t.confidentialNotice}</span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#b38a38] via-[#c5a869] to-[#87641d] text-white font-bold text-base shadow-md hover:brightness-105 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-white" />
                    <span>{isSubmitting ? t.submittingBtn : t.submitBtn}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column (5 cols): Office Switcher & Google Map Embed */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Office Locations Tabs */}
            <div className="rounded-3xl bg-white p-6 border border-[#e6ddcc] shadow-xl font-cards-custom">
              <h4 className="text-sm font-bold text-[#87641d] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Building className="w-4 h-4" />
                <span>{t.globalOffices}</span>
              </h4>

              {/* City buttons */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                {offices.map((office) => {
                  const cityName = getLocalized(office, 'city', lang, office.cityAr);
                  return (
                    <button
                      key={office.id}
                      onClick={() => setActiveOffice(office)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        activeOffice.id === office.id
                          ? 'bg-gradient-to-r from-[#b38a38] to-[#87641d] text-white shadow-sm font-bold'
                          : 'bg-[#f4eee2] text-[#4b4334] hover:text-[#181512] hover:bg-[#ede4d4] border border-[#e6ddcc]'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{cityName}</span>
                      {office.isHeadquarter && (
                        <span className="text-[9px] px-1 rounded bg-[#b38a38]/20 text-[#87641d] font-bold font-mono">HQ</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Active Office Details */}
              {activeOffice && (
                <div className="space-y-3.5 text-xs text-[#4b4334] mb-6 p-4 rounded-2xl bg-[#f4eee2] border border-[#e6ddcc]">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#b38a38] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#181512] block">
                        {getLocalized(activeOffice, 'city', lang, activeOffice.cityAr)} - {getLocalized(activeOffice, 'country', lang, activeOffice.countryAr)}
                      </span>
                      <div className="text-[#5c5343] mt-0.5">
                        {(() => {
                          const addr = getLocalized(activeOffice, 'address', lang, activeOffice.addressAr);
                          if (addr && addr.includes('\n')) {
                            return addr.split('\n').map((line, i) => (
                              <span key={i} className="block leading-relaxed">{line}</span>
                            ));
                          }
                          return <span>{addr}</span>;
                        })()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#b38a38] flex-shrink-0" />
                    <a href={`tel:${activeOffice.phone}`} className="text-[#181512] font-semibold hover:text-[#87641d] font-mono ltr">
                      {activeOffice.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#b38a38] flex-shrink-0" />
                    <a href={`mailto:${activeOffice.email}`} className="text-[#181512] font-semibold hover:text-[#87641d]">
                      {activeOffice.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t border-[#e6ddcc]">
                    <Clock className="w-4 h-4 text-[#b38a38] flex-shrink-0" />
                    <span className="font-medium text-[#2c261e]">{workingHours}</span>
                  </div>
                </div>
              )}

              {/* Embedded Google Map Iframe */}
              {activeOffice?.mapEmbedUrl && (
                <div className="rounded-2xl overflow-hidden h-60 border border-[#e6ddcc] shadow-inner relative">
                  <iframe
                    title={`Google Map - ${activeOffice.cityEn || activeOffice.cityAr}`}
                    src={activeOffice.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
