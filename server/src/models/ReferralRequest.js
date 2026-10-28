import mongoose from 'mongoose';

const referralRequestSchema = new mongoose.Schema(
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
    referrerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    companyName: {
      type: String,
      required: true
    },
    pitchMessage: {
      type: String,
      required: [true, 'Please include a short pitch explaining why you are a great fit'],
      trim: true
    },
    resumeUrl: {
      type: String,
      default: ''
    },
    skillsMatchScore: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CONVERTED_TO_APPLICATION'],
      default: 'PENDING',
      index: true
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    referrerNotes: {
      type: String,
      default: ''
    },
    internalReferralId: {
      type: String,
      default: ''
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      default: null
    }
  },
  {
    timestamps: true
  }
);

referralRequestSchema.index({ jobId: 1, candidateId: 1, referrerId: 1 }, { unique: true });

export const ReferralRequest = mongoose.model('ReferralRequest', referralRequestSchema);
