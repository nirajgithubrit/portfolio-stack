import type { Request, Response } from 'express';
import { ContactMessage } from '../models/ContactMessage.js';

export async function submitContact(req: Request, res: Response): Promise<void> {
  const { name, email, subject, message } = req.body as Record<string, string | undefined>;
  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    res.status(422).json({ message: 'All fields are required', code: 'VALIDATION' });
    return;
  }
  const doc = await ContactMessage.create({ name, email, subject, message });
  res.status(201).json({ id: doc._id.toString(), message: 'Thank you — your message was received.' });
}

export async function listContacts(_req: Request, res: Response): Promise<void> {
  const items = await ContactMessage.find().sort({ createdAt: -1 }).lean();
  res.json(items);
}
