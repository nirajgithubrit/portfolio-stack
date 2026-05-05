import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import * as ctrl from '../controllers/contactController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post('/', asyncHandler(ctrl.submitContact));
router.get('/', authenticateJWT, asyncHandler(ctrl.listContacts));

export default router;
