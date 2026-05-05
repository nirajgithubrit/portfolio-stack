import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { User } from '../models/User.js';

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(422).json({ message: 'Email and password required', code: 'VALIDATION' });
    return;
  }
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    res.status(401).json({ message: 'Invalid credentials', code: 'AUTH_FAILED' });
    return;
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    res.status(401).json({ message: 'Invalid credentials', code: 'AUTH_FAILED' });
    return;
  }
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN ?? '7d';
  if (!secret) {
    res.status(500).json({ message: 'Server misconfiguration', code: 'CONFIG' });
    return;
  }
  const signOptions: SignOptions = { expiresIn: expiresIn as SignOptions['expiresIn'] };
  const token = jwt.sign({ sub: user._id.toString(), email: user.email, role: user.role }, secret, signOptions);
  res.json({
    token,
    user: { id: user._id.toString(), email: user.email, role: user.role },
  });
}
