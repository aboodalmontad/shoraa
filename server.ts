import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { 
  initialPartners, 
  initialPracticeAreas, 
  initialTestimonials, 
  initialBlogPosts, 
  initialCaseStudies, 
  initialContactMessages, 
  initialSiteSettings, 
  initialOffices 
} from './src/data/initialData';

const PORT = 3000;
const PUBLIC_DATA_PATH = path.join(process.cwd(), 'public', 'site_data.json');
const FIRMS_DATA_PATH = path.join(process.cwd(), 'public', 'firms_data.json');
const SUPABASE_CONFIG_PATH = path.join(process.cwd(), 'public', 'supabase_config.json');
const INITIAL_DATA_TS_PATH = path.join(process.cwd(), 'src', 'data', 'initialData.ts');

function getFallbackData() {
  return {
    partners: initialPartners,
    practiceAreas: initialPracticeAreas,
    testimonials: initialTestimonials,
    blogPosts: initialBlogPosts,
    caseStudies: initialCaseStudies,
    messages: initialContactMessages,
    settings: initialSiteSettings,
    offices: initialOffices,
    exportedAt: new Date().toISOString(),
  };
}

function ensurePublicDataFile() {
  try {
    if (!fs.existsSync(PUBLIC_DATA_PATH)) {
      const fallback = getFallbackData();
      fs.writeFileSync(PUBLIC_DATA_PATH, JSON.stringify(fallback, null, 2), 'utf-8');
      console.log('Initialized public/site_data.json with rich default firm data');
    } else {
      const content = fs.readFileSync(PUBLIC_DATA_PATH, 'utf-8').trim();
      if (!content || content === '{}') {
        const fallback = getFallbackData();
        fs.writeFileSync(PUBLIC_DATA_PATH, JSON.stringify(fallback, null, 2), 'utf-8');
        console.log('Populated empty public/site_data.json with rich initial data');
      }
    }

    if (!fs.existsSync(FIRMS_DATA_PATH)) {
      const initialFirms = [
        {
          id: 'firm-al-adl',
          slug: 'al-adl',
          nameAr: initialSiteSettings.firmNameAr || 'شركة العدل والريادة للمحاماة والاستشارات القانونية',
          nameEn: initialSiteSettings.firmNameEn || 'Al-Adl & Leadership Law Firm',
          nameTr: initialSiteSettings.firmNameTr || 'Al-Adl Hukuk Bürosu',
          taglineAr: initialSiteSettings.sloganAr || 'ريادة قانونية وحلول استراتيجية رصينة',
          taglineEn: initialSiteSettings.sloganEn || 'Legal Excellence & Strategic Counsel',
          cityAr: 'الرياض',
          cityEn: 'Riyadh',
          phone: initialSiteSettings.contactPhone || '+966 11 456 7890',
          email: initialSiteSettings.contactEmail || 'contact@aladl-law.com',
          adminPassword: initialSiteSettings.adminPassword || 'AlAdlAdmin2025',
          isVerified: true,
          featured: true,
          themeColor: '#c5a869',
          createdAt: '2024-01-10T10:00:00Z',
          updatedAt: new Date().toISOString(),
          data: getFallbackData(),
        },
        {
          id: 'firm-nahwi',
          slug: 'nahwi-law',
          nameAr: 'مكتب المستشار أحمد النحوي للمحاماة والاستشارات الدولية',
          nameEn: 'Avocat A. Nahwi International Law Firm',
          taglineAr: 'دقة قانونية، تحكيم دولي، وتمثيل قضائي رفيع المستوى',
          taglineEn: 'Elite Legal Representation & Global Arbitration',
          cityAr: 'دبي والرياض',
          cityEn: 'Dubai & Riyadh',
          phone: '+971 4 888 9922',
          email: 'avocat.a.nahwi@gmail.com',
          adminPassword: '123456',
          isVerified: true,
          featured: true,
          themeColor: '#2563eb',
          createdAt: '2024-02-15T12:00:00Z',
          updatedAt: new Date().toISOString(),
          data: {
            ...getFallbackData(),
            settings: {
              ...initialSiteSettings,
              firmNameAr: 'مكتب المستشار أحمد النحوي للمحاماة والاستشارات القانونية الدولية',
              firmNameEn: 'Avocat A. Nahwi International Law Firm & Legal Consultants',
              sloganAr: 'دقة قانونية، تحكيم دولي، وتمثيل قضائي رفيع المستوى',
              contactEmail: 'avocat.a.nahwi@gmail.com',
              contactPhone: '+971 4 888 9922',
              adminPassword: '123456',
            },
          },
        },
        {
          id: 'firm-nokhba',
          slug: 'al-nokhba',
          nameAr: 'مجموعة النخبة للمحاماة والنزاعات المصرفية',
          nameEn: 'Al-Nokhba Banking & Commercial Law Group',
          taglineAr: 'حماية الاستثمارات وحوكمة الكيانات المالية الكبرى',
          taglineEn: 'Safeguarding Capital & Financial Institutions Governance',
          cityAr: 'جدة',
          cityEn: 'Jeddah',
          phone: '+966 12 654 3210',
          email: 'info@alnokhba-legal.com',
          adminPassword: '123456',
          isVerified: true,
          featured: false,
          themeColor: '#059669',
          createdAt: '2024-03-01T09:00:00Z',
          updatedAt: new Date().toISOString(),
          data: getFallbackData(),
        }
      ];
      fs.writeFileSync(FIRMS_DATA_PATH, JSON.stringify(initialFirms, null, 2), 'utf-8');
      console.log('Initialized public/firms_data.json with multi-tenant law firms');
    }
  } catch (err) {
    console.error('Failed to initialize data files:', err);
  }
}

