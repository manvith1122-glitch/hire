import express from 'express';
import { chatWithCopilot, analyzeResume, generatePitch } from '../controllers/aiController.js';
import { optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/copilot', optionalProtect, chatWithCopilot);
router.post('/analyze-resume', optionalProtect, analyzeResume);
router.post('/generate-referral-pitch', optionalProtect, generatePitch);

export default router;
