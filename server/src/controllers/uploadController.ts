import type { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';
import fs from 'fs/promises';
import { isCloudinaryEnabled, uploadToCloudinary } from '../utils/cloudinary.js';

function publicUrl(filename: string): string {
  return `/api/uploads-files/site/${filename}`;
}

async function resolveUrl(file: Express.Multer.File, resourceType: 'image' | 'raw'): Promise<string> {
  if (!isCloudinaryEnabled()) {
    return publicUrl(file.filename);
  }

  try {
    const url = await uploadToCloudinary(file.path, 'portfolio-stack/site', resourceType);
    await fs.unlink(file.path).catch(() => undefined);
    return url;
  } catch (err) {
    await fs.unlink(file.path).catch(() => undefined);
    const message = err instanceof Error ? err.message : 'Upload failed';
    const wrapped = new Error(`Cloud upload failed: ${message}`) as Error & { status?: number; code?: string };
    wrapped.status = 502;
    wrapped.code = 'CLOUD_UPLOAD_FAILED';
    throw wrapped;
  }
}

export async function uploadProfile(req: Request, res: Response): Promise<void> {
  const file = req.file;
  if (!file) {
    res.status(400).json({ message: 'No file uploaded', code: 'NO_FILE' });
    return;
  }
  const url = await resolveUrl(file, 'image');
  res.status(201).json({ url });
}

export async function uploadLogo(req: Request, res: Response): Promise<void> {
  const file = req.file;
  if (!file) {
    res.status(400).json({ message: 'No file uploaded', code: 'NO_FILE' });
    return;
  }
  const url = await resolveUrl(file, 'image');
  res.status(201).json({ url });
}

export async function uploadResume(req: Request, res: Response): Promise<void> {
  const file = req.file;
  if (!file) {
    res.status(400).json({ message: 'No file uploaded', code: 'NO_FILE' });
    return;
  }
  const url = await resolveUrl(file, 'raw');
  res.status(201).json({ url });
}

export function handleMulterError(err: unknown, _req: Request, res: Response, next: NextFunction): void {
  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(413).json({ message: 'File too large', code: 'FILE_TOO_LARGE' });
      return;
    }
    res.status(400).json({ message: err.message, code: err.code });
    return;
  }
  if (err instanceof Error) {
    res.status(400).json({ message: err.message, code: 'UPLOAD_REJECTED' });
    return;
  }
  next(err);
}
