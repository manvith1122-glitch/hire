import { CandidateProfile } from '../models/CandidateProfile.js';
import { ReferrerProfile } from '../models/ReferrerProfile.js';
import { User } from '../models/User.js';

// @desc    Get Candidate Profile
// @route   GET /api/profiles/candidate/me
// @access  Private (CANDIDATE)
export const getCandidateProfile = async (req, res, next) => {
  try {
    let profile = await CandidateProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = await CandidateProfile.create({
        userId: req.user._id,
        skills: ['react', 'node.js', 'mongodb', 'express']
      });
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Candidate Profile
// @route   PATCH /api/profiles/candidate/me
// @access  Private (CANDIDATE)
export const updateCandidateProfile = async (req, res, next) => {
  try {
    const { headline, bio, location, skills, experienceYears, experience, education, projects, portfolio, github, linkedin, availability } = req.body;

    let profile = await CandidateProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new CandidateProfile({ userId: req.user._id });
    }

    if (headline !== undefined) profile.headline = headline;
    if (bio !== undefined) profile.bio = bio;
    if (location !== undefined) profile.location = location;
    if (skills !== undefined) {
      profile.skills = Array.isArray(skills) 
        ? skills.map(s => String(s).toLowerCase().trim()).filter(Boolean)
        : [];
    }
    if (experienceYears !== undefined) profile.experienceYears = Number(experienceYears);
    if (experience !== undefined) profile.experience = experience;
    if (education !== undefined) profile.education = education;
    if (projects !== undefined) profile.projects = projects;
    if (portfolio !== undefined) profile.portfolio = portfolio;
    if (github !== undefined) profile.github = github;
    if (linkedin !== undefined) profile.linkedin = linkedin;
    if (availability !== undefined) profile.availability = availability;

    await profile.save();

    res.json({
      success: true,
      message: 'Candidate profile updated successfully',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Referrer Profile
// @route   GET /api/profiles/referrer/me
// @access  Private (REFERRER)
export const getReferrerProfile = async (req, res, next) => {
  try {
    let profile = await ReferrerProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = await ReferrerProfile.create({
        userId: req.user._id,
        companyName: 'TechCorp',
        role: 'Senior Staff Engineer'
      });
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Referrer Profile
// @route   PATCH /api/profiles/referrer/me
// @access  Private (REFERRER)
export const updateReferrerProfile = async (req, res, next) => {
  try {
    const { companyName, role, department, referralCriteria, isActive } = req.body;

    let profile = await ReferrerProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new ReferrerProfile({ userId: req.user._id });
    }

    if (companyName !== undefined) profile.companyName = companyName;
    if (role !== undefined) profile.role = role;
    if (department !== undefined) profile.department = department;
    if (referralCriteria !== undefined) profile.referralCriteria = referralCriteria;
    if (isActive !== undefined) profile.isActive = isActive;

    await profile.save();

    res.json({
      success: true,
      message: 'Referrer profile updated successfully',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all active referrers
// @route   GET /api/profiles/referrers
// @access  Public / Authenticated
export const getActiveReferrers = async (req, res, next) => {
  try {
    const { company, search } = req.query;
    const query = { isActive: true };

    if (company) {
      query.companyName = new RegExp(company, 'i');
    }

    const referrers = await ReferrerProfile.find(query)
      .populate('userId', 'name email avatar')
      .sort({ rating: -1, totalReferralsProvided: -1 });

    res.json({
      success: true,
      count: referrers.length,
      data: referrers
    });
  } catch (error) {
    next(error);
  }
};
