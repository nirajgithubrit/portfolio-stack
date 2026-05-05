import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import * as ctrl from '../controllers/projectController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(ctrl.listProjects));
router.post('/', authenticateJWT, asyncHandler(ctrl.createProject));
router.put('/:id', authenticateJWT, asyncHandler(ctrl.updateProject));
router.delete('/:id', authenticateJWT, asyncHandler(ctrl.deleteProject));

export default router;
