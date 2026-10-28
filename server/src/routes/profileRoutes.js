import express from 'express';
import {
  getCandidateProfile,
  updateCandidateProfile,
  getReferrerProfile,
  updateReferrerProfile,
  getActiveReferrers
} from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/rbacMiddleware.js';

const router = express.Router();

// Candidate endpoints
router.get('/candidate/me', protect, authorize('CANDIDATE', 'ADMIN'), getCandidateProfile);
router.patch('/candidate/me', protect, authorize('CANDIDATE', 'ADMIN'), updateCandidateProfile);

// Referrer endpoints
router.get('/referrer/me', protect, authorize('REFERRER', 'ADMIN'), getReferrerProfile);
router.patch('/referrer/me', protect, authorize('REFERRER', 'ADMIN'), updateReferrerProfile);

// Public / Authenticated referrers directory
router.get('/referrers', getActiveReferrers);

export default router;
