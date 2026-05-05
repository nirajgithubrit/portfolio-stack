import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Experience } from '../models/Experience.js';

export async function listExperience(_req: Request, res: Response): Promise<void> {
  const items = await Experience.find().sort({ order: 1, startDate: -1 }).lean();
  res.json(items);
}

export async function createExperience(req: Request, res: Response): Promise<void> {
  const doc = await Experience.create(req.body);
  res.status(201).json(doc);
}

export async function updateExperience(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(404).json({ message: 'Experience not found', code: 'NOT_FOUND' });
    return;
  }
  const doc = await Experience.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
  if (!doc) {
    res.status(404).json({ message: 'Experience not found', code: 'NOT_FOUND' });
    return;
  }
  res.json(doc);
}

export async function deleteExperience(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(404).json({ message: 'Experience not found', code: 'NOT_FOUND' });
    return;
  }
  const doc = await Experience.findByIdAndDelete(id);
  if (!doc) {
    res.status(404).json({ message: 'Experience not found', code: 'NOT_FOUND' });
    return;
  }
  res.status(204).send();
}
