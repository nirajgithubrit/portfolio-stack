import type { Request, Response } from 'express';
import { SiteSettings } from '../models/SiteSettings.js';

const FALLBACK_SETTINGS = {
  fullName: 'Nirajkumar Satani',
  headline: 'Full Stack Developer',
  taglineLines: ['Angular · Node · MongoDB', 'APIs, auth, and polished UI'],
  aboutSummary:
    'I build modern, reliable web products with Angular, Node.js, and MongoDB from idea to production.',
  locationLabel: 'India',
  profilePhotoUrl: '/profile.png',
  logoUrl: '/logo.png',
  resumeUrl: '/resume.pdf',
  contactEmail: '',
  phone: '',
  timezone: 'Asia/Kolkata',
  socials: [
    { platform: 'GitHub', url: 'https://github.com', icon: 'github' },
    { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
  ],
  heroStats: [],
  seoTitle: 'Nirajkumar Satani · Full Stack Developer',
  seoDescription: 'Portfolio, projects, skills, and contact of Nirajkumar Satani.',
  themeId: 'night' as const,
};

function normalizeAssetUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith('/uploads/')) return `/api/uploads-files${url.slice('/uploads'.length)}`;
  return url;
}

const VALID_THEMES = new Set(['night', 'daylight', 'ocean', 'forest', 'sunset']);

function normalizeSiteSettings<T extends Record<string, unknown>>(settings: T): T {
  const normalized = { ...settings } as T & {
    profilePhotoUrl?: string;
    logoUrl?: string;
    resumeUrl?: string;
    themeId?: string;
  };
  if (typeof normalized.profilePhotoUrl === 'string') {
    normalized.profilePhotoUrl = normalizeAssetUrl(normalized.profilePhotoUrl);
  }
  if (typeof normalized.logoUrl === 'string') {
    normalized.logoUrl = normalizeAssetUrl(normalized.logoUrl);
  }
  if (typeof normalized.resumeUrl === 'string') {
    normalized.resumeUrl = normalizeAssetUrl(normalized.resumeUrl);
  }
  if (typeof normalized.themeId !== 'string' || !VALID_THEMES.has(normalized.themeId)) {
    normalized.themeId = 'night';
  }
  return normalized;
}

export async function getSiteSettings(_req: Request, res: Response): Promise<void> {
  const doc = await SiteSettings.findOne().lean();
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.json(normalizeSiteSettings(doc ?? FALLBACK_SETTINGS));
}

export async function upsertSiteSettings(req: Request, res: Response): Promise<void> {
  const payload = req.body ?? {};
  const doc = await SiteSettings.findOneAndUpdate({}, payload, {
    new: true,
    upsert: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  });
  res.json(normalizeSiteSettings(doc?.toObject() ?? FALLBACK_SETTINGS));
}
