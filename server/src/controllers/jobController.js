import { Job } from '../models/Job.js';
import { CandidateProfile } from '../models/CandidateProfile.js';
import { calculateSkillMatch } from '../services/matchService.js';

// @desc    Get all jobs with search, filtering, and dynamic candidate match scoring
// @route   GET /api/jobs
// @access  Public (Optional Auth for match scores)
export const getJobs = async (req, res, next) => {
  try {
    const {
      search,
      workMode,
      location,
      minSalary,
      maxExperience,
      skill,
      sort = '-createdAt',
      page = 1,
      limit = 10
    } = req.query;

    const query = { status: 'OPEN' };

    // Search query for title, companyName, description, skills
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { companyName: searchRegex },
        { skills: searchRegex },
        { description: searchRegex }
      ];
    }

    if (workMode) {
      query.workMode = workMode.toUpperCase();
    }

    if (location) {
      query.location = new RegExp(location.trim(), 'i');
    }

    if (minSalary) {
      query['salary.min'] = { $gte: Number(minSalary) };
    }

    if (maxExperience) {
      query['experience.min'] = { $lte: Number(maxExperience) };
    }

    if (skill) {
      query.skills = { $in: [skill.toLowerCase().trim()] };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const totalJobs = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate('postedBy', 'name email');

    // If logged in as CANDIDATE, compute skill match for each job
    let candidateSkills = [];
    let candidateExp = 0;

    if (req.user && req.user.role === 'CANDIDATE') {
      const candidateProfile = await CandidateProfile.findOne({ userId: req.user._id });
      if (candidateProfile) {
        candidateSkills = candidateProfile.skills || [];
        candidateExp = candidateProfile.experienceYears || 0;
      }
    }

    const enrichedJobs = jobs.map(job => {
      const jobObj = job.toObject();
      if (req.user && req.user.role === 'CANDIDATE') {
        const matchData = calculateSkillMatch(job.skills, candidateSkills, job.experience.min, candidateExp);
        jobObj.matchScore = matchData.matchScore;
        jobObj.matchedSkills = matchData.matchedSkills;
        jobObj.missingSkills = matchData.missingSkills;
        jobObj.experienceMet = matchData.experienceMet;
      }
      return jobObj;
    });

    res.json({
      success: true,
      total: totalJobs,
      totalPages: Math.ceil(totalJobs / limitNum),
      currentPage: pageNum,
      data: enrichedJobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public (Enriched if authenticated)
export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.'
      });
    }

    const jobObj = job.toObject();

    if (req.user && req.user.role === 'CANDIDATE') {
      const candidateProfile = await CandidateProfile.findOne({ userId: req.user._id });
      if (candidateProfile) {
        const matchData = calculateSkillMatch(
          job.skills,
          candidateProfile.skills || [],
          job.experience.min,
          candidateProfile.experienceYears || 0
        );
        jobObj.matchScore = matchData.matchScore;
        jobObj.matchedSkills = matchData.matchedSkills;
        jobObj.missingSkills = matchData.missingSkills;
        jobObj.experienceMet = matchData.experienceMet;
      }
    }

    res.json({
      success: true,
      data: jobObj
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new job requisition
// @route   POST /api/jobs
// @access  Private (RECRUITER, ADMIN)
export const createJob = async (req, res, next) => {
  try {
    const {
      title,
      companyName,
      companyLogo,
      workMode,
      jobType,
      location,
      salary,
      experience,
      skills,
      description,
      requirements,
      benefits,
      allowReferrals = true
    } = req.body;

    if (!title || !companyName || !location || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, company name, location, and job description.'
      });
    }

    const cleanSkills = Array.isArray(skills)
      ? skills.map(s => String(s).toLowerCase().trim()).filter(Boolean)
      : (typeof skills === 'string' ? skills.split(',').map(s => s.toLowerCase().trim()) : []);

    const job = await Job.create({
      title,
      companyName,
      companyLogo: companyLogo || '',
      postedBy: req.user._id,
      workMode: workMode || 'REMOTE',
      jobType: jobType || 'FULL_TIME',
      location,
      salary: {
        min: Number(salary?.min) || 600000,
        max: Number(salary?.max) || 1600000,
        currency: salary?.currency || 'INR',
        period: salary?.period || 'YEARLY'
      },
      experience: {
        min: Number(experience?.min) || 1,
        max: Number(experience?.max) || 4
      },
      skills: cleanSkills,
      description,
      requirements: requirements || [],
      benefits: benefits || [],
      allowReferrals
    });

    res.status(201).json({
      success: true,
      message: 'Job requisition posted successfully',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing job requisition
// @route   PATCH /api/jobs/:id
// @access  Private (RECRUITER, ADMIN)
export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.'
      });
    }

    // Verify creator or admin
    if (req.user.role !== 'ADMIN' && job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to update this job requisition.'
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Close or Pause job
// @route   DELETE /api/jobs/:id
// @access  Private (RECRUITER, ADMIN)
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found.'
      });
    }

    if (req.user.role !== 'ADMIN' && job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete or close your own postings.'
      });
    }

    job.status = 'CLOSED';
    await job.save();

    res.json({
      success: true,
      message: 'Job closed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save or Unsave a job for current candidate
// @route   POST /api/jobs/:id/save
// @access  Private (CANDIDATE)
export const toggleSaveJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    const userId = req.user._id;
    const isSaved = job.savedBy?.some(id => id.toString() === userId.toString());

    if (isSaved) {
      job.savedBy = job.savedBy.filter(id => id.toString() !== userId.toString());
      await job.save();
      return res.json({ success: true, isSaved: false, message: 'Job removed from saved list' });
    } else {
      if (!job.savedBy) job.savedBy = [];
      job.savedBy.push(userId);
      await job.save();
      return res.json({ success: true, isSaved: true, message: 'Job saved to your list' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidate's saved jobs
// @route   GET /api/jobs/saved
// @access  Private (CANDIDATE)
export const getSavedJobs = async (req, res, next) => {
  try {
    const savedJobs = await Job.find({ savedBy: req.user._id, status: 'OPEN' });
    res.json({ success: true, count: savedJobs.length, data: savedJobs });
  } catch (error) {
    next(error);
  }
};