// Generate valid TypeScript content for src/data/initialData.ts
function generateInitialDataTSContent(data: Record<string, any>): string {
  const settings = data.settings || initialSiteSettings;
  const partners = data.partners || initialPartners;
  const practiceAreas = data.practiceAreas || initialPracticeAreas;
  const testimonials = data.testimonials || initialTestimonials;
  const blogPosts = data.blogPosts || initialBlogPosts;
  const caseStudies = data.caseStudies || initialCaseStudies;
  const offices = data.offices || initialOffices;
  const messages = data.messages || initialContactMessages;

  return `import { Partner, PracticeArea, Testimonial, BlogPost, CaseStudy, SiteSettings, OfficeLocation, ContactMessage } from '../types';

export const initialSiteSettings: SiteSettings = ${JSON.stringify(settings, null, 2)};

export const initialPartners: Partner[] = ${JSON.stringify(partners, null, 2)};

export const initialPracticeAreas: PracticeArea[] = ${JSON.stringify(practiceAreas, null, 2)};

export const initialTestimonials: Testimonial[] = ${JSON.stringify(testimonials, null, 2)};

export const initialBlogPosts: BlogPost[] = ${JSON.stringify(blogPosts, null, 2)};

export const initialCaseStudies: CaseStudy[] = ${JSON.stringify(caseStudies, null, 2)};

export const initialOffices: OfficeLocation[] = ${JSON.stringify(offices, null, 2)};

export const initialContactMessages: ContactMessage[] = ${JSON.stringify(messages, null, 2)};
`;
}

