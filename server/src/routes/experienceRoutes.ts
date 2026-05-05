import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import * as ctrl from '../controllers/experienceController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(ctrl.listExperience));
router.post('/', authenticateJWT, asyncHandler(ctrl.createExperience));
router.put('/:id', authenticateJWT, asyncHandler(ctrl.updateExperience));
router.delete('/:id', authenticateJWT, asyncHandler(ctrl.deleteExperience));

export default router;
