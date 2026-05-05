import type { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';

function publicUrl(filename: string): string {
  return `/api/uploads-files/site/${filename}`;
}

export function uploadProfile(req: Request, res: Response): void {
  const file = req.file;
  if (!file) {
    res.status(400).json({ message: 'No file uploaded', code: 'NO_FILE' });
    return;
  }
  res.status(201).json({ url: publicUrl(file.filename) });
}

export function uploadLogo(req: Request, res: Response): void {
  const file = req.file;
  if (!file) {
    res.status(400).json({ message: 'No file uploaded', code: 'NO_FILE' });
    return;
  }
  res.status(201).json({ url: publicUrl(file.filename) });
}

export function uploadResume(req: Request, res: Response): void {
  const file = req.file;
  if (!file) {
    res.status(400).json({ message: 'No file uploaded', code: 'NO_FILE' });
    return;
  }
  res.status(201).json({ url: publicUrl(file.filename) });
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
