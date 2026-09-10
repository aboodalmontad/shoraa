import express from 'express';
import path from 'path';
import fs from 'fs';
import { 
  initialPartners, 
  initialPracticeAreas, 
  initialTestimonials, 
  initialBlogPosts, 
  initialCaseStudies, 
  initialContactMessages, 
  initialSiteSettings, 
  initialOffices 
} from './data/initialData';

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

export function ensurePublicDataFile() {
  try {
    if (!fs.existsSync(PUBLIC_DATA_PATH)) {
      const fallback = getFallbackData();
      fs.writeFileSync(PUBLIC_DATA_PATH, JSON.stringify(fallback, null, 2), 'utf-8');
    }
    if (!fs.existsSync(FIRMS_DATA_PATH)) {
      const initialFirms = [
        {
          id: 'firm-al-adl',
          slug: 'al-adl',
          nameAr: initialSiteSettings.firmNameAr || 'شركة العدل والريادة للمحاماة والاستشارات القانونية',
          nameEn: initialSiteSettings.firmNameEn || 'Al-Adl & Leadership Law Firm',
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
        }
      ];
      fs.writeFileSync(FIRMS_DATA_PATH, JSON.stringify(initialFirms, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Failed to initialize data files:', err);
  }
}

function generateInitialDataTSContent(data: Record<string, any>): string {
  return `import { Partner, PracticeArea, Testimonial, BlogPost, CaseStudy, SiteSettings, OfficeLocation, ContactMessage } from '../types';

export const initialSiteSettings: SiteSettings = ${JSON.stringify(data.settings || initialSiteSettings, null, 2)};
export const initialPartners: Partner[] = ${JSON.stringify(data.partners || initialPartners, null, 2)};
export const initialPracticeAreas: PracticeArea[] = ${JSON.stringify(data.practiceAreas || initialPracticeAreas, null, 2)};
export const initialTestimonials: Testimonial[] = ${JSON.stringify(data.testimonials || initialTestimonials, null, 2)};
export const initialBlogPosts: BlogPost[] = ${JSON.stringify(data.blogPosts || initialBlogPosts, null, 2)};
export const initialCaseStudies: CaseStudy[] = ${JSON.stringify(data.caseStudies || initialCaseStudies, null, 2)};
export const initialOffices: OfficeLocation[] = ${JSON.stringify(data.offices || initialOffices, null, 2)};
export const initialContactMessages: ContactMessage[] = ${JSON.stringify(data.messages || initialContactMessages, null, 2)};
`;
}

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/site-data', (_req, res) => {
  try {
    if (fs.existsSync(PUBLIC_DATA_PATH)) {
      const fileContent = fs.readFileSync(PUBLIC_DATA_PATH, 'utf-8');
      return res.json({ success: true, data: JSON.parse(fileContent) });
    }
    return res.json({ success: true, data: getFallbackData() });
  } catch (err: any) {
    return res.json({ success: true, data: getFallbackData(), error: err.message });
  }
});

app.post('/api/site-data', (req, res) => {
  try {
    const updatedData = { ...req.body, exportedAt: new Date().toISOString() };
    fs.writeFileSync(PUBLIC_DATA_PATH, JSON.stringify(updatedData, null, 2), 'utf-8');
    try {
      fs.writeFileSync(INITIAL_DATA_TS_PATH, generateInitialDataTSContent(updatedData), 'utf-8');
    } catch {}
    return res.json({ success: true, exportedAt: updatedData.exportedAt });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/consultation', (req, res) => {
  try {
    const { fullName, phone } = req.body;
    if (!fullName || !phone) return res.status(400).json({ success: false, error: 'Required fields missing' });
    const newMsg = { ...req.body, id: `msg-${Date.now()}`, status: 'new', createdAt: new Date().toISOString() };
    
    let currentData = getFallbackData();
    if (fs.existsSync(PUBLIC_DATA_PATH)) {
      currentData = JSON.parse(fs.readFileSync(PUBLIC_DATA_PATH, 'utf-8'));
    }
    currentData.messages = [newMsg, ...(currentData.messages || [])];
    fs.writeFileSync(PUBLIC_DATA_PATH, JSON.stringify(currentData, null, 2), 'utf-8');
    
    return res.json({ success: true, data: newMsg });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/firms', (_req, res) => {
  try {
    if (fs.existsSync(FIRMS_DATA_PATH)) {
      return res.json({ success: true, data: JSON.parse(fs.readFileSync(FIRMS_DATA_PATH, 'utf-8')) });
    }
    return res.json({ success: true, data: [] });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/firms/:slug', (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase().trim();
    if (!fs.existsSync(FIRMS_DATA_PATH)) return res.status(404).json({ success: false });
    const firms = JSON.parse(fs.readFileSync(FIRMS_DATA_PATH, 'utf-8'));
    const found = firms.find((f: any) => f.slug?.toLowerCase() === slug);
    if (found) return res.json({ success: true, data: found });
    return res.status(404).json({ success: false });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/firms/save', (req, res) => {
  try {
    const firm = req.body;
    let firms = fs.existsSync(FIRMS_DATA_PATH) ? JSON.parse(fs.readFileSync(FIRMS_DATA_PATH, 'utf-8')) : [];
    const index = firms.findIndex((f: any) => f.slug === firm.slug);
    if (index >= 0) firms[index] = { ...firm, updatedAt: new Date().toISOString() };
    else firms.push({ ...firm, updatedAt: new Date().toISOString() });
    fs.writeFileSync(FIRMS_DATA_PATH, JSON.stringify(firms, null, 2), 'utf-8');
    return res.json({ success: true, data: firm });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/supabase/config', (_req, res) => {
  try {
    if (fs.existsSync(SUPABASE_CONFIG_PATH)) {
      return res.json({ success: true, config: JSON.parse(fs.readFileSync(SUPABASE_CONFIG_PATH, 'utf-8')) });
    }
    return res.json({ success: true, config: { url: process.env.VITE_SUPABASE_URL || '', anonKey: process.env.VITE_SUPABASE_ANON_KEY || '' } });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/supabase/config', (req, res) => {
  try {
    fs.writeFileSync(SUPABASE_CONFIG_PATH, JSON.stringify({ ...req.body, updatedAt: new Date().toISOString() }, null, 2), 'utf-8');
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export { app };
