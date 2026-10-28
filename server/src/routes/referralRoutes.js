import express from 'express';
import {
  requestReferral,
  getMySentRequests,
  getIncomingRequests,
  updateReferralStatus
} from '../controllers/referralController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/rbacMiddleware.js';

const router = express.Router();

router.post('/request', protect, authorize('CANDIDATE', 'ADMIN'), requestReferral);
router.get('/my-requests', protect, authorize('CANDIDATE', 'ADMIN'), getMySentRequests);
router.get('/incoming', protect, authorize('REFERRER', 'ADMIN'), getIncomingRequests);
router.patch('/:id/status', protect, authorize('REFERRER', 'ADMIN'), updateReferralStatus);

export default router;
