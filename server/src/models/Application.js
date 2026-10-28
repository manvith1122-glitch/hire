import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    companyName: {
      type: String,
      required: true
    },
    referrerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    isReferred: {
      type: Boolean,
      default: false,
      index: true
    },
    resumeUrl: {
      type: String,
      default: ''
    },
    coverLetter: {
      type: String,
      default: ''
    },
    skillsMatchScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    matchingSkills: [{ type: String }],
    missingSkills: [{ type: String }],
    status: {
      type: String,
      enum: [
        'SUBMITTED',
        'UNDER_REVIEW',
        'SHORTLISTED',
        'INTERVIEW_SCHEDULED',
        'OFFERED',
        'HIRED',
        'REJECTED'
      ],
      default: 'SUBMITTED',
      index: true
    },
    interviewDetails: {
      scheduledAt: Date,
      meetingLink: String,
      roundName: String,
      feedback: String
    },
    timeline: [
      {
        status: { type: String, required: true },
        note: { type: String, default: '' },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        timestamp: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

export const Application = mongoose.model('Application', applicationSchema);
