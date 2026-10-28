import { ReferralRequest } from '../models/ReferralRequest.js';
import { Job } from '../models/Job.js';
import { User } from '../models/User.js';
import { CandidateProfile } from '../models/CandidateProfile.js';
import { ReferrerProfile } from '../models/ReferrerProfile.js';
import { Application } from '../models/Application.js';
import { Notification } from '../models/Notification.js';
import { calculateSkillMatch } from '../services/matchService.js';

// @desc    Submit a referral request
// @route   POST /api/referrals/request
// @access  Private (CANDIDATE)
export const requestReferral = async (req, res, next) => {
  try {
    const { jobId, referrerId, pitchMessage, resumeUrl } = req.body;

    if (!jobId || !referrerId || !pitchMessage) {
      return res.status(400).json({
        success: false,
        message: 'Please provide job ID, referrer ID, and a pitch message.'
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.'
      });
    }

    const referrer = await User.findById(referrerId);
    if (!referrer || referrer.role !== 'REFERRER') {
      return res.status(400).json({
        success: false,
        message: 'Selected user is not an active referrer.'
      });
    }

    // Check duplicate request
    const existing = await ReferralRequest.findOne({
      jobId,
      candidateId: req.user._id,
      referrerId
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a referral request to this referrer for this position.'
      });
    }

    // Calculate match score
    const candidateProfile = await CandidateProfile.findOne({ userId: req.user._id });
    const match = calculateSkillMatch(
      job.skills,
      candidateProfile?.skills || [],
      job.experience.min,
      candidateProfile?.experienceYears || 0
    );

    const referralRequest = await ReferralRequest.create({
      jobId,
      candidateId: req.user._id,
      referrerId,
      companyName: job.companyName,
      pitchMessage,
      resumeUrl: resumeUrl || candidateProfile?.resume?.url || '',
      skillsMatchScore: match.matchScore,
      status: 'PENDING'
    });

    // Update job counter
    await Job.findByIdAndUpdate(jobId, { $inc: { referralRequestCount: 1 } });

    // Send notification to referrer
    await Notification.create({
      recipientId: referrerId,
      senderId: req.user._id,
      type: 'REFERRAL_REQUEST_RECEIVED',
      title: 'New Referral Request Received',
      message: `${req.user.name} requested a referral for '${job.title}' at ${job.companyName} (${match.matchScore}% Match).`,
      link: '/referrer/dashboard'
    });

    res.status(201).json({
      success: true,
      message: 'Referral request submitted successfully!',
      data: referralRequest
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all referral requests submitted by current candidate
// @route   GET /api/referrals/my-requests
// @access  Private (CANDIDATE)
export const getMySentRequests = async (req, res, next) => {
  try {
    const requests = await ReferralRequest.find({ candidateId: req.user._id })
      .populate('jobId', 'title companyName location workMode salary status')
      .populate('referrerId', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get incoming referral requests for referrer
// @route   GET /api/referrals/incoming
// @access  Private (REFERRER)
export const getIncomingRequests = async (req, res, next) => {
  try {
    const requests = await ReferralRequest.find({ referrerId: req.user._id })
      .populate('jobId', 'title companyName location salary skills')
      .populate('candidateId', 'name email avatar')
      .sort({ createdAt: -1 });

    // Enrich with candidate skills
    const enrichedRequests = await Promise.all(
      requests.map(async (r) => {
        const profile = await CandidateProfile.findOne({ userId: r.candidateId._id });
        const obj = r.toObject();
        obj.candidateProfile = profile;
        return obj;
      })
    );

    res.json({
      success: true,
      count: enrichedRequests.length,
      data: enrichedRequests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept or Reject a referral request
// @route   PATCH /api/referrals/:id/status
// @access  Private (REFERRER)
export const updateReferralStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason, referrerNotes, internalReferralId } = req.body;

    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either ACCEPTED or REJECTED.'
      });
    }

    const referral = await ReferralRequest.findById(req.params.id)
      .populate('jobId')
      .populate('candidateId', 'name email');

    if (!referral) {
      return res.status(404).json({
        success: false,
        message: 'Referral request not found.'
      });
    }

    if (referral.referrerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only review referral requests assigned to you.'
      });
    }

    referral.status = status;
    if (referrerNotes) referral.referrerNotes = referrerNotes;
    if (internalReferralId) referral.internalReferralId = internalReferralId;
    if (status === 'REJECTED') referral.rejectionReason = rejectionReason || 'Candidate qualifications did not match current internal bar.';

    let applicationCreated = null;

    if (status === 'ACCEPTED') {
      // 1. Increment referrer's stats
      await ReferrerProfile.findOneAndUpdate(
        { userId: req.user._id },
        { $inc: { totalReferralsProvided: 1 } }
      );

      // 2. Automatically convert into an Application in the recruiter pipeline marked as referred!
      const candidateProfile = await CandidateProfile.findOne({ userId: referral.candidateId._id });
      const match = calculateSkillMatch(
        referral.jobId.skills,
        candidateProfile?.skills || [],
        referral.jobId.experience.min,
        candidateProfile?.experienceYears || 0
      );

      // Check if application exists
      let existingApp = await Application.findOne({
        jobId: referral.jobId._id,
        candidateId: referral.candidateId._id
      });

      if (!existingApp) {
        existingApp = await Application.create({
          jobId: referral.jobId._id,
          candidateId: referral.candidateId._id,
          companyName: referral.jobId.companyName,
          referrerId: req.user._id,
          isReferred: true,
          resumeUrl: referral.resumeUrl,
          coverLetter: referral.pitchMessage,
          skillsMatchScore: match.matchScore,
          matchingSkills: match.matchedSkills,
          missingSkills: match.missingSkills,
          status: 'UNDER_REVIEW',
          timeline: [
            {
              status: 'UNDER_REVIEW',
              note: `Direct employee referral submitted by ${req.user.name} (${referral.referrerNotes || 'Endorsed candidate'})`,
              updatedBy: req.user._id,
              timestamp: new Date()
            }
          ]
        });

        // Increment application count on job
        await Job.findByIdAndUpdate(referral.jobId._id, { $inc: { applicationCount: 1 } });
      } else {
        existingApp.isReferred = true;
        existingApp.referrerId = req.user._id;
        existingApp.timeline.push({
          status: existingApp.status,
          note: `Endorsed by employee referrer ${req.user.name}`,
          updatedBy: req.user._id,
          timestamp: new Date()
        });
        await existingApp.save();
      }

      referral.applicationId = existingApp._id;
      referral.status = 'CONVERTED_TO_APPLICATION';
      applicationCreated = existingApp;
    }

    await referral.save();

    // Send notification to candidate
    await Notification.create({
      recipientId: referral.candidateId._id,
      senderId: req.user._id,
      type: status === 'ACCEPTED' ? 'REFERRAL_ACCEPTED' : 'REFERRAL_REJECTED',
      title: status === 'ACCEPTED' ? '🎉 Referral Request Accepted!' : 'Referral Request Update',
      message: status === 'ACCEPTED'
        ? `${req.user.name} accepted your referral for '${referral.jobId.title}' and submitted your application to ${referral.jobId.companyName}.`
        : `${req.user.name} was unable to refer you for '${referral.jobId.title}'. Feedback: "${referral.rejectionReason}"`,
      link: '/candidate/dashboard'
    });

    res.json({
      success: true,
      message: status === 'ACCEPTED' ? 'Referral accepted and submitted to hiring pipeline!' : 'Referral request declined.',
      data: {
        referral,
        application: applicationCreated
      }
    });
  } catch (error) {
    next(error);
  }
};
