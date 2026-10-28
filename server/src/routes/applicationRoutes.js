import express from 'express';
import {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus
} from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/rbacMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('CANDIDATE', 'ADMIN'), applyToJob);
router.get('/my-applications', protect, authorize('CANDIDATE', 'ADMIN'), getMyApplications);
router.get('/job/:jobId', protect, authorize('RECRUITER', 'ADMIN'), getJobApplications);
router.patch('/:id/status', protect, authorize('RECRUITER', 'ADMIN'), updateApplicationStatus);

export default router;
