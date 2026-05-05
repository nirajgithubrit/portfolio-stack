import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(422).json({ message: err.message, code: 'VALIDATION', details: err.errors });
    return;
  }
  if (err instanceof mongoose.Error.CastError) {
    res.status(404).json({ message: 'Invalid id', code: 'NOT_FOUND' });
    return;
  }
  const message = err instanceof Error ? err.message : 'Internal Server Error';
  const status = (err as { status?: number })?.status ?? 500;
  const code = (err as { code?: string })?.code ?? 'SERVER_ERROR';
  res.status(status).json({ message, code });
}
