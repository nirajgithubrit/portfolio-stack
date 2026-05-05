import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Skill } from '../models/Skill.js';

export async function listSkills(_req: Request, res: Response): Promise<void> {
  const items = await Skill.find().sort({ order: 1, name: 1 }).lean();
  res.json(items);
}

export async function createSkill(req: Request, res: Response): Promise<void> {
  const doc = await Skill.create(req.body);
  res.status(201).json(doc);
}

export async function updateSkill(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(404).json({ message: 'Skill not found', code: 'NOT_FOUND' });
    return;
  }
  const doc = await Skill.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
  if (!doc) {
    res.status(404).json({ message: 'Skill not found', code: 'NOT_FOUND' });
    return;
  }
  res.json(doc);
}

export async function deleteSkill(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(404).json({ message: 'Skill not found', code: 'NOT_FOUND' });
    return;
  }
  const doc = await Skill.findByIdAndDelete(id);
  if (!doc) {
    res.status(404).json({ message: 'Skill not found', code: 'NOT_FOUND' });
    return;
  }
  res.status(204).send();
}
