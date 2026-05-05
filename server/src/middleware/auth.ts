import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export type JwtUser = { sub: string; email: string; role: string };

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}

export function authenticateJWT(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    res.status(401).json({ message: 'Unauthorized', code: 'NO_TOKEN' });
    return;
  }
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET missing');
    const payload = jwt.verify(token, secret) as JwtUser;
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token', code: 'INVALID_TOKEN' });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ message: 'Forbidden', code: 'FORBIDDEN' });
    return;
  }
  next();
}
