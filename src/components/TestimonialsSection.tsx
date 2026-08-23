import React, { useState } from 'react';
import { Star, MessageSquareQuote, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { Testimonial, Language } from '../types';
import { useTranslation, getLocalized } from '../services/i18n';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  lang: Language;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials, lang }) => {
  const t = useTranslation(lang);
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (!testimonials || testimonials.length === 0) return null;

  const current = testimonials[currentIndex];
  const quote = getLocalized(current, 'content', lang, current.content);
  const clientName = getLocalized(current, 'clientName', lang, current.clientName);
  const clientRole = getLocalized(current, 'clientRole', lang, current.clientRole);
  const company = getLocalized(current, 'company', lang, current.company);
  const caseType = getLocalized(current, 'caseType', lang, current.caseType);

  const isRtl = lang === 'ar';
  const PrevArrow = isRtl ? ChevronRight : ChevronLeft;
  const NextArrow = isRtl ? ChevronLeft : ChevronRight;

  return (
    <section id="testimonials" className="py-24 bg-[#fbf8f2] relative border-t border-[#e6ddcc] overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#b38a38]/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#b38a38]/12 border border-[#b38a38]/30 text-[#87641d] text-xs font-bold uppercase tracking-wider mb-4">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>{t.testimonialsBadge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-title font-bold text-[#181512] tracking-tight mb-4">
            {lang === 'ar' ? (
              <>
                ماذا يقول <span className="gold-gradient-text">قادة الأعمال والشركاء التنفيذيون؟</span>
              </>
            ) : lang === 'tr' ? (
              <>
                İş Dünyası Liderleri ve <span className="gold-gradient-text">Genel Hukuk Müşavirleri Ne Diyor?</span>
              </>
            ) : (
              <>
                Voices of <span className="gold-gradient-text">Business Leaders & General Counsels</span>
              </>
            )}
          </h2>

          <p className="text-[#4b4334] text-base sm:text-lg">
            {t.testimonialsSubtitle}
          </p>
        </div>

        {/* Testimonials Carousel / Featured Card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl bg-white p-8 sm:p-12 border border-[#c5a869]/40 shadow-xl font-cards-custom">
            
            {/* Top Quote Icon & Case Badge */}
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 rounded-xl bg-[#b38a38]/15 flex items-center justify-center border border-[#b38a38]/30">
                <MessageSquareQuote className="w-6 h-6 text-[#87641d]" />
              </div>

              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f4eee2] border border-[#e6ddcc] text-xs text-[#87641d] font-bold">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>{caseType}</span>
                <span className="text-[#6b6255] font-mono">({current.year})</span>
              </div>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < current.rating ? 'fill-[#b38a38] text-[#b38a38]' : 'text-slate-300'}`}
                />
              ))}
            </div>

            {/* Quote Content */}
            <blockquote className="text-lg sm:text-2xl font-serif-title text-[#181512] leading-relaxed mb-8 italic">
              "{quote}"
            </blockquote>

            {/* Client Info Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-[#e6ddcc]">
              <div className="flex items-center gap-4">
                <img
                  src={current.avatar}
                  alt={clientName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#b38a38]/50"
                />
                <div>
                  <h4 className="text-[#181512] font-bold text-base">
                    {clientName}
                  </h4>
                  <p className="text-xs text-[#87641d] font-bold">
                    {clientRole}
                  </p>
                  <p className="text-xs text-[#6b6255]">
                    {company}
                  </p>
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={prev}
                  className="p-3 rounded-full bg-[#f4eee2] hover:bg-[#b38a38] text-[#4b4334] hover:text-white transition border border-[#e6ddcc] cursor-pointer"
                  aria-label="Previous Testimonial"
                >
                  <PrevArrow className="w-5 h-5" />
                </button>

                <div className="text-xs font-mono font-bold text-[#6b6255] px-2">
                  {currentIndex + 1} / {testimonials.length}
                </div>

                <button
                  onClick={next}
                  className="p-3 rounded-full bg-[#f4eee2] hover:bg-[#b38a38] text-[#4b4334] hover:text-white transition border border-[#e6ddcc] cursor-pointer"
                  aria-label="Next Testimonial"
                >
                  <NextArrow className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Selector row */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx ? 'w-8 bg-[#b38a38]' : 'w-2 bg-[#d8ceb8] hover:bg-[#b38a38]/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
