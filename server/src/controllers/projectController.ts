import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Project } from '../models/Project.js';

export async function listProjects(_req: Request, res: Response): Promise<void> {
  const items = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
  res.json(items);
}

export async function createProject(req: Request, res: Response): Promise<void> {
  try {
    const doc = await Project.create(req.body);
    res.status(201).json(doc);
  } catch (e) {
    if ((e as { code?: number }).code === 11000) {
      res.status(422).json({ message: 'Slug must be unique', code: 'DUPLICATE' });
      return;
    }
    throw e;
  }
}

export async function updateProject(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(404).json({ message: 'Project not found', code: 'NOT_FOUND' });
    return;
  }
  try {
    const doc = await Project.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!doc) {
      res.status(404).json({ message: 'Project not found', code: 'NOT_FOUND' });
      return;
    }
    res.json(doc);
  } catch (e) {
    if ((e as { code?: number }).code === 11000) {
      res.status(422).json({ message: 'Slug must be unique', code: 'DUPLICATE' });
      return;
    }
    throw e;
  }
}

export async function deleteProject(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(404).json({ message: 'Project not found', code: 'NOT_FOUND' });
    return;
  }
  const doc = await Project.findByIdAndDelete(id);
  if (!doc) {
    res.status(404).json({ message: 'Project not found', code: 'NOT_FOUND' });
    return;
  }
  res.status(204).send();
}
