import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import * as ctrl from '../controllers/skillController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(ctrl.listSkills));
router.post('/', authenticateJWT, asyncHandler(ctrl.createSkill));
router.put('/:id', authenticateJWT, asyncHandler(ctrl.updateSkill));
router.delete('/:id', authenticateJWT, asyncHandler(ctrl.deleteSkill));

export default router;