async function startServer() {
  ensurePublicDataFile();

  const app = express();

  // Support large payloads for base64 images, long legal texts, and comprehensive site data
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API 1: Health check
  app.get('/api/health', (_req, res) => {
    res.json({ 
      status: 'ok', 
      uptime: process.uptime(),
      timestamp: new Date().toISOString() 
    });
  });

  // API 2: Get global live site data (accessible to any visitor in the world)
  app.get('/api/site-data', (_req, res) => {
    try {
      if (fs.existsSync(PUBLIC_DATA_PATH)) {
        const fileContent = fs.readFileSync(PUBLIC_DATA_PATH, 'utf-8');
        const parsed = JSON.parse(fileContent);
        if (parsed && (parsed.partners || parsed.settings)) {
          return res.json({
            success: true,
            data: parsed,
            source: 'server_public_file',
            timestamp: parsed.exportedAt || new Date().toISOString(),
          });
        }
      }
      // If file didn't have full data, return fallback
      const fallback = getFallbackData();
      return res.json({
        success: true,
        data: fallback,
        source: 'server_fallback',
        timestamp: fallback.exportedAt,
      });
    } catch (err: any) {
      console.error('Error serving /api/site-data:', err);
      const fallback = getFallbackData();
      return res.json({
        success: true,
        data: fallback,
        source: 'server_error_fallback',
        error: err.message,
      });
    }
  });

  // API 3: Save and publish updated site data globally
  app.post('/api/site-data', (req, res) => {
    try {
      const incomingData = req.body;
      if (!incomingData || typeof incomingData !== 'object') {
        return res.status(400).json({ success: false, error: 'Invalid data payload provided' });
      }

      // Read current data to merge safely if needed
      let currentData: Record<string, any> = {};
      try {
        if (fs.existsSync(PUBLIC_DATA_PATH)) {
          currentData = JSON.parse(fs.readFileSync(PUBLIC_DATA_PATH, 'utf-8'));
        }
      } catch {
        currentData = getFallbackData();
      }

      const updatedData = {
        ...currentData,
        ...incomingData,
        exportedAt: new Date().toISOString(),
      };

      // Write to public/site_data.json
      fs.writeFileSync(PUBLIC_DATA_PATH, JSON.stringify(updatedData, null, 2), 'utf-8');

      // Also update src/data/initialData.ts so any new builds or clones have the updated data by default
      try {
        const tsCode = generateInitialDataTSContent(updatedData);
        fs.writeFileSync(INITIAL_DATA_TS_PATH, tsCode, 'utf-8');
      } catch (tsErr) {
        console.warn('Could not update initialData.ts (non-fatal):', tsErr);
      }

      console.log('Successfully saved and published live site data globally at', updatedData.exportedAt);

      return res.json({
        success: true,
        message: 'تم حفظ ونشر وتحديث كافة البيانات في الخادم بنجاح ليراها جميع الزوار حول العالم فوراً',
        exportedAt: updatedData.exportedAt,
      });
    } catch (err: any) {
      console.error('Failed to save /api/site-data:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API 4: Consultation inquiry submission from visitors
  app.post('/api/consultation', (req, res) => {
    try {
      const { fullName, email, phone, company, consultationType, preferredDate, isUrgent, message } = req.body;
      if (!fullName || !phone) {
        return res.status(400).json({ success: false, error: 'Full name and phone are required' });
      }

      const newMsg = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        fullName,
        email: email || '',
        phone,
        company: company || '',
        consultationType: consultationType || 'استشارة عامة',
        preferredDate: preferredDate || '',
        isUrgent: !!isUrgent,
        message: message || '',
        status: 'new' as const,
        createdAt: new Date().toISOString(),
      };

      let currentData: Record<string, any> = {};
      try {
        if (fs.existsSync(PUBLIC_DATA_PATH)) {
          currentData = JSON.parse(fs.readFileSync(PUBLIC_DATA_PATH, 'utf-8'));
        }
      } catch {
        currentData = getFallbackData();
      }

      const currentMessages = Array.isArray(currentData.messages) ? currentData.messages : [];
      const updatedMessages = [newMsg, ...currentMessages];
      currentData.messages = updatedMessages;
      currentData.exportedAt = new Date().toISOString();

      fs.writeFileSync(PUBLIC_DATA_PATH, JSON.stringify(currentData, null, 2), 'utf-8');

      return res.json({
        success: true,
        message: 'تم إرسال طلب الاستشارة بنجاح وحفظه في لوحة الإدارة',
        data: newMsg,
      });
    } catch (err: any) {
      console.error('Failed to handle /api/consultation:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API 5: Get all law firms (Multi-Tenant Directory)
  app.get('/api/firms', (_req, res) => {
    try {
      if (fs.existsSync(FIRMS_DATA_PATH)) {
        const fileContent = fs.readFileSync(FIRMS_DATA_PATH, 'utf-8');
        const parsed = JSON.parse(fileContent);
        if (Array.isArray(parsed)) {
          return res.json({ success: true, data: parsed, count: parsed.length });
        }
      }
      return res.json({ success: true, data: [], count: 0 });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API 6: Get specific law firm by slug
  app.get('/api/firms/:slug', (req, res) => {
    try {
      const slug = req.params.slug.toLowerCase().trim();
      if (!fs.existsSync(FIRMS_DATA_PATH)) {
        return res.status(404).json({ success: false, error: 'Firms data not found' });
      }
      const firms = JSON.parse(fs.readFileSync(FIRMS_DATA_PATH, 'utf-8'));
      if (Array.isArray(firms)) {
        const found = firms.find((f: any) => f.slug?.toLowerCase() === slug);
        if (found) {
          return res.json({ success: true, data: found });
        }
      }
      return res.status(404).json({ success: false, error: 'Law firm not found' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API 7: Save or update a law firm
  app.post('/api/firms/save', (req, res) => {
    try {
      const firm = req.body;
      if (!firm || !firm.slug) {
        return res.status(400).json({ success: false, error: 'Firm object with valid slug is required' });
      }

      let firms: any[] = [];
      if (fs.existsSync(FIRMS_DATA_PATH)) {
        try {
          firms = JSON.parse(fs.readFileSync(FIRMS_DATA_PATH, 'utf-8'));
        } catch {
          firms = [];
        }
      }

      const index = firms.findIndex((f) => f.slug === firm.slug || f.id === firm.id);
      const updatedFirm = {
        ...firm,
        updatedAt: new Date().toISOString(),
      };

      if (index >= 0) {
        firms[index] = updatedFirm;
      } else {
        firms.push(updatedFirm);
      }

      fs.writeFileSync(FIRMS_DATA_PATH, JSON.stringify(firms, null, 2), 'utf-8');

      // If this is the active default firm (e.g. al-adl), also update site_data.json
      if (firm.data && firm.slug === 'al-adl') {
        try {
          fs.writeFileSync(PUBLIC_DATA_PATH, JSON.stringify(firm.data, null, 2), 'utf-8');
        } catch {}
      }

      return res.json({
        success: true,
        message: 'تم حفظ وتحديث بيانات المكتب على الخادم العام بنجاح',
        data: updatedFirm,
      });
    } catch (err: any) {
      console.error('Failed to save firm:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API 8: Sync batch of all firms
  app.post('/api/firms/sync-all', (req, res) => {
    try {
      const { firms } = req.body;
      if (!Array.isArray(firms)) {
        return res.status(400).json({ success: false, error: 'firms array required' });
      }
      fs.writeFileSync(FIRMS_DATA_PATH, JSON.stringify(firms, null, 2), 'utf-8');
      return res.json({ success: true, count: firms.length, message: 'All firms synchronized' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API 9: Consultation inquiry for specific firm
  app.post('/api/firms/:slug/consultation', (req, res) => {
    try {
      const slug = req.params.slug.toLowerCase().trim();
      const { fullName, email, phone, company, consultationType, preferredDate, isUrgent, message } = req.body;
      if (!fullName || !phone) {
        return res.status(400).json({ success: false, error: 'Full name and phone are required' });
      }

      const newMsg = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        fullName,
        email: email || '',
        phone,
        company: company || '',
        consultationType: consultationType || 'استشارة عامة',
        preferredDate: preferredDate || '',
        isUrgent: !!isUrgent,
        message: message || '',
        status: 'new' as const,
        createdAt: new Date().toISOString(),
      };

      if (fs.existsSync(FIRMS_DATA_PATH)) {
        const firms = JSON.parse(fs.readFileSync(FIRMS_DATA_PATH, 'utf-8'));
        const firm = firms.find((f: any) => f.slug?.toLowerCase() === slug);
        if (firm && firm.data) {
          if (!Array.isArray(firm.data.messages)) {
            firm.data.messages = [];
          }
          firm.data.messages.unshift(newMsg);
          fs.writeFileSync(FIRMS_DATA_PATH, JSON.stringify(firms, null, 2), 'utf-8');
        }
      }

      return res.json({ success: true, message: 'تم إرسال طلب الاستشارة للمكتب بنجاح', data: newMsg });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API 10: Get stored Supabase configuration
  app.get('/api/supabase/config', (_req, res) => {
    try {
      if (fs.existsSync(SUPABASE_CONFIG_PATH)) {
        const raw = fs.readFileSync(SUPABASE_CONFIG_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        return res.json({ success: true, config: parsed });
      }

      // Check environment variables as fallback
      const envUrl = process.env.VITE_SUPABASE_URL || '';
      const envKey = process.env.VITE_SUPABASE_ANON_KEY || '';
      if (envUrl && envKey) {
        return res.json({
          success: true,
          config: {
            url: envUrl,
            anonKey: envKey,
            tableName: 'law_firms',
            source: 'env',
          },
        });
      }

      return res.json({
        success: true,
        config: {
          url: '',
          anonKey: '',
          tableName: 'law_firms',
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API 11: Save Supabase configuration persistently
  app.post('/api/supabase/config', (req, res) => {
    try {
      const { url, anonKey, tableName } = req.body;
      const config = {
        url: (url || '').trim(),
        anonKey: (anonKey || '').trim(),
        tableName: (tableName || 'law_firms').trim(),
        updatedAt: new Date().toISOString(),
      };
      fs.writeFileSync(SUPABASE_CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
      return res.json({ success: true, message: 'تم حفظ إعدادات Supabase بنجاح على الخادم', config });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Vite development middleware or static production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Law Firm Full-Stack Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
