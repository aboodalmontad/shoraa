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
  } catch (err) {
    console.error('Failed to initialize public/site_data.json:', err);
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
