import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { randomBytes } from 'crypto';

const SITE_SUBDIR = 'site';

export function getSiteUploadDir(): string {
  return path.join(process.cwd(), 'uploads', SITE_SUBDIR);
}

export function ensureSiteUploadDir(): void {
  const dir = getSiteUploadDir();
  fs.mkdirSync(dir, { recursive: true });
}

const allowedImage = /^image\/(jpeg|png|webp)$/i;

function safeExt(originalname: string, fallback: string): string {
  const ext = path.extname(originalname).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.webp', '.pdf'].includes(ext)) return ext;
  return fallback;
}

function uniqueFilename(originalname: string, fallbackExt: string): string {
  return `${Date.now()}-${randomBytes(8).toString('hex')}${safeExt(originalname, fallbackExt)}`;
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureSiteUploadDir();
    cb(null, getSiteUploadDir());
  },
  filename: (_req, file, cb) => {
    const fallback = file.mimetype === 'application/pdf' ? '.pdf' : '.png';
    cb(null, uniqueFilename(file.originalname, fallback));
  },
});

const imageLimits = { fileSize: 5 * 1024 * 1024 };
const pdfLimits = { fileSize: 8 * 1024 * 1024 };

export const uploadSiteProfileImage = multer({
  storage,
  limits: imageLimits,
  fileFilter: (_req, file, cb) => {
    if (allowedImage.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPEG, PNG, or WebP images are allowed.'));
  },
}).single('file');

export const uploadSiteLogoImage = multer({
  storage,
  limits: imageLimits,
  fileFilter: (_req, file, cb) => {
    if (allowedImage.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPEG, PNG, or WebP images are allowed.'));
  },
}).single('file');

export const uploadSiteResumePdf = multer({
  storage,
  limits: pdfLimits,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed for resume.'));
  },
}).single('file');
