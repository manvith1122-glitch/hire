import express from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  toggleSaveJob,
  getSavedJobs
} from '../controllers/jobController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/rbacMiddleware.js';

const router = express.Router();

router.get('/', optionalProtect, getJobs);
router.get('/saved', protect, authorize('CANDIDATE', 'ADMIN'), getSavedJobs);
router.get('/:id', optionalProtect, getJobById);
router.post('/:id/save', protect, authorize('CANDIDATE', 'ADMIN'), toggleSaveJob);
router.post('/', protect, authorize('RECRUITER', 'ADMIN'), createJob);
router.patch('/:id', protect, authorize('RECRUITER', 'ADMIN'), updateJob);
router.delete('/:id', protect, authorize('RECRUITER', 'ADMIN'), deleteJob);

export default router;
