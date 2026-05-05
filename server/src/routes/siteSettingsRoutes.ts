import { Router } from 'express';
import { authenticateJWT, requireAdmin } from '../middleware/auth.js';
import * as ctrl from '../controllers/siteSettingsController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(ctrl.getSiteSettings));
router.put('/', authenticateJWT, requireAdmin, asyncHandler(ctrl.upsertSiteSettings));

export default router;
