import { Router, type NextFunction, type Request, type RequestHandler, type Response } from 'express';
import { authenticateJWT, requireAdmin } from '../middleware/auth.js';
import * as ctrl from '../controllers/uploadController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  uploadSiteLogoImage,
  uploadSiteProfileImage,
  uploadSiteResumePdf,
} from '../middleware/siteUpload.js';

const router = Router();

function wrapUpload(mw: RequestHandler) {
  return (req: Request, res: Response, next: NextFunction): void => {
    mw(req, res, (err: unknown) => {
      if (err) {
        ctrl.handleMulterError(err, req, res, next);
        return;
      }
      next();
    });
  };
}

router.post(
  '/site/profile',
  authenticateJWT,
  requireAdmin,
  wrapUpload(uploadSiteProfileImage),
  asyncHandler(ctrl.uploadProfile)
);
router.post(
  '/site/logo',
  authenticateJWT,
  requireAdmin,
  wrapUpload(uploadSiteLogoImage),
  asyncHandler(ctrl.uploadLogo)
);
router.post(
  '/site/resume',
  authenticateJWT,
  requireAdmin,
  wrapUpload(uploadSiteResumePdf),
  asyncHandler(ctrl.uploadResume)
);

export default router;
