import { processCopilotQuery, analyzeResumeContent } from '../services/aiCopilotService.js';

// @desc    Chat with ReferHire Career Copilot
// @route   POST /api/ai/copilot
// @access  Public (Contextual if authenticated)
export const chatWithCopilot = async (req, res, next) => {
  try {
    const { message, history } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message content is required.'
      });
    }

    const userId = req.user?._id;
    const role = req.user?.role;

    const result = await processCopilotQuery({
      message,
      history,
      userId,
      role
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Analyze resume text and benchmark against skills
// @route   POST /api/ai/analyze-resume
// @access  Public / Authenticated
export const analyzeResume = async (req, res, next) => {
  try {
    const { resumeText, targetJobSkills } = req.body;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least 50 characters of resume text or summary.'
      });
    }

    const analysis = analyzeResumeContent({
      resumeText,
      targetJobSkills: targetJobSkills || []
    });

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate personalized referral outreach pitch
// @route   POST /api/ai/generate-referral-pitch
// @access  Public / Authenticated
export const generatePitch = async (req, res, next) => {
  try {
    const { companyName, jobTitle, referrerName, keySkills, experienceYears } = req.body;

    const comp = companyName || 'your company';
    const title = jobTitle || 'Software Engineer';
    const ref = referrerName || 'there';
    const skills = keySkills || 'React, Node.js, and cloud systems';
    const exp = experienceYears || '2+';

    const pitches = {
      concise: `Hi ${ref}, I saw the ${title} opening at ${comp} and believe my ${exp} years building scalable systems with ${skills} makes me a strong fit. I would appreciate your consideration for an employee referral! Portfolio: [Link]`,
      respectful: `Hello ${ref}, hope you are doing well! I've been following ${comp}'s engineering milestones with admiration. With ${exp} years of hands-on expertise in ${skills}, I am eager to contribute to the ${title} requisition. If open to referring, my resume & projects are here: [Link]. Thank you for your time!`,
      technical: `Hi ${ref}, I noticed ${comp} is hiring for ${title}. In my recent work, I've architected production services using ${skills}, focusing on reliability and clean APIs. I would be thrilled to submit my credentials for your internal referral queue. Full breakdown: [Link]`
    };

    res.json({
      success: true,
      data: pitches
    });
  } catch (error) {
    next(error);
  }
};
