import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import experienceRoutes from './routes/experienceRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import siteSettingsRoutes from './routes/siteSettingsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { ensureSiteUploadDir } from './middleware/siteUpload.js';

export function createApp(): express.Application {
  const app = express();
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ?? true,
      credentials: true,
    })
  );
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/skills', skillRoutes);
  app.use('/api/experience', experienceRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/site-settings', siteSettingsRoutes);
  app.use('/api/uploads', uploadRoutes);

  ensureSiteUploadDir();
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  app.use('/api/uploads-files', express.static(path.join(process.cwd(), 'uploads')));

  app.use(errorHandler);
  return app;
}
