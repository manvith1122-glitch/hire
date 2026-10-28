import { Application } from '../models/Application.js';
import { Job } from '../models/Job.js';
import { CandidateProfile } from '../models/CandidateProfile.js';
import { Notification } from '../models/Notification.js';
import { calculateSkillMatch } from '../services/matchService.js';

// @desc    Apply directly to a job
// @route   POST /api/applications
// @access  Private (CANDIDATE)
export const applyToJob = async (req, res, next) => {
  try {
    const { jobId, coverLetter, resumeUrl } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'Job ID is required.'
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job requisition not found.'
      });
    }

    const existing = await Application.findOne({
      jobId,
      candidateId: req.user._id
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this position.'
      });
    }

    const candidateProfile = await CandidateProfile.findOne({ userId: req.user._id });
    const match = calculateSkillMatch(
      job.skills,
      candidateProfile?.skills || [],
      job.experience.min,
      candidateProfile?.experienceYears || 0
    );

    const application = await Application.create({
      jobId,
      candidateId: req.user._id,
      companyName: job.companyName,
      isReferred: false,
      resumeUrl: resumeUrl || candidateProfile?.resume?.url || '',
      coverLetter: coverLetter || '',
      skillsMatchScore: match.matchScore,
      matchingSkills: match.matchedSkills,
      missingSkills: match.missingSkills,
      status: 'SUBMITTED',
      timeline: [
        {
          status: 'SUBMITTED',
          note: 'Application received via direct platform submission',
          updatedBy: req.user._id,
          timestamp: new Date()
        }
      ]
    });

    // Update job application count
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });

    // Notify recruiter
    await Notification.create({
      recipientId: job.postedBy,
      senderId: req.user._id,
      type: 'NEW_APPLICATION',
      title: 'New Candidate Application',
      message: `${req.user.name} applied for '${job.title}' (${match.matchScore}% Match).`,
      link: '/recruiter/dashboard'
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidate's submitted applications
// @route   GET /api/applications/my-applications
// @access  Private (CANDIDATE)
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ candidateId: req.user._id })
      .populate('jobId', 'title companyName location workMode salary status')
      .populate('referrerId', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications for a job (Recruiter view)
// @route   GET /api/applications/job/:jobId
// @access  Private (RECRUITER, ADMIN)
export const getJobApplications = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { status, isReferred, minScore } = req.query;

    const query = { jobId };
    if (status) query.status = status;
    if (isReferred !== undefined) query.isReferred = isReferred === 'true';
    if (minScore) query.skillsMatchScore = { $gte: Number(minScore) };

    const applications = await Application.find(query)
      .populate('candidateId', 'name email avatar')
      .populate('referrerId', 'name email')
      .sort({ isReferred: -1, skillsMatchScore: -1, createdAt: -1 });

    // Enrich with candidate profile details
    const enriched = await Promise.all(
      applications.map(async (app) => {
        const profile = await CandidateProfile.findOne({ userId: app.candidateId._id });
        const obj = app.toObject();
        obj.candidateProfile = profile;
        return obj;
      })
    );

    res.json({
      success: true,
      count: enriched.length,
      data: enriched
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update candidate application status in hiring pipeline
// @route   PATCH /api/applications/:id/status
// @access  Private (RECRUITER, ADMIN)
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, note, interviewDetails } = req.body;

    const validStatuses = [
      'SUBMITTED',
      'UNDER_REVIEW',
      'SHORTLISTED',
      'INTERVIEW_SCHEDULED',
      'OFFERED',
      'HIRED',
      'REJECTED'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const application = await Application.findById(req.params.id)
      .populate('jobId', 'title companyName postedBy')
      .populate('candidateId', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.'
      });
    }

    application.status = status;

    if (interviewDetails) {
      application.interviewDetails = interviewDetails;
    }

    application.timeline.push({
      status,
      note: note || `Status updated to ${status}`,
      updatedBy: req.user._id,
      timestamp: new Date()
    });

    await application.save();

    // Notify candidate
    const statusTitles = {
      UNDER_REVIEW: 'Application Under Review',
      SHORTLISTED: '⭐ You have been Shortlisted!',
      INTERVIEW_SCHEDULED: '📅 Interview Scheduled!',
      OFFERED: '🎉 Job Offer Extended!',
      HIRED: '🎊 Congratulations on getting Hired!',
      REJECTED: 'Application Status Update'
    };

    await Notification.create({
      recipientId: application.candidateId._id,
      senderId: req.user._id,
      type: status === 'INTERVIEW_SCHEDULED' ? 'INTERVIEW_SCHEDULED' : 'APPLICATION_STATUS_CHANGED',
      title: statusTitles[status] || 'Application Status Updated',
      message: `Your application for '${application.jobId.title}' at ${application.companyName} is now: ${status}. ${note ? `Note: "${note}"` : ''}`,
      link: '/candidate/dashboard'
    });

    res.json({
      success: true,
      message: `Application status transitioned to ${status}`,
      data: application
    });
  } catch (error) {
    next(error);
  }
};
